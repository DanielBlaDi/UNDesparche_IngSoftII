from rest_framework.permissions import BasePermission


class IsSystemAdminOrImplementAdmin(BasePermission):
    """
    El usuario debe ser Administrador de Implementos y
    el implemento debe pertenecer a su misma facultad,
    o simplemente ser Administrador del Sistema.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name__in=[
                    "Administrador del Sistema",
                    "Administrador de Implementos",
                ]
            ).exists()
        )

    def has_object_permission(self, request, view, obj):
        # El Administrador del Sistema puede trabajar con cualquier implemento
        if request.user.groups.filter(name="Administrador del Sistema").exists():
            return True

        # En el caso de objetos de tipo Implement se verifíca directamente
        # si la facultad coincide con la del Administrador de Implementos
        if hasattr(obj, "faculty"):
            return obj.faculty == request.user.faculty

        # Para objetos Reserve y Borrowing la facultad se halla a través
        # de su relación con Implement
        if hasattr(obj, "implement"):
            return obj.implement.faculty == request.user.faculty

        return False
