from django.test import TestCase

from unittest.mock import patch

from rest_framework.test import APIClient
from rest_framework import status

from firebase_admin import auth as firebase_auth

from .models import User


class FirebaseAuthenticationTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.protected_url = "/users/me/"

    @patch("users.authentication.firebase_auth.verify_id_token")
    def test_valid_token_creates_new_user(self, mock_verify):
        mock_verify.return_value = {
            "email": "estudiante@unal.edu.co",
            "uid": "firebase-uid-123",
        }

        response = self.client.get(
            self.protected_url,
            HTTP_AUTHORIZATION="Bearer token-falso-pero-valido",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(email="estudiante@unal.edu.co").exists())

    @patch("users.authentication.firebase_auth.verify_id_token")
    def test_valid_token_recognizes_existing_user(self, mock_verify):
        User.objects.create_user(
            email="ya_existe@unal.edu.co", firebase_uid="uid-viejo"
        )
        mock_verify.return_value = {
            "email": "ya_existe@unal.edu.co",
            "uid": "uid-viejo",
        }

        response = self.client.get(
            self.protected_url,
            HTTP_AUTHORIZATION="Bearer token-falso",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)  # no se duplicó

    @patch("users.authentication.firebase_auth.verify_id_token")
    def test_invalid_email_is_rejected(self, mock_verify):
        mock_verify.return_value = {
            "email": "alguien@gmail.com",
            "uid": "firebase-uid-999",
        }

        response = self.client.get(
            self.protected_url,
            HTTP_AUTHORIZATION="Bearer token-falso",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("users.authentication.firebase_auth.verify_id_token")
    def test_expired_token_is_rejected(self, mock_verify):
        mock_verify.side_effect = firebase_auth.ExpiredIdTokenError(
            "expirado", cause=None
        )

        response = self.client.get(
            self.protected_url,
            HTTP_AUTHORIZATION="Bearer token-expirado",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
