import { Route, Navigate } from 'react-router'
import AppLayout from '../shared/components/layout/AppLayout'
import LandingPage from '../modules/landing/pages/LandingPage'
import EventsListPage from '../modules/events/pages/EventsListPage'
import EventDetailPage from '../modules/events/pages/EventDetailPage'
import EventsAdminPage from '../modules/events/pages/EventsAdminPage'
import EquipmentListPage from '../modules/inventory/pages/EquipmentListPage'
import EquipmentDetailPage from '../modules/inventory/pages/EquipmentDetailPage'
import EquipmentAdminPage from '../modules/inventory/pages/EquipmentAdminPage'
import ReservationPage from '../modules/inventory/pages/ReservationPage'
import CampusMapPage from '../modules/campus/pages/CampusMapPage'
import LoginPage from '../modules/auth/pages/LoginPage'
import SystemAdminPage from '../modules/system/pages/SystemAdminPage'
import SystemEventsPage from '../modules/system/pages/SystemEventsPage'
import SystemUsersPage from '../modules/system/pages/SystemUsersPage'
import SystemInventoryPage from '../modules/system/pages/SystemInventoryPage'
import RoleGuard from './guards/RoleGuard'
import UnauthorizedPage from '../modules/auth/pages/UnauthorizedPage'

const ALL_ROLES = [
  'Miembro de la Comunidad',
  'Administrador de Eventos',
  'Administrador de Implementos',
  'Administrador del Sistema',
] as const

export const routes = (
  <>
    <Route element={<AppLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="events" element={<EventsListPage />} />
      <Route path="events/:id" element={<EventDetailPage />} />

      <Route
        path="equipment"
        element={
          <RoleGuard requiredRoles={ALL_ROLES as never}>
            <EquipmentListPage />
          </RoleGuard>
        }
      />
      <Route
        path="equipment/:id"
        element={
          <RoleGuard requiredRoles={ALL_ROLES as never}>
            <EquipmentDetailPage />
          </RoleGuard>
        }
      />
      <Route
        path="equipment/:id/reserve"
        element={
          <RoleGuard requiredRoles={ALL_ROLES as never}>
            <ReservationPage />
          </RoleGuard>
        }
      />

      <Route path="map" element={<CampusMapPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />
    </Route>

    <Route>
      <Route
        path="admin/events"
        element={
          <RoleGuard requiredRoles="Administrador de Eventos">
            <EventsAdminPage />
          </RoleGuard>
        }
      />

      <Route
        path="admin/equipment"
        element={
          <RoleGuard requiredRoles="Administrador de Implementos">
            <EquipmentAdminPage />
          </RoleGuard>
        }
      />

      <Route
        path="admin/system"
        element={
          <RoleGuard requiredRoles="Administrador del Sistema">
            <SystemAdminPage />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="events" replace />} />
        <Route path="events" element={<SystemEventsPage />} />
        <Route path="users" element={<SystemUsersPage />} />
        <Route path="inventory" element={<SystemInventoryPage />} />
      </Route>
    </Route>
  </>
)
