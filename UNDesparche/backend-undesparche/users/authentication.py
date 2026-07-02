from django.contrib.auth.models import Group

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from django.conf import settings

from .models import User

if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": settings.FIREBASE_STORAGE_BUCKET,
        },
    )


class FirebaseAuthentication(BaseAuthentication):
    """
    Clase de autenticación personalizada para Django Rest Framework que utiliza Firebase para autenticar usuarios.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        # Extrae el token de la cabecera de autorización
        id_token = auth_header.split(" ").pop()

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
        except firebase_auth.InvalidIdTokenError:
            raise AuthenticationFailed("Token de Firebase invalido.")
        except Exception:
            raise AuthenticationFailed("No se pudo verificar el token.")

        name = decoded_token.get("name", "")
        email = decoded_token.get("email")
        firebase_uid = decoded_token.get("uid")

        if not email or not email.endswith("@unal.edu.co"):
            raise AuthenticationFailed(
                "El correo debe pertenecer al dominio @unal.edu.co"
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "firebase_uid": firebase_uid,
                "name": name,
            },
        )

        if created:
            try:
                community_group = Group.objects.get(name="Miembro de la Comunidad")
                user.groups.add(community_group)
            except Group.DoesNotExist:
                raise Group.DoesNotExist(
                    "ERROR: El grupo 'Miembro de la Comunidad' no existe"
                )
        else:
            updated_fields = []
            if user.firebase_uid != firebase_uid:
                user.firebase_uid = firebase_uid
                updated_fields.append("firebase_uid")

            if user.name != name and name:
                user.name = name
                updated_fields.append("name")

            if updated_fields:
                user.save(update_fields=updated_fields)

        if not user.is_active:
            raise AuthenticationFailed("Usuario inactivo.")

        return (user, None)
