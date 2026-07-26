import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import Icon from '@mui/material/Icon'
import { useAdminUsers } from '../hooks/useAdminUsers'
import type { SystemUser, SystemUserStatus, SystemUserRole } from '../types/system.types'
import { ROLE_OPTIONS } from '../types/system.types'
import UserTable from '../components/UserTable'
import UserForm from '../components/UserForm'

const STATUS_OPTIONS: { value: SystemUserStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'ACT', label: 'Activo' },
  { value: 'SAN', label: 'Sancionado' },
]

const ROLE_FILTER_OPTIONS: { value: SystemUserRole | ''; label: string }[] = [
  { value: '', label: 'Todos los roles' },
  ...ROLE_OPTIONS.map(r => ({ value: r, label: r })),
]

export default function SystemUsersPage() {
  const { users, loading, saving, error, updateUser, deleteUser, clearError } = useAdminUsers()
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<SystemUserRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<SystemUserStatus | ''>('')

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      if (roleFilter && !u.roles.includes(roleFilter)) return false
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [users, search, roleFilter, statusFilter])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSearch = (v: string) => { setSearch(v); setPage(0) }
  const handleRole = (v: SystemUserRole | '') => { setRoleFilter(v); setPage(0) }
  const handleStatus = (v: SystemUserStatus | '') => { setStatusFilter(v); setPage(0) }

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user)
  }

  const handleSave = async (id: number, data: Partial<SystemUser>) => {
    await updateUser(id, data)
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirm === id) {
      await deleteUser(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>Gestión de Usuarios</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Gestiona roles, permisos y estado del personal y los estudiantes.
        </Typography>
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
          ¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.
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
              placeholder="Buscar por nombre o correo..."
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
            <Select value={roleFilter} onChange={e => handleRole(e.target.value as SystemUserRole | '')} displayEmpty sx={{ minWidth: 200 }}>
              {ROLE_FILTER_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            <Select value={statusFilter} onChange={e => handleStatus(e.target.value as SystemUserStatus | '')} displayEmpty sx={{ minWidth: 160 }}>
              {STATUS_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <UserTable users={paginatedUsers} onEdit={handleEdit} onDelete={handleDelete} />
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      <UserForm
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </Box>
  )
}
