from rest_framework import filters, mixins, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import User
from .serializers import UserSerializer
from .permissions import IsSystemAdmin, IsSystemAdminOrImplementAdmin


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    groups = list(request.user.groups.values_list("name", flat=True))
    return Response(
        {
            "id": request.user.id,
            "email": request.user.email,
            "name": request.user.name,
            "faculty": request.user.faculty,
            "status": request.user.status,
            "roles": groups if groups else ["Miembro de la Comunidad"],
        }
    )


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.prefetch_related("groups").order_by("date_joined")
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["email", "name"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            # Ambos roles pueden listar y ver detalle
            return [IsAuthenticated(), IsSystemAdminOrImplementAdmin()]
        # Solo el admin del sistema puede modificar roles, estado y eliminar
        return [IsAuthenticated(), IsSystemAdmin()]

    def get_queryset(self):
        queryset = User.objects.prefetch_related("groups").order_by("date_joined")
        role_filter = self.request.query_params.get("groups__name")

        if role_filter == "Miembro de la Comunidad":
            # Usuarios sin ningún grupo asignado
            return queryset.filter(groups__isnull=True)
        elif role_filter:
            return queryset.filter(groups__name=role_filter)

        return queryset

    def partial_update(self, request, *args, **kwargs):
        # Un Administrador de Sistema no puede cambiarle el rol de atro Adnministrador del Sistema
        target = self.get_object()
        if target.groups.filter(name="Administrador del Sistema").exists():
            raise PermissionDenied(
                "No se puede modificar a un Administrador del Sistema."
            )

        # El administrador de implementos solo puede modificar su status, no los roles
        if request.user.groups.filter(name="Administrador de Implementos").exists():
            # Conjunto de campos permitidos
            allowed_fields = {"status"}
            # Obtiene el conjunto de claves de todos los elementos a modificar
            requested_fields = set(request.data.keys())
            disallowed = requested_fields - allowed_fields  # Diferencia de conjuntos
            if disallowed:  # Si hay elementos que se intentan modificar se le niega
                raise PermissionDenied(
                    "El Administrador de Implementos solo puede modificar el estado del usuario."
                )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        target = self.get_object()
        if target.groups.filter(name="Administrador del Sistema").exists():
            raise PermissionDenied(
                "No se puede modificar a un Administrador del Sistema."
            )
        return super().destroy(request, *args, **kwargs)
