import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Icon from '@mui/material/Icon'
import { Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import EventFilters from '../components/EventFilters'
import EventCard from '../components/EventCard'

export default function EventsListPage() {
  const { events, loading, error, search, categoryFilter, statusFilter, setSearch, setCategoryFilter, setStatusFilter } = useEvents()
  const { hasRole } = useAuth()
  const isEventAdmin = hasRole('Administrador de Eventos')

  return (
    <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 6, md: 10 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 1 }}>Eventos</Typography>
          <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 600 }}>
            Descubre y suscríbete a actividades académicas, culturales y recreativas en el campus de la Universidad Nacional de Colombia.
          </Typography>
        </Box>
        {isEventAdmin && (
          <Button
            component={Link}
            to="/admin/events"
            variant="contained"
            startIcon={<Icon baseClassName="material-symbols-outlined">settings</Icon>}
            sx={{ textTransform: 'none', flexShrink: 0 }}
          >
            Gestionar eventos
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { md: 'flex-end' },
          gap: 3,
          pb: 4,
          mb: 4,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <EventFilters
          search={search}
          category={categoryFilter}
          status={statusFilter}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {!loading && !error && events.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}>event_busy</Icon>
          <Typography variant="h3" color="text.secondary">No se encontraron eventos</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Intenta ajustar los filtros de búsqueda.
          </Typography>
        </Box>
      )}

      {!loading && !error && events.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </Box>
      )}
    </Box>
  )
}
