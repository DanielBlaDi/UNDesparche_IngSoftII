import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Icon from '@mui/material/Icon'
import type { EventCategory, EventStatus } from '../types/event.types'

const categories: { value: EventCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'ACA', label: 'Académico' },
  { value: 'CUL', label: 'Cultural' },
  { value: 'DEP', label: 'Deportes' },
  { value: 'ASA', label: 'Asamblea' },
  { value: 'PAR', label: 'Parche' },
  { value: 'OTR', label: 'Otro' },
]

const statuses: { value: EventStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PRO', label: 'Programado' },
  { value: 'ECU', label: 'En Curso' },
  { value: 'FIN', label: 'Finalizado' },
  { value: 'CAN', label: 'Cancelado' },
]

interface EventFiltersProps {
  search: string
  category: EventCategory | ''
  status: EventStatus | ''
  onSearchChange: (value: string) => void
  onCategoryChange: (value: EventCategory | '') => void
  onStatusChange: (value: EventStatus | '') => void
}

export default function EventFilters({ search, category, status, onSearchChange, onCategoryChange, onStatusChange }: EventFiltersProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
      <TextField
        placeholder="Buscar eventos..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20, color: 'text.secondary' }}>search</Icon>
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: { sm: 1 }, minWidth: 200 }}
      />
      <Select
        value={category}
        onChange={e => onCategoryChange(e.target.value as EventCategory | '')}
        displayEmpty
        sx={{ minWidth: 160 }}
      >
        {categories.map(c => (
          <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
        ))}
      </Select>
      <Select
        value={status}
        onChange={e => onStatusChange(e.target.value as EventStatus | '')}
        displayEmpty
        sx={{ minWidth: 160 }}
      >
        {statuses.map(s => (
          <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
        ))}
      </Select>
    </Box>
  )
}
