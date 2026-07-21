import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import {
  FACULTY_LABELS,
  IMPLEMENT_CATEGORY_LABELS,
  IMPLEMENT_STATE_LABELS,
  type Implement,
} from '../types/inventory.types'

interface EquipmentCardProps {
  implement: Implement
  /** Se llama al hacer clic en la tarjeta (fuera del botón), para ir al detalle. */
  onView?: (implementId: number) => void
  /** Se llama al hacer clic en "Reservar". Solo aplica si el implemento está DIS. */
  onReserve?: (implementId: number) => void
  /** deshabilita el botón de reservar sin importar el estado (ej. usuario sancionado) */
  reserveDisabled?: boolean
}

const STATE_CHIP_COLOR: Record<Implement['state'], 'success' | 'warning' | 'info' | 'error'> = {
  DIS: 'success',
  RES: 'warning',
  PRE: 'info',
  NDS: 'error',
}

export function EquipmentCard({
  implement,
  onView,
  onReserve,
  reserveDisabled = false,
}: EquipmentCardProps) {
  const isAvailable = implement.state === 'DIS'
  const categoryLabel = implement.category ? IMPLEMENT_CATEGORY_LABELS[implement.category] : null
  const facultyLabel = implement.faculty ? FACULTY_LABELS[implement.faculty] : null

  return (
    <Card
      onClick={() => onView?.(implement.id)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        cursor: onView ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          height: 180,
          position: 'relative',
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
          <Typography variant="caption" color="text.disabled">
            Sin imagen
          </Typography>
        )}
        <Chip
          size="small"
          label={IMPLEMENT_STATE_LABELS[implement.state]}
          color={STATE_CHIP_COLOR[implement.state]}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        />
      </Box>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
        <Box>
          {/* Punto de préstamo presencial simplificado: 1 punto por facultad */}
          {facultyLabel && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}
            >
              {facultyLabel}
            </Typography>
          )}
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {implement.name}
          </Typography>
        </Box>

        {categoryLabel && (
          <Stack
            direction="row"
            sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="body2" color="text.secondary">
              {categoryLabel}
            </Typography>
          </Stack>
        )}

        <Button
          fullWidth
          variant={isAvailable ? 'contained' : 'outlined'}
          color="primary"
          disabled={!isAvailable || reserveDisabled}
          onClick={(event) => {
            // Evita que el clic también dispare la navegación al detalle (onView)
            event.stopPropagation()
            onReserve?.(implement.id)
          }}
          sx={{ mt: categoryLabel ? 0 : 'auto' }}
        >
          {isAvailable ? 'Reservar' : IMPLEMENT_STATE_LABELS[implement.state]}
        </Button>
      </CardContent>
    </Card>
  )
}