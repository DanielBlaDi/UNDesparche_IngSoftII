import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Icon from '@mui/material/Icon'
import { useNavigate } from 'react-router'
import type { Event } from '../types/event.types'
import SubscriptionButton from './SubscriptionButton'
import placeholder from '../../../assets/placeholder-events.png'

const STATUS_CONFIG: Record<string, { label: string; color: 'primary' | 'success' | 'default' | 'error'; icon: string }> = {
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

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.PRO
  const finished = event.status === 'FIN' || event.status === 'CAN'

  return (
    <Box
      component="article"
      onClick={() => navigate(`/events/${event.id}`)}
      sx={{
        cursor: 'pointer',
        bgcolor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid',
        borderColor: 'grey.400',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: finished ? 0.8 : 1,
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 192, overflow: 'hidden', bgcolor: 'grey.200' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `url(${event.image ?? placeholder}) center/cover`,
            filter: finished ? 'grayscale(1)' : 'none',
            transition: 'transform 0.5s',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
        <Box sx={{ position: 'absolute', top: 2, left: 2, display: 'flex', gap: 1, zIndex: 1 }}>
          <Chip
            icon={<Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 14, mr: 0 }}>{status.icon}</Icon>}
            label={status.label}
            color={status.color}
            variant="filled"
            size="small"
            sx={{ backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.9)' }}
          />
          {event.category && (
            <Chip
              label={CATEGORY_LABELS[event.category] ?? event.category}
              variant="filled"
              size="small"
              sx={{ backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.9)' }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.name}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, color: 'text.secondary' }}>calendar_today</Icon>
            <Typography variant="body2" color="text.secondary">
              {formatDateRange(event.datetime_start, event.datetime_end)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, color: 'text.secondary' }}>location_on</Icon>
            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.place}
            </Typography>
          </Box>
        </Box>

        <SubscriptionButton eventId={event.id} eventStatus={event.status} isSubscribed={event.is_subscribed} published={event.published} organizerId={event.organizer.id} />
      </Box>
    </Box>
  )
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
  const dateStr = startDate.toDateString() === endDate.toDateString()
    ? startDate.toLocaleDateString('es', dateOpts)
    : `${startDate.toLocaleDateString('es', dateOpts)} - ${endDate.toLocaleDateString('es', dateOpts)}`
  return `${dateStr} • ${startDate.toLocaleTimeString('es', timeOpts)} - ${endDate.toLocaleTimeString('es', timeOpts)}`
}
