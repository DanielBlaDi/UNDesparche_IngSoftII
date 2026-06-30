from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "email": request.user.email,
        "name": request.user.name,
        "faculty": request.user.faculty,
        "status": request.user.status,
        "roles": list(request.user.groups.values_list("name", flat=True)),
        "is_new": not request.user.faculty,
    })