import { Route } from 'react-router'
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

export const routes = (
  <Route element={<AppLayout />}>
    <Route index element={<LandingPage />} />
    <Route path="events" element={<EventsListPage />} />
    <Route path="events/:id" element={<EventDetailPage />} />
    <Route path="admin/events" element={<EventsAdminPage />} />
    <Route path="equipment" element={<EquipmentListPage />} />
    <Route path="equipment/:id" element={<EquipmentDetailPage />} />
    <Route path="equipment/:id/reserve" element={<ReservationPage />} />
    <Route path="admin/equipment" element={<EquipmentAdminPage />} />
    <Route path="map" element={<CampusMapPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="admin/system" element={<SystemAdminPage />} />
  </Route>
)
