import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'

export default function SystemInventoryPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 64, color: 'text.disabled' }}>inventory_2</Icon>
      <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
        Gestión de Inventario
      </Typography>
      <Typography variant="body1" color="text.disabled" sx={{ mt: 1 }}>
        Esta sección estará disponible próximamente.
      </Typography>
    </Box>
  )
}
