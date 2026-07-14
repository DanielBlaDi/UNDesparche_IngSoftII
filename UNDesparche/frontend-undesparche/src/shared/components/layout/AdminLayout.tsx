import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import Box from '@mui/material/Box'
import AdminSidebar from './AdminSidebar'
import type { SidebarItem } from './AdminSidebar'

interface AdminLayoutProps {
  sidebarItems: SidebarItem[]
  userName: string
  userRole: string
  photoURL?: string | null
  onLogout: () => void
  children?: ReactNode
}

export default function AdminLayout({ sidebarItems, userName, userRole, photoURL, onLogout, children }: AdminLayoutProps) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flexShrink: 0 }}>
        <AdminSidebar items={sidebarItems} userName={userName} userRole={userRole} photoURL={photoURL} onLogout={onLogout} />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: 'grey.50',
          p: { xs: 2, md: 4 },
        }}
      >
        {children ?? <Outlet />}
      </Box>
    </Box>
  )
}
