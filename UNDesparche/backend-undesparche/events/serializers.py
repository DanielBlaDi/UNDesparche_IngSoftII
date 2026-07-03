from rest_framework import serializers
from django.utils import timezone
from .models import Event
from .models import User

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
            "datetime_start",
            "datetime_end",
            "organizer",
            "status",
            "category",
            "image",
            "is_subscribed",
        ]
        read_only_fields = [
            "id",
            "is_subscribed"
        ]
    
    def get_is_subscribed(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.subscriptions.filter(user=request.user).exists()

    def validate(self, data):
        # Revisa si anda creando evento o actualizando este
        if self.instance is not None:
            default_datetime_start = self.instance.datetime_start
            default_datetime_end = self.instance.datetime_end
        else:
            default_datetime_start = None
            default_datetime_end = None

        datetime_start = data.get("datetime_start",default_datetime_start)
        datetime_end = data.get("datetime_end", default_datetime_end)
        # Si estoy creando evento y hay una fecha inicial y esta es mayor a la actual, no hay problema
        if ((self.instance is None) and (datetime_start is not None) and (datetime_start < timezone.now())):
            raise serializers.ValidationError({
                "datetime_start": (
                    "La fecha y hora de inicio no puede ser anterior a la fecha y hora actual."
                )
            })

        # Si hay una fecha inicial, hay una fecha final y la inicial es menir a la final, no hay problema
        if (datetime_start is not None) and (datetime_end is not None) and (datetime_end <= datetime_start):
            raise serializers.ValidationError(
                {
                    "datetime_end": "La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio."
                }
            )

        return data