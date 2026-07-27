import { Box, Chip, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import {
  FACULTY_LABELS,
  IMPLEMENT_CATEGORY_LABELS,
  type Faculty,
  type ImplementCategory,
} from '../types/inventory.types'

const FACULTY_ENTRIES = Object.entries(FACULTY_LABELS) as [Faculty, string][]
const CATEGORY_ENTRIES = Object.entries(IMPLEMENT_CATEGORY_LABELS) as [ImplementCategory, string][]

interface EquipmentFiltersProps {
  faculty: Faculty | ''
  category: ImplementCategory | ''
  onFacultyChange: (faculty: Faculty | '') => void
  onCategoryChange: (category: ImplementCategory | '') => void
  hideFacultyFilter?: boolean
}

export function EquipmentFilters({
  faculty,
  category,
  onFacultyChange,
  onCategoryChange,
  hideFacultyFilter = false,
}: EquipmentFiltersProps) {
  const handleCategoryChange = (event: SelectChangeEvent) => {
    onCategoryChange(event.target.value as ImplementCategory | '')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', xl: 'row' },
        justifyContent: hideFacultyFilter ? 'flex-end' : 'space-between',
        alignItems: { xs: 'stretch', xl: 'center' },
        gap: 3,
      }}
    >
      {!hideFacultyFilter && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            '::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Chip
            label="Todos"
            color="primary"
            variant={faculty === '' ? 'filled' : 'outlined'}
            onClick={() => onFacultyChange('')}
            sx={{ flexShrink: 0 }}
          />
          {FACULTY_ENTRIES.map(([code, label]) => (
            <Chip
              key={code}
              label={label}
              color="primary"
              variant={faculty === code ? 'filled' : 'outlined'}
              onClick={() => onFacultyChange(code)}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Box>
      )}

      <Select
        value={category}
        onChange={handleCategoryChange}
        displayEmpty
        size="small"
        sx={{ minWidth: 220, bgcolor: 'background.paper' }}
      >
        <MenuItem value="">Todas las categorías</MenuItem>
        {CATEGORY_ENTRIES.map(([code, label]) => (
          <MenuItem key={code} value={code}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}