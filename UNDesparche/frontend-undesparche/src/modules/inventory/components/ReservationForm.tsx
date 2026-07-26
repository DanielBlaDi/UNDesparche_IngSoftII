import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'
import { useCreateReserve } from '../hooks/useEquipment'
import type { Implement, Reserve } from '../types/inventory.types'

interface ReservationFormProps {
  implement: Implement
  onSuccess: (reserve: Reserve) => void
}

export function ReservationForm({ implement, onSuccess }: ReservationFormProps) {
  const { mutate: reserve, loading, error } = useCreateReserve()
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleConfirm = async () => {
    if (!termsAccepted) return
    try {
      const result = await reserve({ implement: implement.id })
      onSuccess(result)
    } catch {
      // el error ya queda expuesto vía `error`
    }
  }

  return (
    <Card sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h3">Confirmar reserva</Typography>
        <Typography variant="body1">
          Estás a punto de reservar <strong>{implement.name}</strong>.
        </Typography>

        <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tienes <strong>10 minutos</strong> para recoger el implemento en el punto de
            préstamo de tu facultad. Si no lo recoges a tiempo, la reserva se cancela y el
            implemento vuelve a estar disponible. No olvides traer tu carnet.
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: 'grey.100',
            borderRadius: 1,
            p: 2,
            borderLeft: '4px solid',
            borderColor: 'warning.main',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Responsabilidad del Estudiante
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Al confirmar esta reserva, te haces plenamente responsable por el cuidado,
            integridad y devolución puntual del implemento. Cualquier daño, pérdida o
            retraso en la entrega resultará en sanciones académicas y disciplinarias según
            el reglamento vigente de la Universidad Nacional de Colombia.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
              />
            }
            label="He leído y acepto los términos de responsabilidad."
          />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={loading || !termsAccepted}
        >
          {loading ? 'Reservando...' : 'Confirmar reserva'}
        </Button>
      </CardContent>
    </Card>
  )
}