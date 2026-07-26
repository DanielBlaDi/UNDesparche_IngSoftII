from django.template.loader import render_to_string


def build_subscription_confirmation(event):
    subject = f"Suscripción confirmada: {event.name}"
    html = render_to_string(
        "notifications/events/subscribed.html",
        {"event": event},
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
