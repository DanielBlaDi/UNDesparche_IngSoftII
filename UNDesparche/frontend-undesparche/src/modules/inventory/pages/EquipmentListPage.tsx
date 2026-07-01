import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function EquipmentListPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Catálogo de Equipos</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Explora los implementos deportivos y recreativos disponibles para reserva.
      </Typography>
    </Box>
  )
}

export default EquipmentListPage
