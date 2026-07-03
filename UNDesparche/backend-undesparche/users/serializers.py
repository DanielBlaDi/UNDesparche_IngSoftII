from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Group.objects.all(), source="groups"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "name",
            "faculty",
            "status",
            "is_active",
            "roles",
            "date_joined",
        ]
        read_only_fields = [
            "id",
            "email",
            "name",
            "date_joined",
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data["roles"]:
            data["roles"] = ["Miembro de la Comunidad"]
        return data
    
    def validate(self, data):
        roles = data.get("groups")  # SlugRelatedField usa source="groups"
        faculty = data.get("faculty", self.instance.faculty if self.instance else None)
        
        if roles is not None:
            role_names = [g.name for g in roles]
            if "Administrador de Implementos" in role_names and not faculty:
                raise serializers.ValidationError(
                    {"faculty": "Debe asignar una facultad al Administrador de Implementos."}
                )
        
        return data
