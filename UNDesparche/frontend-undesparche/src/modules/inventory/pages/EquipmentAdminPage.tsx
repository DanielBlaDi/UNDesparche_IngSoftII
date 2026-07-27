import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import { useAuth } from '../../auth/hooks/useAuth'
import { useAdminBorrowings, useAdminImplements, useAdminReserves } from '../hooks/useAdminEquipment'
import { EquipmentTable } from '../components/EquipmentTable'
import { EquipmentForm } from '../components/EquipmentForm'
import { EquipmentFilters } from '../components/EquipmentFilters'
import { FACULTY_LABELS, type Faculty, type Implement, type ImplementCategory, type ImplementPayload } from '../types/inventory.types'
import AdminLayout from '../../../shared/components/layout/AdminLayout'
import type { SidebarItem } from '../../../shared/components/layout/AdminSidebar'

// Ruta confirmada en routes/index.tsx: "admin/equipment"
const INVENTORY_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Gestión de implementos', icon: 'inventory_2', path: '/admin/equipment' },
]

type AdminTab = 'implementos' | 'reservas' | 'prestamos'

export default function EquipmentAdminPage() {
  const { profile, firebaseUser, logout, hasRole } = useAuth()
  const [tab, setTab] = useState<AdminTab>('implementos')
  const isSystemAdmin = hasRole('Administrador del Sistema')

  // --- Implementos ---
  const [facultyFilter, setFacultyFilter] = useState<Faculty | ''>('')
  const [categoryFilter, setCategoryFilter] = useState<ImplementCategory | ''>('')
  // Un Admin de Implementos siempre queda anclado a su propia facultad,
  // sin importar lo que haya en el estado local del filtro.
  const effectiveFacultyFilter: Faculty | '' = isSystemAdmin
    ? facultyFilter
    : (profile?.faculty as Faculty | undefined) ?? ''

    const {
      data: implementsList,
      loading: implementsLoading,
      error: implementsError,
      refetch: refetchImplements,
      create,
      update,
      remove,
    } = useAdminImplements({
      faculty: effectiveFacultyFilter || undefined,
      category: categoryFilter || undefined,
    })

  const [formOpen, setFormOpen] = useState(false)
  const [editingImplement, setEditingImplement] = useState<Implement | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const handleCreate = () => {
    setEditingImplement(null)
    setFormOpen(true)
  }

  const handleEdit = (implement: Implement) => {
    setEditingImplement(implement)
    setFormOpen(true)
  }

  const handleSave = async (payload: ImplementPayload) => {
    if (editingImplement) {
      await update.mutate(editingImplement.id, payload)
    } else {
      await create.mutate(payload)
    }
    await refetchImplements()
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirmId === id) {
      await remove.mutate(id)
      setDeleteConfirmId(null)
      await refetchImplements()
    } else {
      setDeleteConfirmId(id)
    }
  }

  // --- Reservas ---
  const {
    data: reservesList,
    loading: reservesLoading,
    error: reservesError,
    refetch: refetchReserves,
    confirm,
    cancel,
  } = useAdminReserves()

  const handleConfirmReserve = async (id: number) => {
    await confirm.mutate(id)
    await Promise.all([refetchReserves(), refetchImplements()])
  }

  const handleCancelReserve = async (id: number) => {
    await cancel.mutate(id)
    await Promise.all([refetchReserves(), refetchImplements()])
  }

  // --- Préstamos ---
  const {
    data: borrowingsList,
    loading: borrowingsLoading,
    error: borrowingsError,
    refetch: refetchBorrowings,
    returnImplement,
  } = useAdminBorrowings()

  const handleReturn = async (id: number) => {
    await returnImplement.mutate(id)
    await Promise.all([refetchBorrowings(), refetchImplements()])
  }

  const userRoleLabel = hasRole('Administrador del Sistema')
    ? 'Administrador del Sistema'
    : 'Administrador de Implementos'

  // ASUNCIÓN SIN VERIFICAR: 'profile.faculty' existe en BackendProfile (auth.types.ts, no visto)
  const facultyName = profile?.faculty ? FACULTY_LABELS[profile.faculty as Faculty] : null

  const content = (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ pb: 3, mb: 3, borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Gestión de Implementos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {facultyName
            ? `Administra el inventario, las reservas y los préstamos de la Facultad de ${facultyName}.`
            : 'Administra el inventario, las reservas y los préstamos de todas las facultades.'}
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        <Tab label="Implementos" value="implementos" />
        <Tab label="Reservas" value="reservas" />
        <Tab label="Préstamos" value="prestamos" />
      </Tabs>

      {tab === 'implementos' && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              mb: 3,
              gap: 2,
            }}
          >
            <EquipmentFilters
              faculty={effectiveFacultyFilter}
              category={categoryFilter}
              onFacultyChange={setFacultyFilter}
              onCategoryChange={setCategoryFilter}
              hideFacultyFilter={!isSystemAdmin}
            />
            <Button variant="contained" onClick={handleCreate} sx={{ flexShrink: 0 }}>
              Nuevo implemento
            </Button>
          </Box>

          {(create.error || update.error || remove.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {create.error ?? update.error ?? remove.error}
            </Alert>
          )}

          {deleteConfirmId !== null && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => setDeleteConfirmId(null)}>
                    Cancelar
                  </Button>
                  <Button size="small" variant="contained" color="error" onClick={() => handleDelete(deleteConfirmId)}>
                    Eliminar
                  </Button>
                </Box>
              }
            >
              ¿Eliminar este implemento? Esta acción no se puede deshacer.
            </Alert>
          )}

          {implementsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : implementsError ? (
            <Alert severity="error">{implementsError}</Alert>
          ) : (
            <EquipmentTable implements={implementsList ?? []} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Box>
      )}

      {tab === 'reservas' && (
        <Box>
          {(confirm.error || cancel.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {confirm.error ?? cancel.error}
            </Alert>
          )}
          {reservesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : reservesError ? (
            <Alert severity="error">{reservesError}</Alert>
          ) : !reservesList || reservesList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No hay reservas activas.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Implemento</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Reservado</TableCell>
                  <TableCell>Expira</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservesList.map(reserve => (
                  <TableRow key={reserve.id}>
                    <TableCell>{reserve.implement_name}</TableCell>
                    <TableCell>
                      {reserve.user_name} ({reserve.user_email})
                    </TableCell>
                    <TableCell>{new Date(reserve.datetime_reserved).toLocaleString('es-CO')}</TableCell>
                    <TableCell>
                      {reserve.datetime_expiration
                        ? new Date(reserve.datetime_expiration).toLocaleString('es-CO')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={reserve.active ? 'Activa' : 'Finalizada'}
                        color={reserve.active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {reserve.active ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button size="small" variant="contained" onClick={() => handleConfirmReserve(reserve.id)}>
                            Confirmar entrega
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleCancelReserve(reserve.id)}>
                            Cancelar
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}

      {tab === 'prestamos' && (
        <Box>
          {returnImplement.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {returnImplement.error}
            </Alert>
          )}
          {borrowingsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : borrowingsError ? (
            <Alert severity="error">{borrowingsError}</Alert>
          ) : !borrowingsList || borrowingsList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No hay préstamos registrados.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Implemento</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Prestado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {borrowingsList.map(borrowing => (
                  <TableRow key={borrowing.id}>
                    <TableCell>{borrowing.implement_name}</TableCell>
                    <TableCell>
                      {borrowing.user_name} ({borrowing.user_email})
                    </TableCell>
                    <TableCell>{new Date(borrowing.datetime_borrowed).toLocaleString('es-CO')}</TableCell>
                    <TableCell>{borrowing.active ? 'Activo' : 'Devuelto'}</TableCell>
                    <TableCell align="right">
                      {borrowing.active && (
                        <Button size="small" variant="contained" onClick={() => handleReturn(borrowing.id)}>
                          Registrar devolución
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}

      <EquipmentForm
        key={editingImplement?.id ?? 'create'}
        open={formOpen}
        implement={editingImplement}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </Box>
  )

  return (
    <AdminLayout
      sidebarItems={INVENTORY_SIDEBAR_ITEMS}
      userName={profile?.name ?? 'Admin'}
      userRole={userRoleLabel}
      photoURL={firebaseUser?.photoURL}
      onLogout={logout}
    >
      {content}
    </AdminLayout>
  )
}