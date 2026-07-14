import { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Icon from '@mui/material/Icon'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../../modules/auth/hooks/useAuth'

type NavLink = {
  label: string
  to: string
  icon: string
}

const publicLinks: NavLink[] = [
  { label: 'Eventos', to: '/events', icon: 'event' },
  { label: 'Mapa del campus', to: '/map', icon: 'map' },
]

const authLinks: NavLink[] = [
  { label: 'Implementos', to: '/equipment', icon: 'handyman' },
]

function Navbar() {
  const { isAuthenticated, firebaseUser, profile, logout } = useAuth()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(menuAnchor)

  useEffect(() => {
    if (profile) {
      console.log('Perfil del usuario:', profile)
    }
  }, [profile])

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')

  const navLinks = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks

  return (
    <>
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

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  color: isActive(link.to) ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive(link.to) ? 700 : 600,
                  textTransform: 'none',
                  borderBottom: isActive(link.to) ? '2px solid' : '2px solid transparent',
                  borderColor: isActive(link.to) ? 'primary.main' : 'transparent',
                  borderRadius: 0,
                  pb: 0.5,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 2 } }}>
            {isAuthenticated ? (
              <Button
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center',
                  gap: 1,
                  pl: 1,
                  pr: 1.5,
                  py: 0.5,
                  bgcolor: 'surface-container',
                  borderRadius: 'full',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'surface-container-high' },
                }}
              >
                <Avatar
                  src={firebaseUser?.photoURL ?? undefined}
                  alt={profile?.name ?? ''}
                  sx={{ width: 28, height: 28 }}
                />
                <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>expand_more</Icon>
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ borderRadius: '0.75rem', px: 3, py: 1, textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
              >
                Regístrate o inicia sesión
              </Button>
            )}
            <IconButton
              component={Link}
              to={isAuthenticated ? '/' : '/login'}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'primary.main' }}
            >
              {isAuthenticated ? (
                <Avatar
                  src={firebaseUser?.photoURL ?? undefined}
                  alt={profile?.name ?? ''}
                  sx={{ width: 28, height: 28 }}
                />
              ) : (
                <Icon baseClassName="material-symbols-outlined">person</Icon>
              )}
            </IconButton>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ display: { md: 'none' }, color: 'primary.main' }}>
              <Icon baseClassName="material-symbols-outlined">menu</Icon>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 200, mt: 1, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{profile?.name}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{profile?.email}</Box>
        </Box>
        <Divider />
        {profile?.roles.includes('Administrador de Eventos') && (
          <MenuItem component={Link} to="/admin/events" onClick={() => setMenuAnchor(null)} sx={{ gap: 1.5, py: 1.5 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>event</Icon>
            Panel Eventos
          </MenuItem>
        )}
        {profile?.roles.includes('Administrador de Implementos') && (
          <MenuItem component={Link} to="/admin/equipment" onClick={() => setMenuAnchor(null)} sx={{ gap: 1.5, py: 1.5 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>handyman</Icon>
            Panel Implementos
          </MenuItem>
        )}
        {profile?.roles.includes('Administrador del Sistema') && (
          <MenuItem component={Link} to="/admin/system/events" onClick={() => setMenuAnchor(null)} sx={{ gap: 1.5, py: 1.5 }}>
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>admin_panel_settings</Icon>
            Panel Sistema
          </MenuItem>
        )}
        {profile && (profile.roles.includes('Administrador de Eventos') || profile.roles.includes('Administrador de Implementos') || profile.roles.includes('Administrador del Sistema')) && <Divider />}
        <MenuItem onClick={() => { logout(); setMenuAnchor(null) }} sx={{ gap: 1.5, py: 1.5 }}>
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>logout</Icon>
          Cerrar sesión
        </MenuItem>
      </Menu>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          {isAuthenticated ? (
            <Box sx={{ px: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={firebaseUser?.photoURL ?? undefined}
                alt={profile?.name ?? ''}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{profile?.name}</Box>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{profile?.email}</Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ px: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <Icon baseClassName="material-symbols-outlined" sx={{ fontVariationSettings: "'FILL' 1", fontSize: 32 }}>school</Icon>
              <Box sx={{ fontSize: '1.25rem', fontWeight: 700 }}>UNDesparche</Box>
            </Box>
          )}
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(link.to)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                  }}
                >
                  <ListItemIcon>
                    <Icon baseClassName="material-symbols-outlined">{link.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {isAuthenticated ? (
              <ListItem disablePadding>
                <ListItemButton onClick={() => { logout(); setDrawerOpen(false) }}>
                  <ListItemIcon>
                    <Icon baseClassName="material-symbols-outlined">logout</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon>
                    <Icon baseClassName="material-symbols-outlined">person</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Iniciar sesión" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar
