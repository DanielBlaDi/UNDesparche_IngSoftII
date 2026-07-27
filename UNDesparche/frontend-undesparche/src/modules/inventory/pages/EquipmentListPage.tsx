import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Box, CircularProgress, Container, Icon, Stack, Typography } from '@mui/material'
import { useAuth } from '../../auth/hooks/useAuth'
import { useImplements } from '../hooks/useEquipment'
import { EquipmentCard } from '../components/EquipmentCard'
import { EquipmentFilters } from '../components/EquipmentFilters'
import type { Faculty, ImplementCategory } from '../types/inventory.types'

export function EquipmentListPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const isSanctioned = profile?.status === 'SAN'

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<Faculty | ''>('')
  const [categoryFilter, setCategoryFilter] = useState<ImplementCategory | ''>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const filterParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      faculty: facultyFilter || undefined,
      category: categoryFilter || undefined,
    }),
    [debouncedSearch, facultyFilter, categoryFilter],
  )

  const { data: items, loading, error } = useImplements(filterParams)

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        {isSanctioned && (
          <Alert severity="error" variant="outlined">
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 700 }}>
              Usuario sancionado
            </Typography>
            Préstamos deshabilitados. Tienes penalizaciones activas por retrasos en
            devoluciones previas. Acércate a la oficina de administración para resolver tu
            estado.
          </Alert>
        )}

        <Box>
          <Typography
            variant="caption"
            color="secondary"
            sx={{ textTransform: 'uppercase', display: 'block' }}
          >
            {profile?.roles?.[0] ?? 'Miembro de la Comunidad'}
          </Typography>
          <Typography variant="h1" sx={{ mt: 1 }}>
            Inventario de Implementos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
            Explora y reserva implementos recreativos y deportivos disponibles para la
            comunidad universitaria.
          </Typography>
        </Box>

        <EquipmentFilters
          search={search}
          category={categoryFilter}
          faculty={facultyFilter}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryFilter}
          onFacultyChange={setFacultyFilter}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && items && items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}>
              inventory_2
            </Icon>
            <Typography variant="h3" color="text.secondary">
              No se encontraron implementos
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Intenta ajustar los filtros de búsqueda.
            </Typography>
          </Box>
        )}

        {!loading && !error && items && items.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {items.map((implement) => (
              <EquipmentCard
                key={implement.id}
                implement={implement}
                onView={(id) => navigate(`/equipment/${id}`)}
                onReserve={(id) => navigate(`/equipment/${id}/reserve`)}
                reserveDisabled={isSanctioned}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Container>
  )
}

export default EquipmentListPage