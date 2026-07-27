import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Icon from '@mui/material/Icon'
import {
  FACULTY_LABELS,
  IMPLEMENT_CATEGORY_LABELS,
  type Faculty,
  type ImplementCategory,
} from '../types/inventory.types'

const categoryOptions: { value: ImplementCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  ...(Object.entries(IMPLEMENT_CATEGORY_LABELS) as [Exclude<ImplementCategory, ''>, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
]

const facultyOptions: { value: Faculty | ''; label: string }[] = [
  { value: '', label: 'Todas las facultades' },
  ...(Object.entries(FACULTY_LABELS) as [Faculty, string][]).map(([value, label]) => ({
    value,
    label,
  })),
]

export interface EquipmentFiltersProps {
  search: string
  category: ImplementCategory | ''
  faculty?: Faculty | ''
  onSearchChange: (value: string) => void
  onCategoryChange: (value: ImplementCategory | '') => void
  onFacultyChange?: (value: Faculty | '') => void
  hideFacultyFilter?: boolean
}

export function EquipmentFilters({
  search,
  category,
  faculty = '',
  onSearchChange,
  onCategoryChange,
  onFacultyChange,
  hideFacultyFilter = false,
}: EquipmentFiltersProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%', flexWrap: 'wrap' }}>
      <TextField
        placeholder="Buscar implementos..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20, color: 'text.secondary' }}>
                  search
                </Icon>
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: { sm: 1 }, minWidth: 200 }}
      />

      <Select
        value={category}
        onChange={e => onCategoryChange(e.target.value as ImplementCategory | '')}
        displayEmpty
        sx={{ minWidth: 160 }}
      >
        {categoryOptions.map(c => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </Select>

      {!hideFacultyFilter && onFacultyChange && (
        <Select
          value={faculty}
          onChange={e => onFacultyChange(e.target.value as Faculty | '')}
          displayEmpty
          sx={{ minWidth: 180 }}
        >
          {facultyOptions.map(f => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  )
}

export default EquipmentFilters