import { useState, useEffect, useCallback } from 'react'
import type { SystemUser } from '../types/system.types'
import * as systemService from '../services/systemService'
import { useAuth } from '../../auth/hooks/useAuth'

interface UseAdminUsersReturn {
  users: SystemUser[]
  loading: boolean
  saving: boolean
  error: string | null
  updateUser: (id: number, data: Partial<SystemUser>) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  refresh: () => void
  clearError: () => void
}

export function useAdminUsers(): UseAdminUsersReturn {
  const { token } = useAuth()
  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    systemService.getUsers(token)
      .then(setUsers)
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false))
  }, [refreshKey, token])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])
  const clearError = useCallback(() => setError(null), [])

  const updateUser = useCallback(async (id: number, data: Partial<SystemUser>) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await systemService.updateUser(id, data, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  const deleteUser = useCallback(async (id: number) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await systemService.deleteUser(id, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  return { users, loading, saving, error, updateUser, deleteUser, refresh, clearError }
}
