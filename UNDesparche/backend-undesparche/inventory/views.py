from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from rest_framework import filters, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend

from .models import Borrowing, Implement, Reserve
from .serializers import (
    BorrowingSerializer,
    ImplementSerializer,
    ReserveSerializer,
    ReserveAdminSerializer,
)
from .permissions import IsImplementAdminOfSameFaculty


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
        return [IsAuthenticated(), IsImplementAdminOfSameFaculty()]

    def perform_create(self, serializer):
        # Se asigna la faculta del usuario al implemento
        serializer.save(faculty=self.request.user.faculty)

    def perform_update(self, serializer):
        # Se verifica que el implemento pertenece a la facultad a
        # que está adscrito el Administrador de Implementos
        self.check_object_permissions(self.request, self.get_object())
        serializer.save()


class ReserveViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post", "patch"]

    def get_queryset(self):
        user = self.request.user

        # El Administrador de Implementos puede ver las reservas activas de su facultad
        if user.groups.filter(name="Administrador de Implementos").exists():
            return Reserve.objects.filter(
                active=True, implement__faculty=user.faculty
            ).select_related("user", "implement")

        # Un Miembro de la Comunidad solo verá sus propias reservas
        return Reserve.objects.filter(user=user).select_related("implement")

    def get_permissions(self):
        if self.action in ["create", "list", "retrieve"]:
            return [IsAuthenticated()]

        # partial_update solo será para Administradores de Implementos
        return [IsAuthenticated(), IsImplementAdminOfSameFaculty()]

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name="Administrador de Implementos").exists():
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

        # El Miembro de la Comunidad ve sus propios préstamos
        return Borrowing.objects.filter(user=user).select_related("implement")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsImplementAdminOfSameFaculty()]

    @action(detail=True, methods=["post"], url_path="return")
    def return_implement(self, request, pk=None):
        """
        El Administrador del Sistema confirma la devolución física del implemento.
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
