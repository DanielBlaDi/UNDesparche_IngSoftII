import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useImplement } from '../hooks/useEquipment'
import { ReservationForm } from '../components/ReservationForm'
import type { Reserve } from '../types/inventory.types'

function getRemainingSeconds(expiration: string | null): number | null {
  if (!expiration) return null
  const diffMs = new Date(expiration).getTime() - Date.now()
  return Math.max(0, Math.floor(diffMs / 1000))
}

function formatMinutesSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function ReservationPage() {
  // Ruta real: "equipment/:id/reserve" — :id es el id del IMPLEMENTO, no de la reserva
  // (confirmado en routes/index.tsx).
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const implementId = id ? Number(id) : null

  const { data: implement, loading, error, refetch } = useImplement(implementId)
  const [reserve, setReserve] = useState<Reserve | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)

  useEffect(() => {
    if (!reserve?.datetime_expiration || !reserve.active) {
      setRemainingSeconds(null)
      return
    }

    setRemainingSeconds(getRemainingSeconds(reserve.datetime_expiration))

    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(reserve.datetime_expiration))
    }, 1000)

    return () => clearInterval(interval)
  }, [reserve?.datetime_expiration, reserve?.active])

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !implement) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">{error ?? 'No se encontró el implemento solicitado.'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/equipment')}>
          Volver al inventario
        </Button>
      </Container>
    )
  }

  // Ya se confirmó la reserva en esta sesión: mostrar el countdown en vivo.
  if (reserve) {
    const expired = remainingSeconds === 0

    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
            {reserve.implement_name}
          </Typography>

          {!reserve.active ? (
            <Alert severity="info" sx={{ width: '100%' }}>
              Esta reserva ya no está activa.
            </Alert>
          ) : expired ? (
            <Alert severity="warning" sx={{ width: '100%' }}>
              El tiempo de tu reserva se agotó. El sistema puede tardar un momento en
              liberar el implemento — si necesitas confirmarlo, contacta al administrador
              de implementos de tu facultad.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary">
                Tienes tiempo para recoger el implemento en el punto de préstamo de tu
                facultad. No olvides traer tu carnet.
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4rem' }, fontWeight: 700 }}>
                {remainingSeconds !== null ? formatMinutesSeconds(remainingSeconds) : '--:--'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                minutos restantes
              </Typography>
            </>
          )}

          <Button variant="contained" onClick={() => navigate('/equipment')}>
            Volver al inventario
          </Button>
        </Stack>
      </Container>
    )
  }

  // Aún no se ha confirmado nada: si el implemento ya no está disponible
  // (otro usuario lo reservó primero, o llegaste aquí por una URL vieja),
  // no se muestra el formulario de confirmación.
  if (implement.state !== 'DIS') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="warning">
          Este implemento ya no está disponible para reservar.
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(`/equipment/${implement.id}`)}>
          Ver detalle
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <ReservationForm
        implement={implement}
        onSuccess={(result) => {
          setReserve(result)
          void refetch()
        }}
      />
    </Container>
  )
}