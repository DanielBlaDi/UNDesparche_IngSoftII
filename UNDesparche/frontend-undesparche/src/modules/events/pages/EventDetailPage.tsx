import { useParams, Link } from 'react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Icon from '@mui/material/Icon'
import { useEventDetail } from '../hooks/useEventDetail'
import SubscriptionButton from '../components/SubscriptionButton'
import EventMap from '../components/EventMap'
import placeholder from '../../../assets/placeholder-events.png'

const STATUS_LABELS: Record<string, { label: string; color: 'primary' | 'success' | 'default' | 'error'; icon: string }> = {
  PRO: { label: 'Programado', color: 'primary', icon: 'event_available' },
  ECU: { label: 'En Curso', color: 'success', icon: 'play_circle' },
  FIN: { label: 'Finalizado', color: 'default', icon: 'check_circle' },
  CAN: { label: 'Cancelado', color: 'error', icon: 'cancel' },
}

const CATEGORY_LABELS: Record<string, string> = {
  ACA: 'Académico',
  CUL: 'Cultural',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { event, loading, error } = useEventDetail(Number(id))

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !event) {
    return (
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 5 }, py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error ?? 'Evento no encontrado'}</Alert>
        <Button component={Link} to="/events" variant="outlined">
          ← Volver a Eventos
        </Button>
      </Box>
    )
  }

  const statusConfig = STATUS_LABELS[event.status] ?? STATUS_LABELS.PRO
  const start = new Date(event.datetime_start)
  const end = new Date(event.datetime_end)
  const sameDay = start.toDateString() === end.toDateString()
  const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

  return (
    <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 4, md: 8 } }}>
      <Button component={Link} to="/events" variant="text" sx={{ mb: 2, color: 'text.secondary' }}>
        ← Volver a Eventos
      </Button>

      <Box
        sx={{
          width: '100%',
          height: { xs: 200, md: 384 },
          borderRadius: '0.75rem',
          overflow: 'hidden',
          position: 'relative',
          mb: 4,
          bgcolor: 'grey.200',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `url(${event.image ?? placeholder}) center/cover`,
          }}
        />
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
        }} />
        </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' }, gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 14 }}>{statusConfig.icon}</Icon>}
                label={statusConfig.label}
                color={statusConfig.color}
                variant="filled"
              />
              {event.category && (
                <Chip label={CATEGORY_LABELS[event.category] ?? event.category} variant="filled" />
              )}
              {!event.published && (
                <Chip label="Borrador" variant="outlined" color="default" />
              )}
            </Box>
            <Typography variant="h1" sx={{ mb: 1 }}>{event.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon baseClassName="material-symbols-outlined" sx={{ color: 'text.secondary' }}>domain</Icon>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Organizado por: {event.organizer.name}</Typography>
                <Typography variant="body1" color="text.secondary">Universidad Nacional de Colombia</Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 88 },
              bgcolor: 'background.paper',
              borderRadius: '0.75rem',
              p: 3,
              border: '1px solid',
              borderColor: 'grey.400',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flexShrink: 0, p: 1.5, bgcolor: 'grey.200', borderRadius: 1, alignSelf: 'flex-start' }}>
                <Icon baseClassName="material-symbols-outlined" sx={{ color: 'primary.main' }}>calendar_month</Icon>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Fecha y Hora</Typography>
                <Typography variant="body1" color="text.secondary">
                  {sameDay
                    ? start.toLocaleDateString('es', dateOpts)
                    : `${start.toLocaleDateString('es', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('es', dateOpts)}`
                  }
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {start.toLocaleTimeString('es', timeOpts)} - {end.toLocaleTimeString('es', timeOpts)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'grey.400', pt: 2, display: 'flex', gap: 2 }}>
              <Box sx={{ flexShrink: 0, p: 1.5, bgcolor: 'grey.200', borderRadius: 1, alignSelf: 'flex-start' }}>
                <Icon baseClassName="material-symbols-outlined" sx={{ color: 'primary.main' }}>location_on</Icon>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Ubicación</Typography>
                <Typography variant="body1" color="text.secondary">
                  {event.place}
                </Typography>
                <Typography variant="body1" color="text.secondary">Sede Bogotá, UNAL</Typography>
              </Box>
            </Box>

            <EventMap lat={event.latitude} lng={event.longitude} />

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Icon baseClassName="material-symbols-outlined">directions</Icon>}
              href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
              target="_blank"
              rel="noopener"
              sx={{ textTransform: 'none' }}
            >
              Cómo llegar
            </Button>

            <SubscriptionButton
              eventId={event.id}
              eventStatus={event.status}
              isSubscribed={event.is_subscribed}
              published={event.published}
              organizerId={event.organizer.id}
              size="large"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
