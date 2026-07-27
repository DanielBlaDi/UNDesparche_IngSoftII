import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "undesparche.settings")

app = Celery("undesparche")


app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
