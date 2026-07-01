import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function EventsAdminPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Administración de Eventos</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Panel de gestión de eventos.
      </Typography>
    </Box>
  )
}

export default EventsAdminPage
