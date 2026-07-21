import {
    Avatar,
    Box,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
  } from '@mui/material'
  import { FACULTY_LABELS, IMPLEMENT_CATEGORY_LABELS, IMPLEMENT_STATE_LABELS, type Implement } from '../types/inventory.types'
  
  interface EquipmentTableProps {
    implements: Implement[]
    onEdit: (implement: Implement) => void
    onDelete: (id: number) => void
  }
  
  const STATE_CHIP_COLOR: Record<Implement['state'], 'success' | 'warning' | 'info' | 'error'> = {
    DIS: 'success',
    RES: 'warning',
    PRE: 'info',
    NDS: 'error',
  }
  
  export function EquipmentTable({ implements: items, onEdit, onDelete }: EquipmentTableProps) {
    if (items.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No hay implementos que coincidan con los filtros.
        </Typography>
      )
    }
  
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 56 }} />
            <TableCell>Nombre</TableCell>
            <TableCell>Facultad</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(implement => (
            <TableRow key={implement.id}>
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={implement.image ?? undefined}
                  sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}
                >
                  {implement.name.slice(0, 1)}
                </Avatar>
              </TableCell>
              <TableCell>{implement.name}</TableCell>
              <TableCell>{implement.faculty ? FACULTY_LABELS[implement.faculty] : '—'}</TableCell>
              <TableCell>{implement.category ? IMPLEMENT_CATEGORY_LABELS[implement.category] : '—'}</TableCell>
              <TableCell>
                <Chip size="small" label={IMPLEMENT_STATE_LABELS[implement.state]} color={STATE_CHIP_COLOR[implement.state]} />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => onEdit(implement)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" onClick={() => onDelete(implement.id)}>
                    Eliminar
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }