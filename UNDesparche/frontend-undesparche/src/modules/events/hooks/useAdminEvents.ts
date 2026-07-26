import { useState, useEffect, useCallback } from 'react'
import type { Event } from '../types/event.types'
import * as eventService from '../services/eventService'
import { useAuth } from '../../auth/hooks/useAuth'

interface UseAdminEventsReturn {
  events: Event[]
  loading: boolean
  saving: boolean
  error: string | null
  createEvent: (data: FormData) => Promise<void>
  updateEvent: (id: number, data: FormData) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  publishEvent: (id: number) => Promise<void>
  refresh: () => void
  clearError: () => void
}

export function useAdminEvents(): UseAdminEventsReturn {
  const { token } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    eventService.getEvents(token)
      .then(setEvents)
      .catch(() => setError('Error al cargar eventos'))
      .finally(() => setLoading(false))
  }, [refreshKey, token])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])
  const clearError = useCallback(() => setError(null), [])

  const createEvent = useCallback(async (data: FormData) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await eventService.createEvent(data, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear evento'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  const updateEvent = useCallback(async (id: number, data: FormData) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await eventService.updateEvent(id, data, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar evento'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  const deleteEvent = useCallback(async (id: number) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await eventService.deleteEvent(id, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar evento'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  const publishEvent = useCallback(async (id: number) => {
    if (!token) throw new Error('No autenticado')
    setSaving(true)
    setError(null)
    try {
      await eventService.publishEvent(id, token)
      refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al publicar evento'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [refresh, token])

  return { events, loading, saving, error, createEvent, updateEvent, deleteEvent, publishEvent, refresh, clearError }
}
