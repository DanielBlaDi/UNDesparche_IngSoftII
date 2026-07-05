import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h2">Iniciar Sesión</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
        Accede con tu cuenta institucional @unal.edu.co para consultar tu perfil y habilitar rutas según tu rol.
      </Typography>
      <LoginForm />
    </Box>
  )
}

export default LoginPage
