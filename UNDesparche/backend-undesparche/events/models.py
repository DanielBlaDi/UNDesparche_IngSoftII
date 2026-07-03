from django.db import models
from django.core.validators import EmailValidator

from users.models import User


class Event(models.Model):

    STATUS_CHOICES = [
        ("PRO", "Programado"),
        ("ECU", "En Curso"),
        ("CAN", "Cancelado"),
        ("FIN", "Finalizado"),
    ]

    CATEGORY_CHOICES = [
        ("ACA", "Académico"),
        ("CUL", "Cultural"),
        ("DEP", "Deportes"),
        ("ASA", "Asamblea"),
        ("PAR", "Parche"),
        ("OTR", "Otro"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    published = models.BooleanField(default=False)
    place = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    datetime_start = models.DateTimeField()
    datetime_end = models.DateTimeField()
    organizer = models.ForeignKey(
        "users.User", on_delete=models.PROTECT, related_name="organized_events"
    )
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default="PRO")
    category = models.CharField(
        max_length=3, choices=CATEGORY_CHOICES, blank=True, null=True
    )
    image = models.URLField(max_length=500, null=True, blank=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        ordering = ["datetime_start"]

    def __str__(self):
        return f"{self.name} ({self.status})"

    def is_editable(self):
        return not self.published


class Subscription(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="subscriptions"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="subscriptions",
        null=True,
        blank=True,
    )
    notification_email = models.EmailField(validators=[EmailValidator()], blank=True)

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"
        # Un usuario registrado no puede suscribirse dos veces al mismo evento
        constraints = [
            models.UniqueConstraint(
                fields=["event", "user"],
                condition=models.Q(user__isnull=False),
                name="unique_subscription_per_user",
            )
        ]

    def __str__(self):
        who = self.user.email if self.user else self.notification_email
        return f"{who} subscribed to {self.event.name}"
