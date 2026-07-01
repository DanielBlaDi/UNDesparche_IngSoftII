from django.db import models
from users.models import User

class Implement(models.Model):
    CATEGORY_CHOICES = [
        ("BAL", "Balones"),
        ("RAQ", "Raquetas"),
        ("MES", "Mesas"),
        ("JUR", "Juegos recreativos"),
        ("JUM", "Juegos de mesa"),
        ("OTS", "Otros")
    ]

    FACULTIES = [
        ("ART", "Artes"),
        ("CCS", "Ciencias"),
        ("CIA", "Ciencias Agrarias"),
        ("CIE", "Ciencias Económicas"),
        ("CHS", "Ciencias Humanas"),
        ("DER", "Derecho, Ciencias Políticas y Sociales"),
        ("ENF", "Enfermería"),
        ("ING", "Ingeniería"),
        ("MED", "Medicina"),
        ("MVZ", "Medicina Veterinaria y Zootecnia"),
        ("ODO", "Odontología"),
    ]

    STATE_CHOICES = [
        ("DIS", "Disponible"),
        ("NDS", "No Disponible"),
        ("RES", "Reservado"),
        ("PRS", "Prestado"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=3, 
        choices=CATEGORY_CHOICES, 
        blank=True
    )
    faculty = models.CharField(
        max_length=3, 
        choices=FACULTIES, 
        blank=True, 
        null=True
    )
    state = models.CharField(
        max_length=3, 
        choices=STATE_CHOICES, 
        default="NDS"
    )
    description = models.TextField()
    image = models.URLField(
        max_length=500, 
        blank=True,
        null=True
        )
    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.state}) ({self.category})"



class Reserve(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reserves",
        null=True,
        blank=True,
    )
    implement = models.ForeignKey(
        Implement, 
        on_delete=models.CASCADE, 
        related_name="reserves"
    )
    datetime_reserved = models.DateTimeField()
    datetime_expiration = models.DateTimeField(
        null=True,
        blank=True,
    )
    active = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Reserve"
        verbose_name_plural = "Reserves"
        # Un usuario registrado no puede reservar dos implementos a la vez
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=models.Q(active=True),
                name="one_active_reserve_per_user",
            )
        ]
    def __str__(self):
        who = self.user.email
        return f"{who} has ({self.implement.name}) ({self.implement.state})"




class Borrowing(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="borrows",
        null=True,
        blank=True,
    )
    implement = models.ForeignKey(
        Implement, 
        on_delete=models.CASCADE, 
        related_name="borrows"
    )
    datetime_borrowed = models.DateTimeField()
    datetime_return = models.DateTimeField(
        null=True,
        blank=True,
    )
    active = models.BooleanField(default=False)
    class Meta:
        verbose_name = "Borrowing"
        verbose_name_plural = "Borrowings"
        # Un usuario registrado no puede pedir prestado dos implementos a la vez
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=models.Q(active=True),
                name="one_active_borrowing_per_user",
            )
        ]
    def __str__(self):
        who = self.user.email
        return f"{who} has ({self.implement.name}) ({self.implement.state})"