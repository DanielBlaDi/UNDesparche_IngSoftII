import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function LoginPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Iniciar Sesión</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Accede con tu cuenta institucional @unal.edu.co.
      </Typography>
    </Box>
  )
}

export default LoginPage
