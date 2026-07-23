import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import Icon from '@mui/material/Icon'
import { useAuth } from '../../auth/hooks/useAuth'
import { useAdminEvents } from '../hooks/useAdminEvents'
import type { Event, EventCategory, EventStatus } from '../types/event.types'
import EventTable from '../components/EventTable'
import EventForm from '../components/EventForm'
import AdminLayout from '../../../shared/components/layout/AdminLayout'
import type { SidebarItem } from '../../../shared/components/layout/AdminSidebar'

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

const EVENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Gestión de eventos', icon: 'event', path: '/admin/events' },
]

export default function EventsAdminPage() {
  const { profile, firebaseUser, logout } = useAuth()
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
      if (e.organizer.id !== profile?.id) return false
      if (q && !e.name.toLowerCase().includes(q) && !e.place.toLowerCase().includes(q)) return false
      if (categoryFilter && e.category !== categoryFilter) return false
      if (statusFilter && e.status !== statusFilter) return false
      return true
    })
  }, [events, search, categoryFilter, statusFilter, profile?.id])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const paginatedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSearchChange = (v: string) => { setSearch(v); setPage(0) }
  const handleCategoryChange = (v: EventCategory | '') => { setCategoryFilter(v); setPage(0) }
  const handleStatusChange = (v: EventStatus | '') => { setStatusFilter(v); setPage(0) }

  const handleCreate = () => {
    setEditingEvent(null)
    setFormOpen(true)
  }

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

  const content = (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pb: 4,
          mb: 4,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>Gestión de Eventos</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600 }}>
            Administra, programa y supervisa tus actividades del campus.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleCreate} startIcon={<Icon baseClassName="material-symbols-outlined">add_circle</Icon>}>
          Crear Nuevo
        </Button>
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
              onChange={e => handleSearchChange(e.target.value)}
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
            <Select value={categoryFilter} onChange={e => handleCategoryChange(e.target.value as EventCategory | '')} displayEmpty sx={{ minWidth: 160 }}>
              {CATEGORY_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            <Select value={statusFilter} onChange={e => handleStatusChange(e.target.value as EventStatus | '')} displayEmpty sx={{ minWidth: 160 }}>
              {STATUS_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <EventTable events={paginatedEvents} onEdit={handleEdit} onDelete={handleDelete} onPublish={handlePublish} />
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

  return (
    <AdminLayout
      sidebarItems={EVENT_SIDEBAR_ITEMS}
      userName={profile?.name ?? 'Admin'}
      userRole="Administrador de Eventos"
      photoURL={firebaseUser?.photoURL}
      onLogout={logout}
    >
      {content}
    </AdminLayout>
  )
}
