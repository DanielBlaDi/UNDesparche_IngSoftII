"""
Configuración para pruebas - USA SQLite
"""
from .settings import *
import sys

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

print(f"BD de pruebas cargada")
print(f"Base de Datos: {DATABASES['default']['ENGINE']}")