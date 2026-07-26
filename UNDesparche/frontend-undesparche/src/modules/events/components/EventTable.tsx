import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useAuth } from '../../auth/hooks/useAuth'
import type { Event } from '../types/event.types'
import placeholder from '../../../assets/placeholder-events.png'

const STATUS_CONFIG: Record<string, { label: string; color: 'primary' | 'success' | 'default' | 'error' }> = {
  PRO: { label: 'Programado', color: 'primary' },
  ECU: { label: 'En Curso', color: 'success' },
  FIN: { label: 'Finalizado', color: 'default' },
  CAN: { label: 'Cancelado', color: 'error' },
}

const CATEGORY_LABELS: Record<string, string> = {
  ACA: 'Académico',
  CUL: 'Cultural',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

interface EventTableProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: number) => void
  onPublish: (id: number) => void
  showOrganizer?: boolean
}

export default function EventTable({ events, onEdit, onDelete, onPublish, showOrganizer = false }: EventTableProps) {
  const { hasRole } = useAuth()
  const isSystemAdmin = hasRole('Administrador del Sistema')

  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'text.disabled' }}>event_busy</Icon>
        <Typography color="text.secondary" sx={{ mt: 2 }}>No hay eventos registrados</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '0.75rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Evento</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Publicado</TableCell>
            {showOrganizer && <TableCell>Organizador</TableCell>}
            <TableCell>Fecha / Hora</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => {
            const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.PRO
            const canPublish = !event.published && event.status !== 'CAN' && event.status !== 'FIN'
            return (
              <TableRow key={event.id} hover className="group">
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {event.image ? (
                        <Box component="img" src={event.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box component="img" src={placeholder} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{event.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Sin categoría'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={status.label} color={status.color} variant="filled" size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.published ? 'Publicado' : 'Borrador'}
                    color={event.published ? 'success' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                {showOrganizer && (
                  <TableCell>
                    <Typography variant="body1">{event.organizer.name}</Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="body1">
                    {new Date(event.datetime_start).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(event.datetime_start).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.datetime_end).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{event.place}</Typography>
                </TableCell>
                <TableCell align="right">
                  {canPublish && (
                    <Tooltip title="Publicar">
                      <IconButton size="small" onClick={() => onPublish(event.id)} sx={{ color: 'success.main' }}>
                        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>publish</Icon>
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton size="small" onClick={() => onEdit(event)} sx={{ color: 'primary.main' }}>
                    <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>edit</Icon>
                  </IconButton>
                  {(!event.published || isSystemAdmin) && (
                    <IconButton size="small" onClick={() => onDelete(event.id)} sx={{ color: 'error.main' }}>
                      <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>delete</Icon>
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
