from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters, status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from core.firebase_storage import upload_image, delete_image

from notifications.services import (
    notify_event_subscribers,
    notify_subscription_confirmed,
    notify_unsubscription_confirmed,
)

from .models import Event, Subscription
from .serializers import EventSerializer, EmailSubscriptionSerializer
from .permissions import IsSystemAdminOrEventAdmin, IsEventOwner


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    http_method_names = ["get", "post", "patch", "delete"]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = {
        "category": ["exact", "in"],
        "status": ["exact", "in"],
        "published": ["exact", "in"],
    }
    search_fields = ["name", "place"]
    ordering_fields = ["name", "datetime_start"]
    ordering = ["datetime_start"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "subscribe", "unsubscribe"]:
            return [AllowAny()]
        if self.action in ["create"]:
            return [IsAuthenticated(), IsSystemAdminOrEventAdmin()]
        if self.action in ["partial_update", "publish", "destroy"]:
            return [IsAuthenticated(), IsSystemAdminOrEventAdmin(), IsEventOwner()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Event.objects.select_related("organizer")
        user = self.request.user
        if user.is_anonymous:
            return queryset.filter(published=True)
        return queryset.filter(Q(published=True) | Q(organizer=user))

    def perform_create(self, serializer):
        image_file = self.request.FILES.get("image_file")
        image_url = upload_image(image_file, folder="events") if image_file else None
        serializer.save(organizer=self.request.user, image=image_url)

    def perform_update(self, serializer):
        event = self.get_object()
        if not event.is_editable():
            raise PermissionDenied(
                "No es posible modificar un evento publicado que este cancelado o finalizado."
            )

        previous_state = event.status
        previous_datetime_start = event.datetime_start

        image_file = self.request.FILES.get("image_file")
        if image_file:
            if event.image:
                delete_image(event.image)
            image_url = upload_image(image_file, folder="events")
            updated_event = serializer.save(image=image_url)
        else:
            updated_event = serializer.save()

        if updated_event.status == "CAN" and previous_state != "CAN":
            notify_event_subscribers(event=updated_event, change_type="cancelled")
        elif updated_event.datetime_start != previous_datetime_start:
            notify_event_subscribers(event=updated_event, change_type="rescheduled")

    def perform_destroy(self, instance):
        is_system_admin = self.request.user.groups.filter(
            name="Administrador del Sistema"
        ).exists()

        if instance.published and not is_system_admin:
            raise PermissionDenied(
                "Solo el administrador del sistema puede eliminar eventos publicados."
            )

        if instance.image:
            delete_image(instance.image)
        super().perform_destroy(instance)

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        event = self.get_object()

        if event.published:
            raise ValidationError({"detail": "El evento ya esta publicado."})

        if event.status in ["CAN", "FIN"]:
            raise ValidationError(
                {"detail": ("No es posible publicar un evento cancelado o finalizado.")}
            )

        event.published = True
        event.save(update_fields=["published"])
        serializer = self.get_serializer(event)

        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="subscribe")
    def subscribe(self, request, pk=None):
        event = self.get_object()
        user = request.user

        if not event.published:
            raise ValidationError(
                {"detail": "Solo es posible suscribirse a eventos publicados."}
            )

        if event.status in ["CAN", "FIN"]:
            raise ValidationError(
                {
                    "detail": "No es posible suscribirse a un evento cancelado o finalizado."
                }
            )

        if user.is_authenticated:
            if Subscription.objects.filter(event=event, user=user).exists():
                raise ValidationError({"detail": "Ya estás suscrito a este evento."})
            subscription = Subscription.objects.create(event=event, user=user)
        else:
            serializer = EmailSubscriptionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data["email"]

            if Subscription.objects.filter(
                event=event, notification_email=email
            ).exists():
                raise ValidationError(
                    {"detail": "Ese correo ya está suscrito a este evento."}
                )
            subscription = Subscription.objects.create(
                event=event, notification_email=email
            )

        notify_subscription_confirmed(subscription)

        return Response(
            {"detail": "Suscripción realizada correctamente."},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="unsubscribe")
    def unsubscribe(self, request, pk=None):
        event = self.get_object()
        user = request.user

        if user.is_authenticated:
            subscription = Subscription.objects.filter(event=event, user=user).first()
            if subscription is None:
                raise ValidationError({"detail": "No estás suscrito a este evento."})
        else:
            serializer = EmailSubscriptionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data["email"]
            subscription = Subscription.objects.filter(
                event=event, notification_email=email
            ).first()

            if subscription is None:
                raise ValidationError(
                    {"detail": "Ese correo no está suscrito a este evento."}
                )

        notify_unsubscription_confirmed(subscription)

        subscription.delete()
        return Response({"detail": "Suscripción cancelada correctamente."})
