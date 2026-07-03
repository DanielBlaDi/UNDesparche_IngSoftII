from typing import Any

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = "Crea los grupos base del sistema"

    def handle(self, *args: Any, **options: Any) -> str | None:
        roles = [
            "Administrador de Eventos",
            "Administrador de Implementos",
            "Administrador del Sistema",
        ]

        for role_name in roles:
            group, created = Group.objects.get_or_create(name=role_name)
            status = "created" if created else "it already exists"
            self.stdout.write(f"Group {role_name}: {status}")

        self.stdout.write("Groups created successfully.")
