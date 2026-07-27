from celery import shared_task
from django.db import transaction
from django.utils import timezone

from .models import Reserve


@shared_task
def release_expired_reserves():
    now = timezone.now()


    expired_ids = list(
        Reserve.objects.filter(
            active=True, datetime_expiration__lt=now
        ).values_list("id", flat=True)
    )

    released = 0
    for reserve_id in expired_ids:
        with transaction.atomic():
            reserve = (
                Reserve.objects.select_for_update()
                .select_related("implement")
                .get(pk=reserve_id)
            )

            if not reserve.active or reserve.datetime_expiration >= timezone.now():
                continue

            reserve.active = False
            reserve.save(update_fields=["active"])

            implement = reserve.implement
            if implement.state == "RES":
                implement.state = "DIS"
                implement.save(update_fields=["state"])

            released += 1

    return released
