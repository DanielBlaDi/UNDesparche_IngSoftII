import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function EquipmentAdminPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Administración de Implementos</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Panel de gestión de implementos deportivos.
      </Typography>
    </Box>
  )
}

export default EquipmentAdminPage
