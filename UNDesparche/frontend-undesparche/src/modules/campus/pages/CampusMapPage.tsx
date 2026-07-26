import { useState } from 'react'
import { useNavigate } from 'react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import type { Event, EventCategory } from '../../events/types/event.types'
import { useEvents } from '../../events/hooks/useEvents'
import CampusMap from '../components/CampusMap'

const CATEGORY_COLORS: Record<string, string> = {
  ACA: '#003865',
  CUL: '#FFC107',
  DEP: '#C62828',
  ASA: '#28A745',
  PAR: '#2E5BFF',
  OTR: '#436900',
}

const CATEGORY_LABELS: Record<string, string> = {
  ACA: 'Académico',
  CUL: 'Cultural',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

const STATUS_LABELS: Record<string, { label: string; color: 'primary' | 'success' | 'default' }> = {
  PRO: { label: 'Programado', color: 'primary' },
  ECU: { label: 'En Curso', color: 'success' },
  FIN: { label: 'Finalizado', color: 'default' },
  CAN: { label: 'Cancelado', color: 'default' },
}

const filterChips: { label: string; value: EventCategory | '' }[] = [
  { label: 'Todos', value: '' },
  { label: 'Académico', value: 'ACA' },
  { label: 'Cultural', value: 'CUL' },
  { label: 'Deportes', value: 'DEP' },
  { label: 'Parche', value: 'PAR' },
  { label: 'Otro', value: 'OTR' },
]

function Sidebar({ events, selectedEvent, onSelectEvent, onClose, search, onSearchChange, categoryFilter, onCategoryChange }: {
  events: Event[]
  selectedEvent: Event | null
  onSelectEvent: (event: Event | null) => void
  onClose?: () => void
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: EventCategory | ''
  onCategoryChange: (value: EventCategory | '') => void
}) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'grey.400', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>Actividades</Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ display: { md: 'none' } }}>
              <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>close</Icon>
            </IconButton>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
          Descubre actividades en el campus
        </Typography>
        <TextField
          placeholder="Buscar en el mapa..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, color: 'text.secondary' }}>search</Icon>
                </InputAdornment>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', fontSize: '0.875rem', height: 36 } }}
        />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
          {filterChips.map(chip => (
            <Chip
              key={chip.value}
              label={chip.label}
              size="small"
              onClick={() => onCategoryChange(chip.value)}
              color={categoryFilter === chip.value ? 'primary' : 'default'}
              variant={categoryFilter === chip.value ? 'filled' : 'outlined'}
              sx={{ height: 24, fontSize: 11 }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {events.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No hay eventos en esta categoría
          </Typography>
        )}
        {events.map(event => {
          const isSelected = selectedEvent?.id === event.id
          const statusConfig = STATUS_LABELS[event.status] ?? STATUS_LABELS.PRO
          return (
            <Box
              key={event.id}
              onClick={() => {
                onSelectEvent(event)
                if (onClose) onClose()
              }}
              onDoubleClick={() => navigate(`/events/${event.id}`)}
              sx={{
                bgcolor: isSelected ? 'grey.100' : 'background.paper',
                p: 2,
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'grey.400',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: CATEGORY_COLORS[event.category ?? ''] ?? '#003865',
                  }}
                >
                  {event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Sin categoría'}
                </Typography>
                <Chip
                  label={statusConfig.label}
                  size="small"
                  color={statusConfig.color}
                  variant="filled"
                  sx={{ height: 20, fontSize: 10 }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {event.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 13 }}>calendar_today</Icon>
                  {formatEventDate(event)}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 13 }}>location_on</Icon>
                  {event.place}
                </Typography>
              </Box>
              <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'grey.300', display: 'flex', justifyContent: 'flex-end' }}>
                <Typography
                  onClick={e => { e.stopPropagation(); navigate(`/events/${event.id}`) }}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Detalles →
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default function CampusMapPage() {
  const { events, search, setSearch, categoryFilter, setCategoryFilter } = useEvents()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: 320, flexShrink: 0, borderRight: '1px solid', borderColor: 'grey.400', bgcolor: 'background.paper' }}>
        <Sidebar
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </Box>

      <CampusMap events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} />

      <IconButton
        onClick={() => setSidebarOpen(true)}
        size="large"
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 100,
          display: { md: 'none' },
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: 3,
          width: 56,
          height: 56,
        }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 28 }}>list</Icon>
      </IconButton>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        slotProps={{ paper: { sx: { width: 300 } } }}
      >
        <Sidebar
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          onClose={() => setSidebarOpen(false)}
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </Drawer>
    </Box>
  )
}

function formatEventDate(event: Event): string {
  const d = new Date(event.datetime_start)
  const e = new Date(event.datetime_end)
  if (d.toDateString() === e.toDateString()) return d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
  return `${d.toLocaleDateString('es', { day: 'numeric', month: 'short' })} - ${e.toLocaleDateString('es', { day: 'numeric', month: 'short' })}`
}
