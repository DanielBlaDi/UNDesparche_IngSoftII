from rest_framework.permissions import BasePermission


class IsEventOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name="Administrador del Sistema").exists(): # RF 28, admin sistema modificar  eliminar cualquier evento
            return True
        return obj.organizer == request.user


class IsSystemAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="Administrador del Sistema").exists()
        )


class IsSystemAdminOrEventAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name__in=[
                    "Administrador del Sistema",
                    "Administrador de Eventos",
                ]
            ).exists()
        )
