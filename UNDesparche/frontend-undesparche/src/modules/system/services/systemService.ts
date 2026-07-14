import { apiRequest } from '../../../shared/services/api'
import type { SystemUser } from '../types/system.types'

interface UserListParams {
  search?: string
  groups__name?: string
  status?: string
}

export async function getUsers(token: string | null, params?: UserListParams): Promise<SystemUser[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.groups__name) query.set('groups__name', params.groups__name)
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  return apiRequest<SystemUser[]>(`/users/${qs ? `?${qs}` : ''}`, { token })
}

export async function getUserById(id: number, token: string | null): Promise<SystemUser> {
  return apiRequest<SystemUser>(`/users/${id}/`, { token })
}

export async function updateUser(id: number, data: Partial<SystemUser>, token: string): Promise<SystemUser> {
  return apiRequest<SystemUser>(`/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteUser(id: number, token: string): Promise<void> {
  return apiRequest<void>(`/users/${id}/`, {
    method: 'DELETE',
    token,
  })
}
