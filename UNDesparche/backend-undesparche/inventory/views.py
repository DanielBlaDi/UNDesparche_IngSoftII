from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from rest_framework import filters, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend
from core.firebase_storage import upload_image, delete_image

from .models import Borrowing, Implement, Reserve
from .serializers import (
    BorrowingSerializer,
    ImplementSerializer,
    ReserveSerializer,
    ReserveAdminSerializer,
)
from .permissions import IsSystemAdminOrImplementAdmin


class ImplementViewSet(viewsets.ModelViewSet):
    serializer_class = ImplementSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {"category": ["exact"], "faculty": ["exact"]}
    search_fields = ["name", "description"]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return Implement.objects.all().order_by("name")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsSystemAdminOrImplementAdmin()]

    def perform_create(self, serializer):
        image_file = self.request.FILES.get("image_file")
        image_url = upload_image(image_file, folder="inventory") if image_file else None

        user = self.request.user
        if user.groups.filter(name="Administrador del Sistema").exists():
            # El Admin del Sistema manda la facultad en el body
            faculty = self.request.data.get("faculty")
            if not faculty:
                raise ValidationError(
                    {
                        "faculty": "El Administrador del Sistema debe especificar la facultad del implemento."
                    }
                )
        else:
            # El Admin de Implementos usa su propia facultad
            faculty = user.faculty

        serializer.save(faculty=faculty, image=image_url)

    def perform_update(self, serializer):
        # Se verifica que el implemento pertenece a la facultad a
        # que está adscrito el Administrador de Implementos
        self.check_object_permissions(self.request, self.get_object())

        instance = self.get_object()
        image_file = self.request.FILES.get("image_file")

        if image_file:
            if instance.image:
                delete_image(instance.image)
            image_url = upload_image(image_file, folder="inventory")
            serializer.save(image=image_url)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        if instance.image:
            delete_image(instance.image)  # Elimina la imágen del implemento
        return super().perform_destroy(instance)


class ReserveViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post"]

    def get_queryset(self):
        user = self.request.user

        # El Administrador de Implementos puede ver las reservas activas de su facultad
        if user.groups.filter(name="Administrador de Implementos").exists():
            return Reserve.objects.filter(
                active=True, implement__faculty=user.faculty
            ).select_related("user", "implement")

        if user.groups.filter(name="Administrador del Sistema").exists():
            return Reserve.objects.all().select_related("user", "implement")

        # Un Miembro de la Comunidad solo verá sus propias reservas
        return Reserve.objects.filter(user=user).select_related("implement")

    def get_permissions(self):
        if self.action in ["create", "list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsSystemAdminOrImplementAdmin()]

    def get_serializer_class(self):
        user = self.request.user
        if (
            user.groups.filter(name="Administrador de Implementos").exists()
            or user.groups.filter(name="Administrador del Sistema").exists()
        ):
            return ReserveAdminSerializer
        return ReserveSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            implement = Implement.objects.select_for_update().get(
                pk=self.request.data.get("implement")
            )

            if implement.state != "DIS":
                raise ValidationError(
                    {"implement": "Este implemento no está disponible para reservar."}
                )

            now = timezone.now()
            reserve = serializer.save(
                user=self.request.user,
                implement=implement,
                datetime_reserved=now,
                datetime_expiration=now + timedelta(minutes=10),
                active=True,
            )

            implement.state = "RES"
            implement.save(update_fields=["state"])

            return reserve

    @action(detail=True, methods=["post"], url_path="confirm")
    def confirm(self, request, pk=None):
        """
        Para confirmar la entrega física del implemento.
        Cierra la reserva y crea el Borrowing correspondiente.
        """
        reserve = self.get_object()

        if not reserve.active:
            raise ValidationError({"detail": "Esta reserva ya no está activa."})

        with transaction.atomic():
            reserve.active = False
            reserve.save(update_fields=["active"])

            # Crea el préstamo
            borrowing = Borrowing.objects.create(
                user=reserve.user,
                implement=reserve.implement,
                datetime_borrowed=timezone.now(),
                active=True,
            )

            reserve.implement.state = "PRE"
            reserve.implement.save(update_fields=["state"])

        return Response(BorrowingSerializer(borrowing).data)

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        """
        Para que el Administrador de Implementos cancele de forma manual
        una reserva.
        Libera el implemento de vuelta a 'Disponible'
        """
        reserve = self.get_object()

        if not reserve.active:
            raise ValidationError({"detail": "Esta reserva ya no está activa."})

        with transaction.atomic():
            reserve.active = False
            reserve.save(update_fields=["active"])

            reserve.implement.state = "DIS"
            reserve.implement.save(update_fields=["state"])

        return Response({"detail": "Reserva cancelada correctamente."})


class BorrowingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post"]
    serializer_class = BorrowingSerializer

    def get_queryset(self):
        user = self.request.user

        # El Administrador de Implementos ve los préstamos de su facultad
        if user.groups.filter(name="Administrador de Implementos").exists():
            return Borrowing.objects.filter(
                implement__faculty=user.faculty,
            ).select_related("user", "implement")

        if user.groups.filter(name="Administrador del Sistema").exists():
            return Borrowing.objects.all().select_related("user", "implement")

        # El Miembro de la Comunidad ve sus propios préstamos
        return Borrowing.objects.filter(user=user).select_related("implement")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsSystemAdminOrImplementAdmin()]

    @action(detail=True, methods=["post"], url_path="return")
    def return_implement(self, request, pk=None):
        """
        El Administrador de Implementos confirma la devolución física del implemento.
        Cierra el prestamo y libera el implemento.
        """
        borrowing = self.get_object()

        if not borrowing.active:
            raise ValidationError({"detail": "Este préstamo ya fue cerrado"})

        with transaction.atomic():
            borrowing.active = False
            borrowing.datetime_return = timezone.now()
            borrowing.save(update_fields=["active", "datetime_return"])

            borrowing.implement.state = "DIS"
            borrowing.implement.save(update_fields=["state"])

        return Response({"detail": "Devolución registrada correctamente."})
