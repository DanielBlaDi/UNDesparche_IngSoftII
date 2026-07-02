from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Group.objects.all()
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
