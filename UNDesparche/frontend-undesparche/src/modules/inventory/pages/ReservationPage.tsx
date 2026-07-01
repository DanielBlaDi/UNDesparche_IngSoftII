import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function ReservationPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Reserva de Implemento</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Formulario para reservar un implemento deportivo.
      </Typography>
    </Box>
  )
}

export default ReservationPage
