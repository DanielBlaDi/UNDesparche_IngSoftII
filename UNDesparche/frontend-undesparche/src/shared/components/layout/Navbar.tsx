import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../../modules/auth/hooks/useAuth'

function Navbar() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (auth?.logout) {
      await auth.logout()
      navigate('/login')
    }
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '4px solid',
        borderColor: 'primary.main',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
          px: { xs: 2, md: 5 },
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', textDecoration: 'none' }}
        >
          <Icon baseClassName="material-symbols-outlined" sx={{ fontVariationSettings: "'FILL' 1", fontSize: 32 }}>
            school
          </Icon>
          <Box sx={{ fontSize: '1.5rem', fontWeight: 700 }}>UNDesparche</Box>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button
            component={Link}
            to="/events"
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', '&:hover': { color: 'primary.main' } }}
          >
            Eventos
          </Button>
          <Button
            component={Link}
            to="/map"
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', '&:hover': { color: 'primary.main' } }}
          >
            Mapa del campus
          </Button>
          {auth?.isAuthenticated && (
            <Button
              component={Link}
              to="/equipment"
              sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Implementos
            </Button>
          )}
          {auth?.isAuthenticated && auth.hasRole('Administrador del Sistema') && (
            <Button
              component={Link}
              to="/admin/system"
              sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none', '&:hover': { opacity: 0.8 } }}
            >
              Admin Sistema
            </Button>
          )}
          {auth?.isAuthenticated && auth.hasRole('Administrador de Eventos') && (
            <Button
              component={Link}
              to="/admin/events"
              sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none', '&:hover': { opacity: 0.8 } }}
            >
              Admin Eventos
            </Button>
          )}
          {auth?.isAuthenticated && auth.hasRole('Administrador de Implementos') && (
            <Button
              component={Link}
              to="/admin/equipment"
              sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none', '&:hover': { opacity: 0.8 } }}
            >
              Admin Inventario
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {auth?.isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="error"
              sx={{ borderRadius: '0.75rem', px: 3, py: 1, textTransform: 'none' }}
            >
              Cerrar sesión
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ borderRadius: '0.75rem', px: 3, py: 1, textTransform: 'none' }}
            >
              Regístrate o inicia sesión
            </Button>
          )}
          <IconButton sx={{ display: { md: 'none' }, color: 'primary.main' }}>
            <Icon baseClassName="material-symbols-outlined">menu</Icon>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

