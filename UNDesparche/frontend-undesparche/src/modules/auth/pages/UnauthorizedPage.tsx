import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function UnauthorizedPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (auth?.logout) {
      await auth.logout()
      navigate('/login')
    }
  }

  return (
    <Box
      sx={{
        py: 12,
        px: { xs: 2, md: 5 },
        maxWidth: 600,
        mx: 'auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Icon
        baseClassName="material-symbols-outlined"
        sx={{
          fontSize: 80,
          color: 'error.main',
          fontVariationSettings: "'FILL' 1",
          mb: 2,
        }}
      >
        gpp_bad
      </Icon>
      
      <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
        Acceso Denegado
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450 }}>
        No tienes los permisos necesarios para acceder a esta página. Asegúrate de haber iniciado sesión con el rol adecuado.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'center' }}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '0.75rem', px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
        >
          Volver al Inicio
        </Button>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          sx={{ borderRadius: '0.75rem', px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  )
}

export default UnauthorizedPage
