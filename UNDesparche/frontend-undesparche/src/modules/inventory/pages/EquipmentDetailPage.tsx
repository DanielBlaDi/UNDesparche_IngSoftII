import { useParams, useNavigate } from 'react-router'
import { Alert, Box, Button, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useAuth } from '../../auth/hooks/useAuth'
import { useImplement } from '../hooks/useEquipment'
import {
  FACULTY_LABELS,
  IMPLEMENT_CATEGORY_LABELS,
  IMPLEMENT_STATE_LABELS,
  type Implement,
} from '../types/inventory.types'

const STATE_CHIP_COLOR: Record<Implement['state'], 'success' | 'warning' | 'info' | 'error'> = {
  DIS: 'success',
  RES: 'warning',
  PRE: 'info',
  NDS: 'error',
}

export default function EquipmentDetailPage() {
  // Ruta confirmada en routes/index.tsx: "equipment/:id"
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const isSanctioned = profile?.status === 'SAN'

  const implementId = id ? Number(id) : null
  const { data: implement, loading, error } = useImplement(implementId)

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !implement) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error ?? 'No se encontró el implemento solicitado.'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Container>
    )
  }

  const isAvailable = implement.state === 'DIS'
  const categoryLabel = implement.category ? IMPLEMENT_CATEGORY_LABELS[implement.category] : null
  const facultyLabel = implement.faculty ? FACULTY_LABELS[implement.faculty] : null

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Volver al listado
      </Button>

      <Stack spacing={3}>
        <Box
          sx={{
            height: { xs: 240, md: 360 },
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'grey.200',
            backgroundImage: implement.image ? `url(${implement.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!implement.image && (
            <Typography variant="body2" color="text.disabled">
              Sin imagen
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip
            label={IMPLEMENT_STATE_LABELS[implement.state]}
            color={STATE_CHIP_COLOR[implement.state]}
            sx={{ fontWeight: 700, textTransform: 'uppercase' }}
          />
          {facultyLabel && (
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              {facultyLabel}
            </Typography>
          )}
        </Stack>

        <Typography variant="h1">{implement.name}</Typography>

        {categoryLabel && (
          <Typography variant="body2" color="text.secondary">
            Categoría: {categoryLabel}
          </Typography>
        )}

        <Typography variant="body1" color="text.secondary">
          {implement.description}
        </Typography>

        {isSanctioned && (
          <Alert severity="error" variant="outlined">
            Tienes penalizaciones activas. Los préstamos están deshabilitados hasta que
            regularices tu estado en la oficina de administración.
          </Alert>
        )}

        <Button
          variant={isAvailable ? 'contained' : 'outlined'}
          color="primary"
          size="large"
          disabled={!isAvailable || isSanctioned}
          onClick={() => navigate(`/equipment/${implement.id}/reserve`)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isAvailable ? 'Reservar' : IMPLEMENT_STATE_LABELS[implement.state]}
        </Button>
      </Stack>
    </Container>
  )
}