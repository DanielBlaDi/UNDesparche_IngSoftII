import { useAuth } from '../../auth/hooks/useAuth'
import AdminLayout from '../../../shared/components/layout/AdminLayout'
import type { SidebarItem } from '../../../shared/components/layout/AdminSidebar'

const SYSTEM_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Gestión de eventos', icon: 'event', path: '/admin/system/events' },
  { label: 'Usuarios', icon: 'group', path: '/admin/system/users' },
  { label: 'Inventario', icon: 'inventory_2', path: '/admin/system/inventory' },
]

export default function SystemAdminPage() {
  const { profile, firebaseUser, logout } = useAuth()

  return (
    <AdminLayout
      sidebarItems={SYSTEM_SIDEBAR_ITEMS}
      userName={profile?.name ?? 'Admin'}
      userRole="Administrador del Sistema"
      photoURL={firebaseUser?.photoURL}
      onLogout={logout}
    />
  )
}
