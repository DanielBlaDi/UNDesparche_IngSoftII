import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAuth } from '../hooks/useAuth'

function LoginForm() {
  const { error, isLoading, signInWithGoogle } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch {
      // El error ya queda expuesto por el contexto.
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 480,
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Acceso institucional
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inicia sesión con Google usando tu correo @unal.edu.co para cargar tu
            perfil y tus permisos.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          sx={{ textTransform: 'none' }}
        >
          {isLoading ? 'Ingresando...' : 'Continuar con Google'}
        </Button>
      </Stack>
    </Paper>
  )
}

export default LoginForm