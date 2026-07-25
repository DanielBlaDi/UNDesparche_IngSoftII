from django.template.loader import render_to_string


def _cancelled(event):
    subject = f"Evento cancelado: {event.name}"
    html = render_to_string("notifications/events/cancelled.html", {"event": event})
    return subject, html


def _rescheduled(event):
    subject = f"Cambio de horario: {event.name}"
    html = render_to_string("notifications/events/rescheduled.html")
    return subject, html


EVENT_EMAIL_BUILDERS = {
    "cancelled": _cancelled,
    "rescheduled": _rescheduled,
}
