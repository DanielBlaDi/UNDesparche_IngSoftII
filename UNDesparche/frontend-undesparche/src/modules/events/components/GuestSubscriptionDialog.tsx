import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

interface GuestSubscriptionDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (email: string) => Promise<void>
  loading: boolean
  error: string | null
}

export default function GuestSubscriptionDialog({ open, onClose, onSubmit, loading, error }: GuestSubscriptionDialogProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await onSubmit(email)
  }

  const handleClose = () => {
    setEmail('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Suscribirse al evento</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ingresa tu correo electrónico para recibir notificaciones importantes sobre este evento, como cambios de horario o cancelaciones.
          </Typography>
          
          <TextField
            autoFocus
            fullWidth
            type="email"
            label="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !email}>
            {loading ? 'Suscribiendo...' : 'Suscribirme'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
