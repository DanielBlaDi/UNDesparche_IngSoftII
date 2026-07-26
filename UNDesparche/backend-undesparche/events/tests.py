from django.test import TestCase
from unittest.mock import patch

from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import Group

# Imagenes
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

from users.models import User
from .models import Event, Subscription


class BaseEventTestCase(TestCase):

    def create_user(self, email, name, group=None):
        user = User.objects.create(email=email, name=name)
        if group:
            user.groups.add(group)
        return user

    def create_event(self, user, published):
        event = Event.objects.create(
            name=f"Evento tenis - {user.name}",
            description="Tenisssss event",
            organizer=user,
            place="Cancha tenis",
            latitude=30.5,
            longitude=-10.65,
            category="DEP",
            status="PRO",
            published=published,
            datetime_start=timezone.now() + timedelta(days=5),
            datetime_end=timezone.now() + timedelta(days=7, hours=2),
        )
        return event

    def authenticate(self, user):
        self.client.force_authenticate(user)

    def event_url(self):
        return reverse("events:events-list")

    def event_detail_url(self, event_id):
        return reverse("events:events-detail", kwargs={"pk": event_id})

    def publish_url(self, event_id):
        return reverse("events:events-publish", kwargs={"pk": event_id})

    def subscribe_url(self, event_id):
        return reverse("events:events-subscribe", kwargs={"pk": event_id})

    def unsubscribe_url(self, event_id):
        return reverse("events:events-unsubscribe", kwargs={"pk": event_id})

    def setUp(self):
        self.client = APIClient()
        self.system_admin_group = Group.objects.create(name="Administrador del Sistema")
        self.event_admin_group = Group.objects.create(name="Administrador de Eventos")

        self.system_admin = self.create_user(
            "system@unal.edu.co", "Admin Sistema", self.system_admin_group
        )
        self.event_admin_one = self.create_user(
            "events@unal.edu.co", "Admin 1 Eventos", self.event_admin_group
        )
        self.event_admin_two = self.create_user(
            "otro@unal.edu.co", "Admin 2 Eventos", self.event_admin_group
        )
        self.user = self.create_user("user@unal.edu.co", "Usuario")


class ListEventTestCase(BaseEventTestCase):

    def test_list_events(self):

        self.event_admin_one_draft = self.create_event(
            self.event_admin_one, published=False
        )

        self.event_admin_one_published = self.create_event(
            self.event_admin_one, published=True
        )

        self.event_admin_two_draft = self.create_event(
            self.event_admin_two, published=False
        )

        self.event_admin_two_published = self.create_event(
            self.event_admin_two, published=True
        )

        self.system_admin_draft = self.create_event(self.system_admin, published=False)

        self.system_admin_published = self.create_event(
            self.system_admin,
            published=True,
        )

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado solo puede ver eventos publicados",
                None,
                {
                    self.event_admin_one_published.id,
                    self.event_admin_two_published.id,
                    self.system_admin_published.id,
                },
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad solo puede ver eventos publicados",
                self.user,
                {
                    self.event_admin_one_published.id,
                    self.event_admin_two_published.id,
                    self.system_admin_published.id,
                },
            ),
            # Administrador de Eventos
            (
                "Administrador de Eventos puede ver su propio borrador y todos los eventos publicados",
                self.event_admin_one,
                {
                    self.event_admin_one_draft.id,
                    self.event_admin_one_published.id,
                    self.event_admin_two_published.id,
                    self.system_admin_published.id,
                },
            ),
            (
                "Administrador de Eventos puede ver su propio borrador y todos los eventos publicados",
                self.event_admin_two,
                {
                    self.event_admin_two_draft.id,
                    self.event_admin_one_published.id,
                    self.event_admin_two_published.id,
                    self.system_admin_published.id,
                },
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema puede ver su propio borrador y todos los eventos publicados",
                self.system_admin,
                {
                    self.system_admin_draft.id,
                    self.event_admin_one_published.id,
                    self.event_admin_two_published.id,
                    self.system_admin_published.id,
                },
            ),
        ]

        for case_name, user, expected_events in cases:

            with self.subTest(case=case_name):

                self.client.force_authenticate(user=user)

                response = self.client.get(self.event_url())

                self.assertEqual(
                    response.status_code,
                    status.HTTP_200_OK,
                )

                returned_events = {event["id"] for event in response.data}

                self.assertSetEqual(
                    returned_events,
                    expected_events,
                )


class CreateEventTestCase(BaseEventTestCase):

    def test_create_event(self):
        data = {
            "name": "Deporte chevere",
            "description": "Balon pie",
            "place": "Cancha micro",
            "latitude": "10.5",
            "longitude": "9.65",
            "category": "DEP",
            "status": "PRO",
            "datetime_start": timezone.now() + timedelta(days=1),
            "datetime_end": timezone.now() + timedelta(days=1, hours=2),
        }

        cases = [
            (
                "Usuario no registrado no puede crear eventos",
                None,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede crear eventos",
                self.user,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Administrador de Eventos puede crear eventos",
                self.event_admin_one,
                status.HTTP_201_CREATED,
                True,
            ),
            (
                "Administrador de Eventos puede crear eventos",
                self.event_admin_two,
                status.HTTP_201_CREATED,
                True,
            ),
            (
                "Administrador del Sistema puede crear eventos",
                self.system_admin,
                status.HTTP_201_CREATED,
                True,
            ),
        ]

        for case_name, user, expected_status, should_create in cases:

            with self.subTest(case=case_name):

                self.client.force_authenticate(user=user)

                response = self.client.post(
                    self.event_url(),
                    data,
                    format="json",
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                if should_create:
                    event = Event.objects.latest("id")

                    self.assertEqual(
                        event.organizer,
                        user,
                    )

                    self.assertEqual(
                        event.name,
                        data["name"],
                    )

    @patch("events.views.upload_image")
    def test_create_event_with_image(self, mock_upload):
        file = BytesIO()

        image = Image.new("RGB", (10, 10), color="red")
        image.save(file, "JPEG")
        file.seek(0)

        uploaded_image = SimpleUploadedFile(
            "event.jpg",
            file.read(),
            content_type="image/jpeg",
        )

        mock_upload.return_value = (
            "https://storage.googleapis.undesparche.test/image.jpg"
        )

        data = {
            "name": "Deporte chevere",
            "description": "Balon pie",
            "place": "Cancha micro",
            "latitude": "10.5",
            "longitude": "9.65",
            "category": "DEP",
            "status": "PRO",
            "datetime_start": timezone.now() + timedelta(days=1),
            "datetime_end": timezone.now() + timedelta(days=1, hours=2),
            "image_file": uploaded_image,
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.post(
            self.event_url(),
            data,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

        mock_upload.assert_called_once()

        event = Event.objects.latest("id")

        self.assertEqual(
            event.image,
            "https://storage.googleapis.undesparche.test/image.jpg",
        )


class UpdateEventTestcase(BaseEventTestCase):

    def test_update_event(self):

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado no puede editar borradores",
                None,
                self.event_admin_one,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede editar borradores",
                None,
                self.event_admin_two,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede editar borradores",
                None,
                self.system_admin,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede editar eventos publicados",
                None,
                self.event_admin_one,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede editar eventos publicados",
                None,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede editar eventos publicados",
                None,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad no puede editar borradores",
                self.user,
                self.event_admin_one,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede editar borradores",
                self.user,
                self.event_admin_two,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede editar borradores",
                self.user,
                self.system_admin,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede editar eventos publicados",
                self.user,
                self.event_admin_one,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede editar eventos publicados",
                self.user,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede editar eventos publicados",
                self.user,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador de Eventos
            (
                "Administrador de Eventos puede editar su propio borrador",
                self.event_admin_one,
                self.event_admin_one,
                False,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador de Eventos no puede editar borradores ajenos",
                self.event_admin_one,
                self.event_admin_two,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador de Eventos no puede editar borradores ajenos",
                self.event_admin_one,
                self.system_admin,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador de Eventos puede editar su propio evento publicado",
                self.event_admin_one,
                self.event_admin_one,
                True,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador de Eventos no puede editar eventos publicados ajenos",
                self.event_admin_one,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Administrador de Eventos no puede editar eventos publicados ajenos",
                self.event_admin_one,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema no puede editar borradores ajenos",
                self.system_admin,
                self.event_admin_one,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema no puede editar borradores ajenos",
                self.system_admin,
                self.event_admin_two,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema puede editar su propio borrador",
                self.system_admin,
                self.system_admin,
                False,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador del Sistema puede editar cualquier evento publicado",
                self.system_admin,
                self.event_admin_one,
                True,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador del Sistema puede editar cualquier evento publicado",
                self.system_admin,
                self.event_admin_two,
                True,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador del Sistema puede editar cualquier evento publicado",
                self.system_admin,
                self.system_admin,
                True,
                status.HTTP_200_OK,
                True,
            ),
        ]

        for (
            case_name,
            user,
            organizer,
            published,
            expected_status,
            should_update,
        ) in cases:

            with self.subTest(case=case_name):

                # Cada caso tiene su propio evento
                event = self.create_event(
                    user=organizer,
                    published=published,
                )

                self.client.force_authenticate(user=user)

                name = user.name if user else "guest"
                data = {"name": f"Nuevo nombre {name}"}

                original_name = event.name

                response = self.client.patch(
                    self.event_detail_url(event.id),
                    data,
                    format="json",
                )

                self.assertEqual(response.status_code, expected_status)

                event.refresh_from_db()

                if should_update:
                    self.assertEqual(event.name, data["name"])
                else:
                    self.assertEqual(event.name, original_name)

    @patch("events.views.upload_image")
    @patch("events.views.delete_image")
    def test_update_event_with_image(
        self,
        mock_delete,
        mock_upload,
    ):

        file = BytesIO()

        image = Image.new("RGB", (10, 10), color="red")
        image.save(file, "JPEG")
        file.seek(0)

        uploaded_image = SimpleUploadedFile(
            "event.jpg",
            file.read(),
            content_type="image/jpeg",
        )

        mock_upload.return_value = (
            "https://storage.googleapis.undesparche.test/new_image.jpg"
        )

        event = self.create_event(self.system_admin, False)

        event.image = "https://storage.googleapis.undesparche.test/old_image.jpg"
        event.save()

        data = {
            "image_file": uploaded_image,
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.patch(
            self.event_detail_url(event.id),
            data,
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        mock_delete.assert_called_once_with(
            "https://storage.googleapis.undesparche.test/old_image.jpg",
        )

        mock_upload.assert_called_once()

        event.refresh_from_db()

        self.assertEqual(
            event.image,
            "https://storage.googleapis.undesparche.test/new_image.jpg",
        )

    @patch("events.views.upload_image")
    @patch("events.views.delete_image")
    def test_update_event_without_new_image(
        self,
        mock_delete,
        mock_upload,
    ):

        event = self.create_event(self.system_admin, False)

        event.image = "https://storage.googleapis.undesparche.test/image.jpg"
        event.save()

        data = {
            "name": "Partido Micro actualizado",
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.patch(
            self.event_detail_url(event.id),
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data,
        )

        mock_delete.assert_not_called()

        mock_upload.assert_not_called()

        event.refresh_from_db()

        self.assertEqual(
            event.name,
            "Partido Micro actualizado",
        )

        self.assertEqual(
            event.image,
            "https://storage.googleapis.undesparche.test/image.jpg",
        )

    def test_update_cancelled_or_finished_event(self):

        cases = [
            (
                "Administrador de Eventos no puede editar un evento cancelado",
                self.event_admin_one,
                self.event_admin_one,
                "CAN",
            ),
            (
                "Administrador de Eventos no puede editar un evento finalizado",
                self.event_admin_one,
                self.event_admin_one,
                "FIN",
            ),
            (
                "Administrador del Sistema no puede editar un evento cancelado",
                self.system_admin,
                self.system_admin,
                "CAN",
            ),
            (
                "Administrador del Sistema no puede editar un evento finalizado",
                self.system_admin,
                self.system_admin,
                "FIN",
            ),
        ]

        for case_name, user, organizer, event_status in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    user=organizer,
                    published=True,
                )

                event.status = event_status
                event.save()

                self.client.force_authenticate(user=user)

                data = {"name": "Nuevo nombre"}

                original_name = event.name

                response = self.client.patch(
                    self.event_detail_url(event.id),
                    data,
                    format="json",
                )

                self.assertEqual(
                    response.status_code,
                    status.HTTP_403_FORBIDDEN,
                )

                event.refresh_from_db()

                self.assertEqual(
                    event.name,
                    original_name,
                )

    def test_publish_event(self):

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado no puede publicar eventos",
                None,
                self.event_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede publicar eventos",
                None,
                self.event_admin_two,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede publicar eventos",
                None,
                self.system_admin,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad no puede publicar eventos",
                self.user,
                self.event_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede publicar eventos",
                self.user,
                self.event_admin_two,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede publicar eventos",
                self.user,
                self.system_admin,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador de Eventos
            (
                "Administrador de Eventos puede publicar su propio borrador",
                self.event_admin_one,
                self.event_admin_one,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador de Eventos no puede publicar borradores ajenos",
                self.event_admin_one,
                self.event_admin_two,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador de Eventos no puede publicar borradores ajenos",
                self.event_admin_one,
                self.system_admin,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema no puede publicar borradores ajenos",
                self.system_admin,
                self.event_admin_one,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema no puede publicar borradores ajenos",
                self.system_admin,
                self.event_admin_two,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema puede publicar su propio borrador",
                self.system_admin,
                self.system_admin,
                status.HTTP_200_OK,
                True,
            ),
        ]

        for (
            case_name,
            user,
            organizer,
            expected_status,
            should_publish,
        ) in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    user=organizer,
                    published=False,
                )

                self.client.force_authenticate(user=user)

                response = self.client.post(
                    self.publish_url(event.id),
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                event.refresh_from_db()

                if should_publish:
                    self.assertTrue(event.published)
                else:
                    self.assertFalse(event.published)


class DeleteEventTestCase(BaseEventTestCase):

    def test_delete_event(self):

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado no puede eliminar borradores",
                None,
                self.event_admin_one,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede eliminar borradores",
                None,
                self.event_admin_two,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede eliminar borradores",
                None,
                self.system_admin,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede eliminar eventos publicados",
                None,
                self.event_admin_one,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede eliminar eventos publicados",
                None,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Usuario no registrado no puede eliminar eventos publicados",
                None,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad no puede eliminar borradores",
                self.user,
                self.event_admin_one,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede eliminar borradores",
                self.user,
                self.event_admin_two,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede eliminar borradores",
                self.user,
                self.system_admin,
                False,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede eliminar eventos publicados",
                self.user,
                self.event_admin_one,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede eliminar eventos publicados",
                self.user,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede eliminar eventos publicados",
                self.user,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador de Eventos
            (
                "Administrador de Eventos puede eliminar su propio borrador",
                self.event_admin_one,
                self.event_admin_one,
                False,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador de Eventos no puede eliminar borradores ajenos",
                self.event_admin_one,
                self.event_admin_two,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador de Eventos no puede eliminar borradores ajenos",
                self.event_admin_one,
                self.system_admin,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador de Eventos no puede eliminar eventos publicados",
                self.event_admin_one,
                self.event_admin_one,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Administrador de Eventos no puede eliminar eventos publicados",
                self.event_admin_one,
                self.event_admin_two,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Administrador de Eventos no puede eliminar eventos publicados",
                self.event_admin_one,
                self.system_admin,
                True,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema no puede eliminar borradores ajenos",
                self.system_admin,
                self.event_admin_one,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema no puede eliminar borradores ajenos",
                self.system_admin,
                self.event_admin_two,
                False,
                status.HTTP_404_NOT_FOUND,
                False,
            ),
            (
                "Administrador del Sistema puede eliminar su propio borrador",
                self.system_admin,
                self.system_admin,
                False,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador del Sistema puede eliminar cualquier evento publicado",
                self.system_admin,
                self.event_admin_one,
                True,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador del Sistema puede eliminar cualquier evento publicado",
                self.system_admin,
                self.event_admin_two,
                True,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador del Sistema puede eliminar cualquier evento publicado",
                self.system_admin,
                self.system_admin,
                True,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
        ]

        for (
            case_name,
            user,
            organizer,
            published,
            expected_status,
            should_delete,
        ) in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    user=organizer,
                    published=published,
                )

                self.client.force_authenticate(user=user)

                response = self.client.delete(
                    self.event_detail_url(event.id),
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                exists = Event.objects.filter(id=event.id).exists()

                if should_delete:
                    self.assertFalse(exists)
                else:
                    self.assertTrue(exists)

    @patch("events.views.delete_image")
    def test_delete_Event_with_image(self, mock_delete):

        event = self.create_event(self.system_admin, False)

        event.image = "https://storage.googleapis.undesparche.test/image.jpg"
        event.save()

        self.client.force_authenticate(self.system_admin, False)

        response = self.client.delete(
            self.event_detail_url(event.id),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        mock_delete.assert_called_once_with(
            "https://storage.googleapis.undesparche.test/image.jpg",
        )

        self.assertFalse(
            Event.objects.filter(
                id=event.id,
            ).exists()
        )


class SuscribeEventTestcase(BaseEventTestCase):

    def test_subscribe_event(self):

        cases = [
            (
                "Usuario no registrado puede suscribirse con correo",
                None,
                status.HTTP_201_CREATED,
            ),
            (
                "Miembro de la comunidad puede suscribirse",
                self.user,
                status.HTTP_201_CREATED,
            ),
            (
                "Administrador de Eventos puede suscribirse",
                self.event_admin_one,
                status.HTTP_201_CREATED,
            ),
            (
                "Administrador del Sistema puede suscribirse",
                self.system_admin,
                status.HTTP_201_CREATED,
            ),
        ]

        for case_name, user, expected_status in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    self.event_admin_one,
                    published=True,
                )

                self.client.force_authenticate(user=user)

                if user:
                    response = self.client.post(
                        self.subscribe_url(event.id),
                    )

                    exists = Subscription.objects.filter(
                        event=event,
                        user=user,
                    ).exists()

                else:
                    email = "guest@unal.edu.co"

                    response = self.client.post(
                        self.subscribe_url(event.id),
                        {"email": email},
                        format="json",
                    )

                    exists = Subscription.objects.filter(
                        event=event,
                        notification_email=email,
                    ).exists()

                self.assertEqual(response.status_code, expected_status)
                self.assertTrue(exists)

    def test_subscribe_cancelled_event(self):

        cases = [
            (
                "Usuario no registrado no puede suscribirse a un evento cancelado",
                None,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Miembro de la comunidad no puede suscribirse a un evento cancelado",
                self.user,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador de Eventos no puede suscribirse a un evento cancelado",
                self.event_admin_one,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador de Eventos no puede suscribirse a un evento cancelado",
                self.event_admin_two,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador del Sistema no puede suscribirse a un evento cancelado",
                self.system_admin,
                status.HTTP_400_BAD_REQUEST,
            ),
        ]

        for case_name, user, expected_status in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    self.event_admin_one,
                    published=True,
                )

                event.status = "CAN"
                event.save()

                self.client.force_authenticate(user=user)

                if user:
                    response = self.client.post(
                        self.subscribe_url(event.id),
                    )
                else:
                    email = "guest@unal.edu.co"

                    response = self.client.post(
                        self.subscribe_url(event.id),
                        {"email": email},
                        format="json",
                    )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                self.assertEqual(
                    Subscription.objects.filter(event=event).count(),
                    0,
                )

    def test_subscribe_finished_event(self):

        cases = [
            (
                "Usuario no registrado no puede suscribirse a un evento finalizado",
                None,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Miembro de la comunidad no puede suscribirse a un evento finalizado",
                self.user,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador de Eventos no puede suscribirse a un evento finalizado",
                self.event_admin_one,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador de Eventos no puede suscribirse a un evento finalizado",
                self.event_admin_two,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Administrador del Sistema no puede suscribirse a un evento finalizado",
                self.system_admin,
                status.HTTP_400_BAD_REQUEST,
            ),
        ]

        for case_name, user, expected_status in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    self.event_admin_one,
                    published=True,
                )

                event.status = "FIN"
                event.save()

                self.client.force_authenticate(user=user)

                if user:
                    response = self.client.post(
                        self.subscribe_url(event.id),
                    )
                else:
                    email = "guest@unal.edu.co"

                    response = self.client.post(
                        self.subscribe_url(event.id),
                        {"email": email},
                        format="json",
                    )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                self.assertEqual(
                    Subscription.objects.filter(event=event).count(),
                    0,
                )

    def test_unsubscribe_event(self):

        cases = [
            (
                "Usuario no registrado puede cancelar su suscripción",
                None,
            ),
            (
                "Miembro de la comunidad puede cancelar su suscripción",
                self.user,
            ),
            (
                "Administrador de Eventos puede cancelar su suscripción",
                self.event_admin_one,
            ),
            (
                "Administrador del Sistema puede cancelar su suscripción",
                self.system_admin,
            ),
        ]

        for case_name, user in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    self.event_admin_one,
                    published=True,
                )

                if user:
                    Subscription.objects.create(
                        event=event,
                        user=user,
                    )

                    self.client.force_authenticate(user=user)

                    response = self.client.post(
                        self.unsubscribe_url(event.id),
                    )

                    exists = Subscription.objects.filter(
                        event=event,
                        user=user,
                    ).exists()

                else:
                    email = "guest@unal.edu.co"

                    Subscription.objects.create(
                        event=event,
                        notification_email=email,
                    )

                    response = self.client.post(
                        self.unsubscribe_url(event.id),
                        {"email": email},
                        format="json",
                    )

                    exists = Subscription.objects.filter(
                        event=event,
                        notification_email=email,
                    ).exists()

                self.assertEqual(
                    response.status_code,
                    status.HTTP_200_OK,
                )

                self.assertFalse(exists)

    def test_unsubscribe_other_user_subscription(self):

        cases = [
            (
                "Miembro de la comunidad no puede cancelar la suscripción de otro usuario",
                self.user,
                self.event_admin_one,
            ),
            (
                "Administrador de Eventos no puede cancelar la suscripción de otro usuario",
                self.event_admin_one,
                self.user,
            ),
            (
                "Administrador del Sistema no puede cancelar la suscripción de otro usuario",
                self.system_admin,
                self.user,
            ),
        ]

        for case_name, requester, subscribed_user in cases:

            with self.subTest(case=case_name):

                event = self.create_event(
                    self.event_admin_one,
                    published=True,
                )

                Subscription.objects.create(
                    event=event,
                    user=subscribed_user,
                )

                self.client.force_authenticate(user=requester)

                response = self.client.post(
                    self.unsubscribe_url(event.id),
                )

                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST,
                )

                self.assertTrue(
                    Subscription.objects.filter(
                        event=event,
                        user=subscribed_user,
                    ).exists()
                )
