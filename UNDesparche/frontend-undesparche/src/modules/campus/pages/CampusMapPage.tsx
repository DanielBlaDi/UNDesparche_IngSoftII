import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function CampusMapPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Mapa del Campus</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Explora el mapa interactivo de la Universidad Nacional.
      </Typography>
    </Box>
  )
}

export default CampusMapPage
