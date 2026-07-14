import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LockIcon from '@mui/icons-material/Lock'
import { useAuth } from '../hooks/useAuth'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

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
        p: { xs: 4, md: 6 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Stack spacing={4} sx={{ width: '100%', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '-0.02em',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            UNDesparche
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 280 }}>
            Accede con tu correo @unal.edu.co para gestionar préstamos y eventos.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          fullWidth
          sx={{
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            py: 1.5,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <GoogleIcon />
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }}>
            {isLoading ? 'Ingresando...' : 'Continuar con Google'}
          </Typography>
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
            Acceso exclusivo comunidad UNAL
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

export default LoginForm