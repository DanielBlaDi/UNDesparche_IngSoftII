import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import CircularProgress from '@mui/material/CircularProgress'
import { unsubscribeByToken } from '../services/eventService'

type Status = 'loading' | 'success' | 'error'

interface Result {
  status: Status
  title: string
  message: string
}

const RESULTS = {
  loading: {
    status: 'loading' as const,
    title: 'Procesando tu desuscripción...',
    message: 'Un momento por favor.',
  },
  invalid: {
    status: 'error' as const,
    title: 'Enlace inválido',
    message:
      'El enlace de desuscripción no es válido o está incompleto. Asegúrate de abrir el enlace completo desde el correo que recibiste.',
  },
}

export default function EventUnsubscribePage() {
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<Result>(RESULTS.loading)
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    const token = searchParams.get('token')
    if (!token) {
      setResult(RESULTS.invalid)
      return
    }

    unsubscribeByToken(token)
      .then((data) => {
        setResult({
          status: 'success',
          title: data.already ? 'Ya no estabas suscrito' : 'Listo, te desuscribiste',
          message: data.event_name
            ? `Ya no recibirás notificaciones sobre "${data.event_name}". Si cambias de opinión, puedes volver a suscribirte desde la página del evento.`
            : data.detail,
        })
      })
      .catch((err) => {
        setResult({
          status: 'error',
          title: 'No pudimos procesar tu solicitud',
          message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
        })
      })
  }, [searchParams])

  const isSuccess = result.status === 'success'
  const isLoading = result.status === 'loading'

  return (
    <Box
      sx={{
        py: 12,
        px: { xs: 2, md: 5 },
        maxWidth: 600,
        mx: 'auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ mb: 2 }} />
      ) : (
        <Icon
          baseClassName="material-symbols-outlined"
          sx={{
            fontSize: 80,
            color: isSuccess ? 'success.main' : 'error.main',
            fontVariationSettings: "'FILL' 1",
            mb: 2,
          }}
        >
          {isSuccess ? 'unsubscribe' : 'error'}
        </Icon>
      )}

      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {result.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450 }}>
        {result.message}
      </Typography>

      {!isLoading && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/events"
            variant="contained"
            color="primary"
            sx={{ borderRadius: '0.75rem', px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Ver eventos
          </Button>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: '0.75rem', px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Ir al inicio
          </Button>
        </Box>
      )}
    </Box>
  )
}
