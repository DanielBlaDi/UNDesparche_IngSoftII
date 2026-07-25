from django.core.mail import send_mail
from django.conf import settings

from .content.events import EVENT_EMAIL_BUILDERS


def _recipient_of(subscription):
    """
    Retorna el email de una subscription dada.
    """
    return (
        subscription.user.email
        if subscription.user
        else subscription.notification_email
    )


def notify_event_subscribers(event, change_type: str):
    builder = EVENT_EMAIL_BUILDERS.get(change_type)

    if not builder:
        return

    subject, html = builder(event)

    for subscription in event.subscriptions.select_related("user").all():
        send_mail(
            subject=subject,
            message="",
            html_message=html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[_recipient_of(subscription)],
            fail_silently=True,
        )
