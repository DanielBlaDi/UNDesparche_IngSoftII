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
from .models import Implement, Reserve, Borrowing


class BaseInventoryTestCase(TestCase):

    def create_user(
        self,
        email,
        name,
        faculty,
        group=None,
    ):
        user = User.objects.create(email=email, name=name, faculty=faculty)
        if group:
            user.groups.add(group)
        return user

    def create_implement(
        self,
        name,
        faculty="ING",
        state="DIS",
        category="BAL",
    ):
        implement = Implement.objects.create(
            name=name,
            description=f"{name} description",
            category=category,
            faculty=faculty,
            state=state,
        )
        return implement

    def create_reserve(
        self,
        user,
        implement,
        active=True,
        datetime_reserved=None,
        datetime_expiration=None,
    ):
        if datetime_reserved is None:
            datetime_reserved = timezone.now()
        if datetime_expiration is None:
            datetime_expiration = datetime_reserved + timedelta(minutes=10)

        return Reserve.objects.create(
            user=user,
            implement=implement,
            active=active,
            datetime_reserved=datetime_reserved,
            datetime_expiration=datetime_expiration,
        )

    def create_borrowing(
        self,
        user,
        implement,
        active=True,
    ):
        return Borrowing.objects.create(
            user=user,
            implement=implement,
            datetime_borrowed=timezone.now(),
            active=active,
        )

    def authenticate(self, user):
        self.client.force_authenticate(user)

    def implement_url(self):
        return reverse("inventory:implements-list")

    def implement_detail_url(self, implement_id):
        return reverse("inventory:implements-detail", kwargs={"pk": implement_id})

    def reserve_url(self):
        return reverse("inventory:reserves-list")

    def reserve_detail_url(self, reserve_id):
        return reverse("inventory:reserves-detail", kwargs={"pk": reserve_id})

    def confirm_reserve_url(self, reserve_id):
        return reverse("inventory:reserves-confirm", kwargs={"pk": reserve_id})

    def cancel_reserve_url(self, reserve_id):
        return reverse("inventory:reserves-cancel", kwargs={"pk": reserve_id})

    def borrowing_url(self):
        return reverse("inventory:borrowings-list")

    def borrowing_detail_url(self, borrowing_id):
        return reverse("inventory:borrowings-detail", kwargs={"pk": borrowing_id})

    def return_borrowing_url(self, borrowing_id):
        return reverse(
            "inventory:borrowings-return-implement", kwargs={"pk": borrowing_id}
        )

    def setUp(self):
        self.client = APIClient()

        self.system_admin_group = Group.objects.create(name="Administrador del Sistema")
        self.implement_admin_group = Group.objects.create(
            name="Administrador de Implementos"
        )
        self.system_admin = self.create_user(
            "system@unal.edu.co",
            "Admin Sistema",
            faculty="ING",
            group=self.system_admin_group,
        )

        self.implement_admin_one = self.create_user(
            "implement@unal.edu.co",
            "Admin 1 Implementos",
            faculty="CIA",
            group=self.implement_admin_group,
        )

        self.implement_admin_two = self.create_user(
            "otro_implement@unal.edu.co",
            "Admin 2 Implementos",
            faculty="MED",
            group=self.implement_admin_group,
        )
        self.user = self.create_user("user@unal.edu.co", "Usuario", None)


class ListImplementTestCase(BaseInventoryTestCase):

    def test_list_implements(self):

        implement_bal_fut = self.create_implement(name="Balon futbol")
        implement_bal_bask = self.create_implement(name="Balon basketball")
        implement_raq_ten = self.create_implement(name="Raqueta tenis")

        expected_implements = {
            implement_bal_fut.id,
            implement_bal_bask.id,
            implement_raq_ten.id,
        }

        cases = [
            (
                "Usuario no registrado no puede acceder al listado de implementos",
                None,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Miembro de la comunidad puede ver todos los implementos registrados",
                self.user,
                status.HTTP_200_OK,
            ),
            (
                "Administrador de Implementos puede ver todos los implementos registrados",
                self.implement_admin_one,
                status.HTTP_200_OK,
            ),
            (
                "Administrador del Sistema puede ver todos los implementos registrados",
                self.system_admin,
                status.HTTP_200_OK,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
        ) in cases:

            with self.subTest(case=case_name):

                self.client.force_authenticate(user=user)

                response = self.client.get(self.implement_url())

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                if expected_status == status.HTTP_200_OK:
                    returned_implements = {
                        implement["id"] for implement in response.data
                    }

                    self.assertSetEqual(
                        returned_implements,
                        expected_implements,
                    )


class CreateImplementTestCase(BaseInventoryTestCase):

    def test_create_implement_permissions(self):

        cases = [
            (
                "Usuario no registrado no puede crear implementos",
                None,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Miembro de la comunidad no puede crear implementos",
                self.user,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            (
                "Administrador de Implementos puede crear implementos",
                self.implement_admin_one,
                status.HTTP_201_CREATED,
                True,
            ),
            (
                "Administrador de Implementos puede crear implementos",
                self.implement_admin_two,
                status.HTTP_201_CREATED,
                True,
            ),
            (
                "Administrador del Sistema puede crear implementos",
                self.system_admin,
                status.HTTP_201_CREATED,
                True,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
            should_create,
        ) in cases:
            with self.subTest(case=case_name):

                name = user.name if user else "guest"
                data = {
                    "name": (f"Balon futbol {name}"),
                    "description": "Balon firmado por CR7",
                    "category": "BAL",
                    "state": "DIS",
                    "faculty": "ING",
                }

                self.client.force_authenticate(user=user)

                response = self.client.post(
                    self.implement_url(),
                    data,
                    format="json",
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

            if should_create:

                implement = Implement.objects.latest("id")

                self.assertEqual(
                    implement.name,
                    data["name"],
                )

                self.assertEqual(
                    implement.description,
                    data["description"],
                )

                self.assertEqual(
                    implement.category,
                    data["category"],
                )

                self.assertEqual(
                    implement.state,
                    data["state"],
                )

                if user == self.system_admin:
                    self.assertEqual(
                        implement.faculty,
                        data["faculty"],
                    )
                else:
                    self.assertEqual(
                        implement.faculty,
                        user.faculty,
                    )

    def test_system_admin_must_specify_faculty(self):

        data = {
            "name": "Balon futbol",
            "description": "Balon firmado por CR7",
            "category": "BAL",
            "state": "DIS",
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.post(
            self.implement_url(),
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "faculty",
            response.data,
        )

    @patch("inventory.views.upload_image")
    def test_create_implement_with_image(self, mock_upload):
        file = BytesIO()

        image = Image.new("RGB", (10, 10), color="red")
        image.save(file, "JPEG")
        file.seek(0)

        uploaded_image = SimpleUploadedFile(
            "implement.jpg",
            file.read(),
            content_type="image/jpeg",
        )

        mock_upload.return_value = (
            "https://storage.googleapis.undesparche.test/image.jpg"
        )

        data = {
            "name": "Balon futbol",
            "description": "Balon firmado por CR7",
            "category": "BAL",
            "state": "DIS",
            "faculty": "ING",
            "image_file": uploaded_image,
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.post(
            self.implement_url(),
            data,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

        mock_upload.assert_called_once()

        implement = Implement.objects.latest("id")

        self.assertEqual(
            implement.image,
            "https://storage.googleapis.undesparche.test/image.jpg",
        )


class UpdateImplementTestCase(BaseInventoryTestCase):

    def test_update_implement_permissions(self):

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado no puede actualizar implementos",
                None,
                self.implement_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad no puede actualizar implementos",
                self.user,
                self.implement_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador de Implementos (ING)
            (
                "Administrador de Implementos puede actualizar implementos de su facultad",
                self.implement_admin_one,
                self.implement_admin_one,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador de Implementos no puede actualizar implementos de otra facultad",
                self.implement_admin_one,
                self.implement_admin_two,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema puede actualizar implementos de cualquier facultad",
                self.system_admin,
                self.implement_admin_one,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador del Sistema puede actualizar implementos de cualquier facultad",
                self.system_admin,
                self.implement_admin_two,
                status.HTTP_200_OK,
                True,
            ),
            (
                "Administrador del Sistema puede actualizar implementos de su propia facultad",
                self.system_admin,
                self.system_admin,
                status.HTTP_200_OK,
                True,
            ),
        ]

        for (
            case_name,
            user,
            owner,
            expected_status,
            should_update,
        ) in cases:

            with self.subTest(case=case_name):

                implement = self.create_implement(
                    name="Balon futbol",
                    faculty=owner.faculty,
                )

                self.client.force_authenticate(user=user)

                name = user.name if user else "guest"

                data = {
                    "name": f"Balon actualizado {name}",
                    "description": "Descripcion actualizada",
                    "category": "RAQ",
                    "state": "DIS",
                    "faculty": "ART",
                }

                original_name = implement.name
                original_description = implement.description
                original_category = implement.category
                original_state = implement.state
                original_faculty = implement.faculty

                response = self.client.patch(
                    self.implement_detail_url(implement.id),
                    data,
                    format="json",
                )

                self.assertEqual(response.status_code, expected_status, response.data)

                implement.refresh_from_db()

                if should_update:

                    self.assertEqual(
                        implement.name,
                        data["name"],
                    )

                    self.assertEqual(
                        implement.description,
                        data["description"],
                    )

                    self.assertEqual(
                        implement.category,
                        data["category"],
                    )

                    self.assertEqual(
                        implement.state,
                        data["state"],
                    )

                    if user == self.system_admin:

                        self.assertEqual(
                            implement.faculty,
                            data["faculty"],
                        )

                    else:

                        self.assertEqual(
                            implement.faculty,
                            original_faculty,
                        )

                else:

                    self.assertEqual(
                        implement.name,
                        original_name,
                    )

                    self.assertEqual(
                        implement.description,
                        original_description,
                    )

                    self.assertEqual(
                        implement.category,
                        original_category,
                    )

                    self.assertEqual(
                        implement.state,
                        original_state,
                    )

                    self.assertEqual(
                        implement.faculty,
                        original_faculty,
                    )

    @patch("inventory.views.upload_image")
    @patch("inventory.views.delete_image")
    def test_update_implement_with_image(
        self,
        mock_delete,
        mock_upload,
    ):

        file = BytesIO()

        image = Image.new("RGB", (10, 10), color="red")
        image.save(file, "JPEG")
        file.seek(0)

        uploaded_image = SimpleUploadedFile(
            "implement.jpg",
            file.read(),
            content_type="image/jpeg",
        )

        mock_upload.return_value = (
            "https://storage.googleapis.undesparche.test/new_image.jpg"
        )

        implement = self.create_implement(
            name="Balon futbol",
        )

        implement.image = "https://storage.googleapis.undesparche.test/old_image.jpg"
        implement.save()

        data = {
            "image_file": uploaded_image,
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.patch(
            self.implement_detail_url(implement.id),
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

        implement.refresh_from_db()

        self.assertEqual(
            implement.image,
            "https://storage.googleapis.undesparche.test/new_image.jpg",
        )

    @patch("inventory.views.upload_image")
    @patch("inventory.views.delete_image")
    def test_update_implement_without_new_image(
        self,
        mock_delete,
        mock_upload,
    ):

        implement = self.create_implement(
            name="Balon futbol",
        )

        implement.image = "https://storage.googleapis.undesparche.test/image.jpg"
        implement.save()

        data = {
            "name": "Balon actualizado",
        }

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.patch(
            self.implement_detail_url(implement.id),
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

        implement.refresh_from_db()

        self.assertEqual(
            implement.name,
            "Balon actualizado",
        )

        self.assertEqual(
            implement.image,
            "https://storage.googleapis.undesparche.test/image.jpg",
        )


class DeleteImplementTestCase(BaseInventoryTestCase):
    def test_delete_implement_permissions(self):

        cases = [
            # Usuario no registrado
            (
                "Usuario no registrado no puede eliminar implementos",
                None,
                self.implement_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Miembro de la comunidad
            (
                "Miembro de la comunidad no puede eliminar implementos",
                self.user,
                self.implement_admin_one,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador de Implementos
            (
                "Administrador de Implementos puede eliminar implementos de su facultad",
                self.implement_admin_one,
                self.implement_admin_one,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador de Implementos no puede eliminar implementos de otra facultad",
                self.implement_admin_one,
                self.implement_admin_two,
                status.HTTP_403_FORBIDDEN,
                False,
            ),
            # Administrador del Sistema
            (
                "Administrador del Sistema puede eliminar implementos de cualquier facultad",
                self.system_admin,
                self.implement_admin_one,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador del Sistema puede eliminar implementos de cualquier facultad",
                self.system_admin,
                self.implement_admin_two,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
            (
                "Administrador del Sistema puede eliminar implementos de su propia facultad",
                self.system_admin,
                self.system_admin,
                status.HTTP_204_NO_CONTENT,
                True,
            ),
        ]

        for (
            case_name,
            user,
            owner,
            expected_status,
            should_delete,
        ) in cases:

            with self.subTest(case=case_name):

                implement = self.create_implement(
                    name="Balon futbol",
                    faculty=owner.faculty,
                )

                self.client.force_authenticate(user=user)

                response = self.client.delete(
                    self.implement_detail_url(implement.id),
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                if should_delete:

                    self.assertFalse(
                        Implement.objects.filter(
                            id=implement.id,
                        ).exists()
                    )

                else:

                    self.assertTrue(
                        Implement.objects.filter(
                            id=implement.id,
                        ).exists()
                    )

    @patch("inventory.views.delete_image")
    def test_delete_implement_with_image(self, mock_delete):

        implement = self.create_implement(
            name="Balon futbol",
        )

        implement.image = "https://storage.googleapis.undesparche.test/image.jpg"
        implement.save()

        self.client.force_authenticate(
            self.system_admin,
        )

        response = self.client.delete(
            self.implement_detail_url(implement.id),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        mock_delete.assert_called_once_with(
            "https://storage.googleapis.undesparche.test/image.jpg",
        )

        self.assertFalse(
            Implement.objects.filter(
                id=implement.id,
            ).exists()
        )


# -----------------------------------------------------------------------------------------------------------------------


class ListReserveTestCase(BaseInventoryTestCase):

    def test_list_reserves(self):

        implement_cia = self.create_implement(
            name="Implemento CIA",
            faculty="CIA",
        )
        implement_med = self.create_implement(
            name="Implemento MED",
            faculty="MED",
        )

        reserve_user = self.create_reserve(
            user=self.user,
            implement=implement_cia,
        )

        reserve_admin_cia = self.create_reserve(
            user=self.implement_admin_one,
            implement=implement_cia,
        )

        reserve_admin_med = self.create_reserve(
            user=self.implement_admin_two,
            implement=implement_med,
        )

        inactive_reserve = self.create_reserve(
            user=self.user,
            implement=implement_cia,
            active=False,
        )

        cases = [
            (
                "Usuario no registrado no puede acceder al listado de reservas",
                None,
                status.HTTP_403_FORBIDDEN,
                None,
                False,
            ),
            (
                "Miembro de la comunidad solo puede ver sus reservas",
                self.user,
                status.HTTP_200_OK,
                {reserve_user.id, inactive_reserve.id},
                False,
            ),
            (
                "Administrador de Implementos solo puede ver las reservas activas de su facultad",
                self.implement_admin_one,
                status.HTTP_200_OK,
                {reserve_user.id, reserve_admin_cia.id},
                True,
            ),
            (
                "Administrador del Sistema puede ver todas las reservas",
                self.system_admin,
                status.HTTP_200_OK,
                {
                    reserve_user.id,
                    reserve_admin_cia.id,
                    reserve_admin_med.id,
                    inactive_reserve.id,
                },
                True,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
            expected_reserves,
            admin_serializer,
        ) in cases:

            with self.subTest(case=case_name):

                self.client.force_authenticate(user=user)

                response = self.client.get(self.reserve_url())

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                if expected_status == status.HTTP_200_OK:

                    returned_reserves = {reserve["id"] for reserve in response.data}

                    self.assertSetEqual(
                        returned_reserves,
                        expected_reserves,
                    )

                    first_reserve = response.data[0]

                    if admin_serializer:
                        self.assertIn("user", first_reserve)
                        self.assertIn("user_email", first_reserve)
                        self.assertIn("user_name", first_reserve)
                        self.assertNotIn("implement_state", first_reserve)
                    else:
                        self.assertNotIn("user", first_reserve)
                        self.assertNotIn("user_email", first_reserve)
                        self.assertNotIn("user_name", first_reserve)
                        self.assertIn("implement_state", first_reserve)


class CreateReserveTestCase(BaseInventoryTestCase):

    def test_create_reserve(self):

        available_implement = self.create_implement(
            name="Implemento Disponible",
            state="DIS",
        )

        reserved_implement = self.create_implement(
            name="Implemento Reservado",
            state="RES",
        )

        borrowed_implement = self.create_implement(
            name="Implemento Prestado",
            state="PRE",
        )

        user_with_reserve = self.create_user(
            "reserve@unal.edu.co",
            "Usuario Reserva",
            None,
        )

        user_with_borrowing = self.create_user(
            "borrowing@unal.edu.co",
            "Usuario Prestamo",
            None,
        )

        cases = [
            (
                "Usuario no autenticado no puede crear reservas",
                None,
                available_implement,
                False,
                False,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Miembro de la comunidad puede crear una reserva",
                self.user,
                available_implement,
                False,
                False,
                status.HTTP_201_CREATED,
            ),
            (
                "Administrador de Implementos puede crear una reserva",
                self.implement_admin_one,
                available_implement,
                False,
                False,
                status.HTTP_201_CREATED,
            ),
            (
                "Administrador del Sistema puede crear una reserva",
                self.system_admin,
                available_implement,
                False,
                False,
                status.HTTP_201_CREATED,
            ),
            (
                "No se puede reservar un implemento no disponible",
                self.user,
                reserved_implement,
                False,
                False,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "No se puede reservar un implemento prestado",
                self.user,
                borrowed_implement,
                False,
                False,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Un usuario no puede tener dos reservas activas",
                user_with_reserve,
                available_implement,
                True,
                False,
                status.HTTP_400_BAD_REQUEST,
            ),
            (
                "Un usuario con un préstamo activo no puede reservar",
                user_with_borrowing,
                available_implement,
                False,
                True,
                status.HTTP_400_BAD_REQUEST,
            ),
        ]

        for (
            case_name,
            user,
            implement,
            has_active_reserve,
            has_active_borrowing,
            expected_status,
        ) in cases:

            with self.subTest(case=case_name):

                Reserve.objects.all().delete()
                Borrowing.objects.all().delete()

                implement.refresh_from_db()

                if expected_status == status.HTTP_201_CREATED:
                    implement.state = "DIS"
                    implement.save(update_fields=["state"])

                if has_active_reserve:
                    self.create_reserve(
                        user=user,
                        implement=self.create_implement(
                            name="Reserva previa",
                            state="RES",
                        ),
                    )

                if has_active_borrowing:
                    self.create_borrowing(
                        user=user,
                        implement=self.create_implement(
                            name="Préstamo previo",
                            state="PRE",
                        ),
                    )

                self.client.force_authenticate(user=user)

                response = self.client.post(
                    self.reserve_url(),
                    {"implement": implement.id},
                )

                self.assertEqual(
                    response.status_code,
                    expected_status,
                    response.data,
                )

                if expected_status == status.HTTP_201_CREATED:

                    reserve = Reserve.objects.get(id=response.data["id"])

                    self.assertEqual(
                        reserve.user,
                        user,
                    )

                    self.assertEqual(
                        reserve.implement,
                        implement,
                    )

                    self.assertTrue(
                        reserve.active,
                    )

                    implement.refresh_from_db()

                    self.assertEqual(
                        implement.state,
                        "RES",
                    )

                elif implement.state != "DIS":

                    self.assertEqual(
                        response.data["implement"][0],
                        "Este implemento no está disponible para reservar.",
                    )

                elif has_active_reserve:

                    self.assertEqual(
                        response.data["detail"][0],
                        "Ya tienes una reserva activa.",
                    )

                elif has_active_borrowing:

                    self.assertEqual(
                        response.data["detail"][0],
                        "Tienes un préstamo activo. No puedes reservar otro implemento.",
                    )


class ConfirmReserveTestCase(BaseInventoryTestCase):

    def test_confirm_reserve(self):

        cases = [
            (
                "Usuario no autenticado no puede confirmar reservas",
                None,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Miembro de la comunidad no puede confirmar reservas",
                self.user,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Administrador de Implementos puede confirmar una reserva",
                self.implement_admin_one,
                status.HTTP_200_OK,
            ),
            (
                "Administrador del Sistema puede confirmar una reserva",
                self.system_admin,
                status.HTTP_200_OK,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
        ) in cases:

            with self.subTest(case=case_name):

                Reserve.objects.all().delete()
                Borrowing.objects.all().delete()

                implement = self.create_implement(
                    name="Balon",
                    faculty="CIA",
                    state="RES",
                )

                reserve = self.create_reserve(
                    user=self.user,
                    implement=implement,
                    active=True,
                )

                self.client.force_authenticate(user=user)

                response = self.client.post(self.confirm_reserve_url(reserve.id))

                self.assertEqual(
                    response.status_code,
                    expected_status,
                    response.data,
                )

                reserve.refresh_from_db()
                implement.refresh_from_db()

                if expected_status == status.HTTP_200_OK:

                    self.assertFalse(
                        reserve.active,
                    )

                    borrowing = Borrowing.objects.get(
                        user=self.user,
                        implement=implement,
                    )

                    self.assertEqual(
                        borrowing.user,
                        self.user,
                    )

                    self.assertEqual(
                        borrowing.implement,
                        implement,
                    )

                    self.assertTrue(
                        borrowing.active,
                    )

                    self.assertEqual(
                        implement.state,
                        "PRE",
                    )

                    self.assertEqual(
                        response.data["id"],
                        borrowing.id,
                    )

                else:

                    self.assertTrue(
                        reserve.active,
                    )

                    self.assertEqual(
                        Borrowing.objects.count(),
                        0,
                    )

                    self.assertEqual(
                        implement.state,
                        "RES",
                    )

    def test_confirm_inactive_reserve(self):

        implement = self.create_implement(
            name="Balon",
            faculty="CIA",
            state="RES",
        )

        reserve = self.create_reserve(
            user=self.user,
            implement=implement,
            active=False,
        )
        # Para el implement admin esta prueba da HTTP_404_NOT_FOUND = 404,
        # dado que el solo ve reservas activas
        self.client.force_authenticate(self.system_admin)

        response = self.client.post(self.confirm_reserve_url(reserve.id))

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST, response.data
        )

        self.assertEqual(
            response.data["detail"],
            "Esta reserva ya no está activa.",
        )

        self.assertEqual(
            Borrowing.objects.count(),
            0,
        )

        implement.refresh_from_db()

        self.assertEqual(
            implement.state,
            "RES",
        )


class CancelReserveTestCase(BaseInventoryTestCase):

    def test_cancel_reserve(self):

        cases = [
            (
                "Usuario no autenticado no puede cancelar reservas",
                None,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Miembro de la comunidad no puede cancelar reservas",
                self.user,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Administrador de Implementos puede cancelar una reserva",
                self.implement_admin_one,
                status.HTTP_200_OK,
            ),
            (
                "Administrador del Sistema puede cancelar una reserva",
                self.system_admin,
                status.HTTP_200_OK,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
        ) in cases:

            with self.subTest(case=case_name):

                Reserve.objects.all().delete()

                implement = self.create_implement(
                    name="Balon",
                    faculty="CIA",
                    state="RES",
                )

                reserve = self.create_reserve(
                    user=self.user,
                    implement=implement,
                    active=True,
                )

                self.client.force_authenticate(user=user)

                response = self.client.post(self.cancel_reserve_url(reserve.id))

                self.assertEqual(
                    response.status_code,
                    expected_status,
                    response.data,
                )

                reserve.refresh_from_db()
                implement.refresh_from_db()

                if expected_status == status.HTTP_200_OK:

                    self.assertFalse(
                        reserve.active,
                    )

                    self.assertEqual(
                        implement.state,
                        "DIS",
                    )

                    self.assertEqual(
                        response.data["detail"],
                        "Reserva cancelada correctamente.",
                    )

                else:

                    self.assertTrue(
                        reserve.active,
                    )

                    self.assertEqual(
                        implement.state,
                        "RES",
                    )

    def test_cancel_inactive_reserve(self):

        implement = self.create_implement(
            name="Balon",
            faculty="CIA",
            state="RES",
        )

        reserve = self.create_reserve(
            user=self.user,
            implement=implement,
            active=False,
        )

        self.client.force_authenticate(self.system_admin)

        response = self.client.post(self.cancel_reserve_url(reserve.id))

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data,
        )

        self.assertEqual(
            str(response.data["detail"]),
            "Esta reserva ya no está activa.",
        )

        reserve.refresh_from_db()
        implement.refresh_from_db()

        self.assertFalse(
            reserve.active,
        )

        self.assertEqual(
            implement.state,
            "RES",
        )


# -----------------------------------------------------------------------------------------------------------------------


class BorrowingListTestCase(BaseInventoryTestCase):

    def test_list_borrowings(self):

        implement_cia = self.create_implement(
            name="Balon CIA", faculty="CIA", state="PRE"
        )
        implement_med = self.create_implement(
            name="Balon MED", faculty="MED", state="PRE"
        )
        implement_ing = self.create_implement(
            name="Balon ING", faculty="ING", state="PRE"
        )

        other_user_med = self.create_user(
            "otro_user_med@unal.edu.co", "Otro Usuario MED", faculty="MED"
        )
        other_user_ing = self.create_user(
            "otro_user_ing@unal.edu.co", "Otro Usuario ING", faculty="ING"
        )

        borrowing_user_cia = self.create_borrowing(
            user=self.user, implement=implement_cia
        )
        borrowing_other_user_med = self.create_borrowing(
            user=other_user_med, implement=implement_med
        )
        borrowing_other_user_ing = self.create_borrowing(
            user=other_user_ing, implement=implement_ing
        )

        cases = [
            (
                "Usuario no autenticado no puede ver los prestamos",
                None,
                status.HTTP_403_FORBIDDEN,
                None,
            ),
            (
                "Miembro de la comunidad solo ve sus propios prestamos",
                self.user,
                status.HTTP_200_OK,
                {borrowing_user_cia.id},
            ),
            (
                "Administrador de Implementos ve los prestamos de su facultad",
                self.implement_admin_one,
                status.HTTP_200_OK,
                {borrowing_user_cia.id},
            ),
            (
                "Administrador del Sistema ve todos los prestamos",
                self.system_admin,
                status.HTTP_200_OK,
                {
                    borrowing_user_cia.id,
                    borrowing_other_user_med.id,
                    borrowing_other_user_ing.id,
                },
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
            expected_ids,
        ) in cases:

            with self.subTest(case=case_name):

                self.client.force_authenticate(user=user)

                response = self.client.get(self.borrowing_url())

                self.assertEqual(
                    response.status_code,
                    expected_status,
                )

                if expected_status == status.HTTP_200_OK:
                    returned_ids = {borrowing["id"] for borrowing in response.data}

                    self.assertSetEqual(
                        returned_ids,
                        expected_ids,
                    )


class BorrowingReturnTestCase(BaseInventoryTestCase):

    def test_return_implement(self):

        cases = [
            (
                "Usuario no autenticado no puede registrar una devolución",
                None,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Miembro de la comunidad no puede registrar una devolución",
                self.user,
                status.HTTP_403_FORBIDDEN,
            ),
            (
                "Administrador de Implementos de otra facultad no encuentra el préstamo",
                self.implement_admin_two,
                status.HTTP_404_NOT_FOUND,
            ),
            (
                "Administrador de Implementos de la misma facultad puede registrar la devolución",
                self.implement_admin_one,
                status.HTTP_200_OK,
            ),
            (
                "Administrador del Sistema puede registrar la devolución",
                self.system_admin,
                status.HTTP_200_OK,
            ),
        ]

        for (
            case_name,
            user,
            expected_status,
        ) in cases:

            with self.subTest(case=case_name):

                Borrowing.objects.all().delete()  # <-- clave para evitar el UNIQUE constraint

                implement = self.create_implement(
                    name="Balón",
                    faculty="CIA",
                    state="PRE",
                )

                borrowing = self.create_borrowing(
                    user=self.user,
                    implement=implement,
                    active=True,
                )

                self.client.force_authenticate(user=user)

                response = self.client.post(self.return_borrowing_url(borrowing.id))

                self.assertEqual(
                    response.status_code,
                    expected_status,
                    response.data,
                )

                borrowing.refresh_from_db()
                implement.refresh_from_db()

                if expected_status == status.HTTP_200_OK:

                    self.assertFalse(borrowing.active)
                    self.assertIsNotNone(borrowing.datetime_return)
                    self.assertEqual(implement.state, "DIS")

                    self.assertEqual(
                        response.data["detail"],
                        "Devolución registrada correctamente.",
                    )

                else:

                    self.assertTrue(borrowing.active)
                    self.assertIsNone(borrowing.datetime_return)
                    self.assertEqual(implement.state, "PRE")

    def test_return_inactive_borrowing(self):

        implement = self.create_implement(
            name="Balón",
            faculty="CIA",
            state="PRE",
        )

        borrowing = self.create_borrowing(
            user=self.user,
            implement=implement,
            active=False,
        )

        self.client.force_authenticate(self.system_admin)

        response = self.client.post(self.return_borrowing_url(borrowing.id))

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data,
        )

        self.assertEqual(
            str(response.data["detail"]),
            "Este préstamo ya fue cerrado",
        )

        borrowing.refresh_from_db()
        implement.refresh_from_db()

        self.assertFalse(borrowing.active)
        self.assertEqual(implement.state, "PRE")
