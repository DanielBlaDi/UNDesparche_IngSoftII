import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Icon from '@mui/material/Icon'
import CircularProgress from '@mui/material/CircularProgress'
import { Link } from 'react-router'
import { getEvents } from '../../events/services/eventService'
import type { Event } from '../../events/types/event.types'
import placeholder from '../../../assets/placeholder-events.png'

const STATUS_LABELS: Record<string, string> = {
  PRO: 'Programado',
  ECU: 'En Curso',
  FIN: 'Finalizado',
  CAN: 'Cancelado',
}

const CATEGORY_LABELS: Record<string, string> = {
  ACA: 'Académico',
  CUL: 'Cultural',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatMiniDate(dateStr: string): string {
  const d = new Date(dateStr)
  const dow = d.toLocaleDateString('es', { weekday: 'short' })
  const day = d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  return `${dow}, ${day} - ${time}`
}

function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents(null)
      .then(all => {
        const now = new Date()
        const upcoming = all
          .filter(e => new Date(e.datetime_end) >= now)
          .slice(0, 3)
        setEvents(upcoming)
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const featured = events[0]
  const miniEvents = events.slice(1, 3)

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Eventos Destacados
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No te pierdas lo que está sucediendo esta semana en la UNAL.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/events"
          sx={{
            display: { xs: 'none', md: 'flex' },
            color: 'primary.main',
            fontWeight: 600,
            textTransform: 'none',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          Ver todos{' '}
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
            arrow_forward
          </Icon>
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}>event_busy</Icon>
          <Typography color="text.secondary">No hay eventos próximos</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' }, gap: 3 }}>
          {featured && (
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: 'grey.400',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  height: { xs: 200, md: 'auto' },
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {featured.image ? (
                  <Box component="img" src={featured.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Box component="img" src={placeholder} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </Box>
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip label={featured.category ? (CATEGORY_LABELS[featured.category] ?? featured.category) : 'General'} size="small" color="info" variant="filled" />
                    <Chip label={STATUS_LABELS[featured.status] ?? featured.status} size="small" color="success" variant="filled" />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{ mb: 1, '&:hover': { color: 'primary.main' }, cursor: 'default' }}
                  >
                    {featured.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {featured.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>calendar_today</Icon>
                      {formatDate(featured.datetime_start)}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>location_on</Icon>
                      {featured.place}
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    to={`/events/${featured.id}`}
                    variant="contained"
                    sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: '0.75rem' }}
                  >
                    <Icon baseClassName="material-symbols-outlined">arrow_forward</Icon>
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {miniEvents.map(ev => (
              <Box
                key={ev.id}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '0.75rem',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip
                    label={ev.category ? (CATEGORY_LABELS[ev.category] ?? ev.category) : 'General'}
                    size="small"
                    variant="filled"
                    sx={{ bgcolor: 'grey.100', color: 'text.primary' }}
                  />
                  <Chip label={STATUS_LABELS[ev.status] ?? ev.status} size="small" color="primary" variant="filled" />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 2, '&:hover': { color: 'primary.main' }, cursor: 'default' }}
                >
                  {ev.name}
                </Typography>
                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>schedule</Icon>
                    {formatMiniDate(ev.datetime_start)}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>location_on</Icon>
                    {ev.place}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center', display: { md: 'none' } }}>
        <Button component={Link} to="/events" variant="outlined" fullWidth sx={{ borderRadius: '0.75rem', py: 1 }}>
          Ver todos los eventos
        </Button>
      </Box>
    </Box>
  )
}

export default EventsPreview
