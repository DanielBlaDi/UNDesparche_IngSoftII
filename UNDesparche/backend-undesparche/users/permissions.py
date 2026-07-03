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
                name="Administrador de Implementos"
            ).exists()
        )


class IsSystemAdminOrImplementAdmin(BasePermission):
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
