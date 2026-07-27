from django.core.mail import send_mail
from django.conf import settings

from .content.events import EVENT_EMAIL_BUILDERS
from .content.events import (
    build_subscription_confirmation,
    build_unsubscription_confirmation,
)


def _recipient_of(subscription):
    """
    Retorna el email de una subscription dada.
    """
    return (
        subscription.user.email
        if subscription.user
        else subscription.notification_email
    )


def _send_to(subscription, subject: str, html: str) -> None:
    send_mail(
        subject=subject,
        message="",
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[_recipient_of(subscription)],
        # fail_silently=True,
    )


def notify_event_subscribers(event, change_type: str) -> None:
    """Broadcast: le llega a TODOS los suscritos al evento."""
    builder = EVENT_EMAIL_BUILDERS.get(change_type)
    if builder is None:
        return

    subject, html = builder(event)

    for subscription in event.subscriptions.select_related("user").all():
        try:
            _send_to(subscription, subject, html)
            print("OK")
        except Exception as e:
            print(e)


def notify_subscription_confirmed(subscription) -> None:
    """Individual: le llega solo a quien se acaba de suscribir."""
    subject, html = build_subscription_confirmation(subscription.event)
    try:
        _send_to(subscription, subject, html)
        print("OK")
    except Exception as e:
        print(e)
    


def notify_unsubscription_confirmed(subscription) -> None:
    """Individual: le llega solo a quien se acaba de desuscribir. Debe
    llamarse ANTES de subscription.delete(), ya que _send_to necesita
    leer el destinatario desde la instancia."""
    subject, html = build_unsubscription_confirmation(subscription.event)
    try:
        _send_to(subscription, subject, html)
        print("OK")
    except Exception as e:
        print(e)
