import { apiRequest } from '../../../shared/services/api'
import type {
  Implement,
  ImplementPayload,
  ImplementListParams,
  Reserve,
  ReserveAdmin,
  ReserveCreatePayload,
  Borrowing,
} from '../types/inventory.types'

const BASE = '/inventory'

function buildImplementFormData(payload: ImplementPayload): FormData {
  const formData = new FormData()
  formData.append('name', payload.name)
  if (payload.category) formData.append('category', payload.category)
  if (payload.faculty) formData.append('faculty', payload.faculty)
  if (payload.state) formData.append('state', payload.state)
  formData.append('description', payload.description)
  if (payload.image_file) formData.append('image_file', payload.image_file)
  return formData
}

function buildQuery<T extends object>(params?: T): string {
    if (!params) return ''
    const entries = Object.entries(params).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1] !== '',
    )
    if (entries.length === 0) return ''
    return `?${new URLSearchParams(entries).toString()}`
}

// ---- Implementos ----

export function listImplements(
  token: string,
  params?: ImplementListParams,
): Promise<Implement[]> {
  return apiRequest<Implement[]>(`${BASE}/implements/${buildQuery(params)}`, { token })
}

export function getImplement(token: string, id: number): Promise<Implement> {
  return apiRequest<Implement>(`${BASE}/implements/${id}/`, { token })
}

/** Requiere multipart/form-data porque puede incluir image_file */
export function createImplement(token: string, payload: ImplementPayload): Promise<Implement> {
  return apiRequest<Implement>(`${BASE}/implements/`, {
    method: 'POST',
    token,
    body: buildImplementFormData(payload),
  })
}

export function updateImplement(
  token: string,
  id: number,
  payload: Partial<ImplementPayload>,
): Promise<Implement> {
  const formData = new FormData()
  if (payload.name !== undefined) formData.append('name', payload.name)
  if (payload.category !== undefined) formData.append('category', payload.category)
  if (payload.faculty !== undefined) formData.append('faculty', payload.faculty)
  if (payload.state !== undefined) formData.append('state', payload.state)
  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.image_file) formData.append('image_file', payload.image_file)

  return apiRequest<Implement>(`${BASE}/implements/${id}/`, {
    method: 'PATCH',
    token,
    body: formData,
  })
}

export function deleteImplement(token: string, id: number): Promise<void> {
  return apiRequest<void>(`${BASE}/implements/${id}/`, { method: 'DELETE', token })
}

// ---- Reservas ----

/** El shape depende del rol: Reserve para Miembro de la Comunidad, ReserveAdmin para admins */
export function listReserves(token: string): Promise<Reserve[] | ReserveAdmin[]> {
  return apiRequest<Reserve[] | ReserveAdmin[]>(`${BASE}/reserves/`, { token })
}

export function getReserve(token: string, id: number): Promise<Reserve | ReserveAdmin> {
  return apiRequest<Reserve | ReserveAdmin>(`${BASE}/reserves/${id}/`, { token })
}

export function createReserve(token: string, payload: ReserveCreatePayload): Promise<Reserve> {
  return apiRequest<Reserve>(`${BASE}/reserves/`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

/** Administrador de Implementos: confirma la entrega física -> crea un Borrowing */
export function confirmReserve(token: string, id: number): Promise<Borrowing> {
  return apiRequest<Borrowing>(`${BASE}/reserves/${id}/confirm/`, { method: 'POST', token })
}

/** Administrador de Implementos: cancela una reserva manualmente */
export function cancelReserve(token: string, id: number): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>(`${BASE}/reserves/${id}/cancel/`, {
    method: 'POST',
    token,
  })
}

// ---- Préstamos ----

export function listBorrowings(token: string): Promise<Borrowing[]> {
  return apiRequest<Borrowing[]>(`${BASE}/borrowings/`, { token })
}

export function getBorrowing(token: string, id: number): Promise<Borrowing> {
  return apiRequest<Borrowing>(`${BASE}/borrowings/${id}/`, { token })
}

/** Administrador de Implementos: confirma la devolución física */
export function returnBorrowing(token: string, id: number): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>(`${BASE}/borrowings/${id}/return/`, {
    method: 'POST',
    token,
  })
}