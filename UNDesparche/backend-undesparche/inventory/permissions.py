from rest_framework.permissions import BasePermission


class IsImplementAdminOfSameFaculty(BasePermission):
    """
    El usuario debe ser Administrador de Implementos y
    el implemento debe pertenecer a su misma facultad.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="Administrador de Implementos").exists()
        )

    def has_object_permission(self, request, view, obj):
        # En el caso de objetos de tipo Implement se verifíca directamente
        # si la facultad coincide con la del Administrador de Implementos
        if hasattr(obj, "faculty"):
            return obj.faculty == request.user.faculty

        # Para objetos Reserve y Borrowing la facultad se halla a través
        # de su relación con Implement
        if hasattr(obj, "implement"):
            return obj.implement.faculty == request.user.faculty
