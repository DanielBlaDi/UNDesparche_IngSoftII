from rest_framework import serializers

from .models import Borrowing, Implement, Reserve


class ImplementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Implement
        fields = [
            "id",
            "name",
            "category",
            "faculty",
            "state",
            "description",
            "image",
        ]
        read_only_fields = ["id", "faculty"]

    def validate_state(self, value):
        """
        No se puede cambiar el estado a 'Reservado' o 'Prestado' manualmente;
        esos estados los maneja el sistema via Reserve y Borrowing
        """
        if value in ("RES", "PRE"):
            raise serializers.ValidationError(
                "El estado Reservado y Prestado solo puede ser asignado por el sistema."
            )
        return value


class ReserveSerializer(serializers.ModelSerializer):
    """
    Serializer para que un Miembro de la Comunidad cree una reserva.
    """

    implement_name = serializers.CharField(source="implement.name", read_only=True)
    implement_state = serializers.CharField(source="implement.state", read_only=True)

    class Meta:
        model = Reserve
        fields = [
            "id",
            "implement",
            "implement_name",
            "implement_state",
            "datetime_reserved",
            "datetime_expiration",
            "active",
        ]
        read_only_fields = [
            "id",
            "implement_name",
            "implement_state",
            "datetime_reserved",
            "datetime_expiration",
            "active",
        ]
        # Solo se puede recibir 'implement', es decir, el 'id' del implemento a reservar.

    def validate_implement(self, implement):
        # El implemento debe estar disponible
        if implement.state != "DIS":
            raise serializers.ValidationError(
                "Este implemento no está disponible para reservar."
            )

        return implement

    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request else None

        if Reserve.objects.filter(user=user, active=True).exists():
            raise serializers.ValidationError(
                "Ya tienes una reserva activa. Solo se permite una reserva a la vez."
            )

        if Borrowing.objects.filter(user=user, active=True).exists():
            raise serializers.ValidationError(
                "Tienes un préstamo activo. No puedes realizar una reserva."
            )

        return data


class ReserveAdminSerializer(serializers.ModelSerializer):
    """
    Serializer para que el Administrador de Implementos gestione las reservas.
    Muestra más información que ReserveSerializer.
    """

    implement_name = serializers.CharField(source="implement.name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Reserve
        fields = [
            "id",
            "implement",
            "implement_name",
            "user",
            "user_email",
            "user_name",
            "datetime_reserved",
            "datetime_expiration",
            "active",
        ]
        read_only_fields = [
            "id",
            "implement",
            "implement_name",
            "user",
            "user_email",
            "user_name",
            "datetime_reserved",
            "datetime_expiration",
        ]
        # El admin solo puede cambiar 'active' para confirmar o cancelar la reserva


class BorrowingSerializer(serializers.ModelSerializer):
    """
    Serializer para que el Administrador de Implementos gestione préstamos.
    """

    implement_name = serializers.CharField(source="implement.name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Borrowing
        fields = [
            "id",
            "implement",
            "implement_name",
            "user",
            "user_email",
            "user_name",
            "datetime_reserved",
            "datetime_return",
            "active",
        ]
        read_only_fields = [
            "id",
            "implement",
            "implement_name",
            "user",
            "user_email",
            "user_name",
            "datetime_borrowed",
        ]
