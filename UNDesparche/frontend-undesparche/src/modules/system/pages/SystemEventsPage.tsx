import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import { useAdminEvents } from '../../events/hooks/useAdminEvents'
import type { Event, EventCategory, EventStatus } from '../../events/types/event.types'
import EventTable from '../../events/components/EventTable'
import EventForm from '../../events/components/EventForm'

const CATEGORY_OPTIONS: { value: EventCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'ACA', label: 'Académico' },
  { value: 'CUL', label: 'Cultural' },
  { value: 'DEP', label: 'Deportes' },
  { value: 'ASA', label: 'Asamblea' },
  { value: 'PAR', label: 'Parche' },
  { value: 'OTR', label: 'Otro' },
]

const STATUS_OPTIONS: { value: EventStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PRO', label: 'Programado' },
  { value: 'ECU', label: 'En Curso' },
  { value: 'FIN', label: 'Finalizado' },
  { value: 'CAN', label: 'Cancelado' },
]

export default function SystemEventsPage() {
  const { events, loading, saving, error, createEvent, updateEvent, deleteEvent, publishEvent, clearError } = useAdminEvents()
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | ''>('')

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase()
    return events.filter(e => {
      if (q && !e.name.toLowerCase().includes(q) && !e.place.toLowerCase().includes(q)) return false
      if (categoryFilter && e.category !== categoryFilter) return false
      if (statusFilter && e.status !== statusFilter) return false
      return true
    })
  }, [events, search, categoryFilter, statusFilter])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const paginatedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSearch = (v: string) => { setSearch(v); setPage(0) }
  const handleCategory = (v: EventCategory | '') => { setCategoryFilter(v); setPage(0) }
  const handleStatus = (v: EventStatus | '') => { setStatusFilter(v); setPage(0) }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormOpen(true)
  }

  const handleSave = async (data: FormData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data)
    } else {
      await createEvent(data)
    }
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirm === id) {
      await deleteEvent(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  const handlePublish = async (id: number) => {
    await publishEvent(id)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>Gestión de Eventos</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Administra, programa y supervisa todas las actividades del campus.
          </Typography>
        </Box>
      </Box>

      {saving && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            Guardando cambios...
          </Box>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>{error}</Alert>
      )}

      {deleteConfirm && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleDelete(deleteConfirm)}>Eliminar</Button>
            </Box>
          }
        >
          ¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <TextField
              placeholder="Buscar por nombre o lugar..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20, color: 'text.secondary' }}>search</Icon>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <Select value={categoryFilter} onChange={e => handleCategory(e.target.value as EventCategory | '')} displayEmpty sx={{ minWidth: 160 }}>
              {CATEGORY_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            <Select value={statusFilter} onChange={e => handleStatus(e.target.value as EventStatus | '')} displayEmpty sx={{ minWidth: 160 }}>
              {STATUS_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <EventTable events={paginatedEvents} onEdit={handleEdit} onDelete={handleDelete} onPublish={handlePublish} showOrganizer />
          <TablePagination
            component="div"
            count={filteredEvents.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      <EventForm
        key={editingEvent?.id ?? 'create'}
        open={formOpen}
        event={editingEvent}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </Box>
  )
}
