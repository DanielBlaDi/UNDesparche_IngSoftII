from rest_framework import serializers

from django.utils import timezone

from users.models import User
from .models import Event


class EmailSubscriptionSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name"]


class EventSerializer(serializers.ModelSerializer):
    organizer = OrganizerSerializer(read_only=True)
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "description",
            "published",
            "place",
            "latitude",
            "longitude",
            "datetime_start",
            "datetime_end",
            "organizer",
            "status",
            "category",
            "image",
            "is_subscribed",
        ]
        read_only_fields = ["id", "is_subscribed", "published"]

    def get_is_subscribed(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.subscriptions.filter(user=request.user).exists()

    def validate(self, data):
        datetime_start = data.get(
            "datetime_start", self.instance.datetime_start if self.instance else None
        )
        datetime_end = data.get(
            "datetime_end", self.instance.datetime_end if self.instance else None
        )

        # Si estoy creando evento y hay una fecha inicial y esta es mayor a la actual, no hay problema
        if (
            (self.instance is None)
            and (datetime_start is not None)
            and (datetime_start < timezone.now())
        ):
            raise serializers.ValidationError(
                {
                    "datetime_start": (
                        "La fecha y hora de inicio no puede ser anterior a la fecha y hora actual."
                    )
                }
            )

        # Si hay una fecha inicial, hay una fecha final y la inicial es menor a la final, no hay problema
        if (
            (datetime_start is not None)
            and (datetime_end is not None)
            and (datetime_end <= datetime_start)
        ):
            raise serializers.ValidationError(
                {
                    "datetime_end": "La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio."
                }
            )

        return data
