from rest_framework.permissions import BasePermission


class IsSystemAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="Administrador del Sistema").exists()
        )


class IsImplementAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name="Administrador del Implementos"
            ).exists()
        )
