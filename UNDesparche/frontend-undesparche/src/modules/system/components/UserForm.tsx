import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import type { SystemUser, SystemUserRole, SystemUserStatus } from '../types/system.types'
import { ROLE_OPTIONS, FACULTY_LABELS } from '../types/system.types'

interface UserFormProps {
  open: boolean
  user: SystemUser | null
  onClose: () => void
  onSave: (id: number, data: Partial<SystemUser>) => Promise<void>
}

export default function UserForm({ open, user, onClose, onSave }: UserFormProps) {
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState<SystemUserRole>('Miembro de la Comunidad')
  const [status, setStatus] = useState<SystemUserStatus>('ACT')
  const [faculty, setFaculty] = useState<string>('')
  const [isSystemAdminLocked, setIsSystemAdminLocked] = useState(false)

  useEffect(() => {
    if (open && user) {
      setIsSystemAdminLocked(user.roles.includes('Administrador del Sistema'))
      setRole(user.roles[0] ?? 'Miembro de la Comunidad')
      setStatus(user.status ?? 'ACT')
      setFaculty(user.faculty ?? '')
    }
  }, [open, user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { status }
      payload.roles = role === 'Miembro de la Comunidad' ? [] : [role]
      if (role === 'Administrador de Implementos') {
        payload.faculty = faculty
      }
      await onSave(user.id, payload as Partial<SystemUser>)
      onClose()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon baseClassName="material-symbols-outlined" sx={{ color: 'primary.main' }}>manage_accounts</Icon>
        Editar Usuario
      </DialogTitle>
      <DialogContent dividers>
        {isSystemAdminLocked ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No se puede modificar a un Administrador del Sistema.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              select
              label="Rol"
              value={role}
              onChange={e => setRole(e.target.value as SystemUserRole)}
              fullWidth
            >
              {ROLE_OPTIONS.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado"
              value={status}
              onChange={e => setStatus(e.target.value as SystemUserStatus)}
              fullWidth
            >
              <MenuItem value="ACT">Activo</MenuItem>
              <MenuItem value="SAN">Sancionado</MenuItem>
            </TextField>
            {role === 'Administrador de Implementos' && (
              <TextField
                select
                label="Facultad"
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                fullWidth
                required
              >
                {Object.entries(FACULTY_LABELS).map(([code, label]) => (
                  <MenuItem key={code} value={code}>{label}</MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">Cancelar</Button>
        {!isSystemAdminLocked && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || (role === 'Administrador de Implementos' && !faculty)}
            startIcon={<Icon baseClassName="material-symbols-outlined">save</Icon>}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
