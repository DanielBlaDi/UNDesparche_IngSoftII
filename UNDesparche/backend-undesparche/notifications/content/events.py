from django.template.loader import render_to_string
from django.conf import settings

from events.tokens import make_unsubscribe_token


def build_subscription_confirmation(subscription):
    event = subscription.event
    subject = f"Suscripción confirmada: {event.name}"


    unsubscribe_url = None
    if not subscription.user:
        token = make_unsubscribe_token(subscription)
        unsubscribe_url = f"{settings.FRONTEND_BASE_URL}/events/unsubscribe?token={token}"

    html = render_to_string(
        "notifications/events/subscribed.html",
        {"event": event, "unsubscribe_url": unsubscribe_url},
    )
    return subject, html


def build_unsubscription_confirmation(event):
    subject = f"Suscripción cancelada: {event.name}"
    html = render_to_string(
        "notifications/events/unsubscribed.html",
        {"event": event},
    )
    return subject, html


def _cancelled(event):
    subject = f"Evento cancelado: {event.name}"
    html = render_to_string("notifications/events/cancelled.html", {"event": event})
    return subject, html


def _rescheduled(event):
    subject = f"Cambio de horario: {event.name}"
    html = render_to_string("notifications/events/rescheduled.html", {"event": event})
    return subject, html


EVENT_EMAIL_BUILDERS = {
    "cancelled": _cancelled,
    "rescheduled": _rescheduled,
}
