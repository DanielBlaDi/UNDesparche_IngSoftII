from rest_framework import filters, mixins, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import User
from .serializers import UserSerializer
from .permissions import IsImplementAdmin, IsSystemAdmin


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(
        {
            "email": request.user.email,
            "name": request.user.name,
            "faculty": request.user.faculty,
            "status": request.user.status,
            "roles": list(request.user.groups.values_list("name", flat=True)),
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
    filterset_fields = {
        "status": ["exact"],
        "groups__name": ["exact"],
    }
    search_fields = ["email", "name"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            # Ambos roles pueden listar y ver detalle
            return [IsAuthenticated(), IsSystemAdmin() | IsImplementAdmin()]
        # Solo el admin del sistema puede modificar roles, estado y eliminar
        return [IsAuthenticated(), IsSystemAdmin()]

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
