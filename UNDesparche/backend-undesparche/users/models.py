from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError


def validate_unal_email(value):
    if not value.endswith("@unal.edu.co"):
        raise ValidationError("El correo debe pertenecer al dominio @unal.edu.co")


class MyUserManager(UserManager):

    def _create_user(self, email, password=None, **extra_fields):
        """
        Esta función crea y guarda un User dado un email; password es opcional.
        """
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """
        Crea y guarda un User dado un email; password es opcional.
        """
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Crea y guarda un superuser dado un email; password es opcional.
        """
        if not password:
            raise ValueError("El superusuario debe tener una contraseña.")

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):

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

    STATUS_OPTIONS = [
        ("ACT", "activo"),
        ("SAN", "sancionado"),
    ]

    username = None
    first_name = None
    last_name = None
    
    email = models.EmailField(
        unique=True,
        validators=[
            EmailValidator(),
            validate_unal_email,
        ],
    )
    name = models.CharField(max_length=150, blank=True)
    faculty = models.CharField(max_length=3, choices=FACULTIES, blank=True, null=True)
    status = models.CharField(max_length=3, choices=STATUS_OPTIONS, default="ACT")
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    def __str__(self):
        return self.email
