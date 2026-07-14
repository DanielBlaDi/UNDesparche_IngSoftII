import { useLocation, useNavigate } from 'react-router'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'

export interface SidebarItem {
  label: string
  icon: string
  path: string
}

interface AdminSidebarProps {
  items: SidebarItem[]
  userName: string
  userRole: string
  photoURL?: string | null
  onLogout: () => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function AdminSidebar({ items, userName, userRole, photoURL, onLogout }: AdminSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: 260,
        height: '100%',
        bgcolor: '#002241',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={photoURL ?? undefined}
          sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, bgcolor: 'primary.main', fontSize: 20, fontWeight: 700 }}
        >
          {!photoURL && getInitials(userName)}
        </Avatar>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {userName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          {userRole}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                '&:hover': { bgcolor: active ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Icon baseClassName="material-symbols-outlined">{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 600 : 400 }} />
            </ListItemButton>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ px: 1 }}>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 1,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            mb: 0.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <Icon baseClassName="material-symbols-outlined">home</Icon>
          </ListItemIcon>
          <ListItemText primary="Volver a UNDesparche" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: 1,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <Icon baseClassName="material-symbols-outlined">logout</Icon>
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
      </List>
    </Box>
  )
}
