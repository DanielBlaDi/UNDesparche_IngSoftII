import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import type { SystemUser } from '../types/system.types'
import { FACULTY_LABELS, STATUS_CONFIG } from '../types/system.types'

interface UserTableProps {
  users: SystemUser[]
  onEdit: (user: SystemUser) => void
  onDelete: (id: number) => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'text.disabled' }}>person_off</Icon>
        <Typography color="text.secondary" sx={{ mt: 2 }}>No hay usuarios registrados</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '0.75rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Facultad</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => {
            const status = STATUS_CONFIG[user.status]
            const role = user.roles[0] ?? 'Miembro de la Comunidad'
            return (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.faculty ? FACULTY_LABELS[user.faculty] ?? user.faculty : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={role} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={status.label} color={status.color} variant="filled" size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(user)} sx={{ color: 'primary.main' }}>
                    <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(user.id)} sx={{ color: 'error.main' }}>
                    <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>delete</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
