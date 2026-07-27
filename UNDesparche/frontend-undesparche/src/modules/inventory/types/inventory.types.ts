// Tipos correspondientes a inventory/models.py e inventory/serializers.py del backend

export type ImplementCategory = 'BAL' | 'RAQ' | 'MES' | 'JUR' | 'JUM' | 'OTS' | ''

export const IMPLEMENT_CATEGORY_LABELS: Record<Exclude<ImplementCategory, ''>, string> = {
  BAL: 'Balones',
  RAQ: 'Raquetas',
  MES: 'Mesas',
  JUR: 'Juegos recreativos',
  JUM: 'Juegos de mesa',
  OTS: 'Otros',
}

export type Faculty =
  | 'ART' | 'CCS' | 'CIA' | 'CIE' | 'CHS' | 'DER' | 'ENF' | 'ING' | 'MED' | 'MVZ' | 'ODO'

export const FACULTY_LABELS: Record<Faculty, string> = {
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

export type ImplementState = 'DIS' | 'NDS' | 'RES' | 'PRE'

export const IMPLEMENT_STATE_LABELS: Record<ImplementState, string> = {
  DIS: 'Disponible',
  NDS: 'No disponible',
  RES: 'Reservado',
  PRE: 'Prestado',
}

/** Tal como lo devuelve GET /inventory/implements/ y /inventory/implements/:id/ */
export interface Implement {
  id: number
  name: string
  category: ImplementCategory
  faculty: Faculty | null
  state: ImplementState
  description: string
  image: string | null
}

/**
 * Payload para crear/actualizar un implemento.
 * - `faculty` solo es obligatorio si el usuario es Administrador del Sistema;
 *   el Administrador de Implementos no necesita mandarlo (el backend usa su propia facultad).
 * - `image_file` es opcional; si se manda, reemplaza la imagen actual.
 * - `state` NO se puede mandar: el backend rechaza asignarlo manualmente a RES o PRE,
 *   y en general el ciclo de vida completo lo gestiona el sistema.
 */
export interface ImplementPayload {
  name: string
  category?: ImplementCategory
  faculty?: Faculty
  state?: Extract<ImplementState, 'DIS' | 'NDS'> // el admin solo puede alternar estos dos
  description: string
  image_file?: File
}

/** GET /inventory/reserves/ y /inventory/reserves/:id/ para un Miembro de la Comunidad */
export interface Reserve {
  id: number
  implement: number
  implement_name: string
  implement_state: ImplementState
  datetime_reserved: string // ISO 8601
  datetime_expiration: string | null // ISO 8601, ~10 min después de datetime_reserved
  active: boolean
}

/** GET /inventory/reserves/ para Administrador de Implementos / del Sistema */
export interface ReserveAdmin {
  id: number
  implement: number
  implement_name: string
  user: number
  user_email: string
  user_name: string
  datetime_reserved: string
  datetime_expiration: string | null
  active: boolean
}

/** POST /inventory/reserves/ — solo se manda el id del implemento a reservar */
export interface ReserveCreatePayload {
  implement: number
}

/** GET /inventory/borrowings/ y respuesta de POST /inventory/reserves/:id/confirm/ */
export interface Borrowing {
  id: number
  implement: number
  implement_name: string
  user: number
  user_email: string
  user_name: string
  datetime_borrowed: string
  datetime_return: string | null
  active: boolean
}

/** Filtros soportados por GET /inventory/implements/ (DjangoFilterBackend + SearchFilter) */
export interface ImplementListParams {
  category?: ImplementCategory
  faculty?: Faculty
  search?: string
}