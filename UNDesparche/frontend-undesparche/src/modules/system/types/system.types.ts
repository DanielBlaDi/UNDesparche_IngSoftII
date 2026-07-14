export type SystemUserStatus = 'ACT' | 'SAN'

export type SystemUserRole =
  | 'Miembro de la Comunidad'
  | 'Administrador de Eventos'
  | 'Administrador de Implementos'
  | 'Administrador del Sistema'

export interface SystemUser {
  id: number
  email: string
  name: string
  faculty: string | null
  status: SystemUserStatus
  is_active: boolean
  roles: SystemUserRole[]
  date_joined: string
}

export const FACULTY_LABELS: Record<string, string> = {
  ART: 'Artes',
  CCS: 'Ciencias',
  CIA: 'Ciencias Agrarias',
  CIE: 'Ciencias Económicas',
  CHS: 'Ciencias Humanas',
  DER: 'Derecho, Ciencias Políticas y Sociales',
  ENF: 'Enfermería',
  ING: 'Ingeniería',
  MED: 'Medicina',
  MVZ: 'Medicina Veterinaria y Zootecnia',
  ODO: 'Odontología',
}

export const STATUS_CONFIG: Record<SystemUserStatus, { label: string; color: 'success' | 'error' }> = {
  ACT: { label: 'Activo', color: 'success' },
  SAN: { label: 'Sancionado', color: 'error' },
}

export const ROLE_OPTIONS: SystemUserRole[] = [
  'Miembro de la Comunidad',
  'Administrador de Eventos',
  'Administrador de Implementos',
  'Administrador del Sistema',
]
