import { useState, useEffect, useCallback } from 'react'
import type { Event, EventCategory, EventStatus } from '../types/event.types'
import { getEvents } from '../services/eventService'
import { useAuth } from '../../auth/hooks/useAuth'

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  search: string
  categoryFilter: EventCategory | ''
  statusFilter: EventStatus | ''
  setSearch: (value: string) => void
  setCategoryFilter: (value: EventCategory | '') => void
  setStatusFilter: (value: EventStatus | '') => void
  refresh: () => void
}

export function useEvents(): UseEventsReturn {
  const { token } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<EventStatus | ''>('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      getEvents(token, {
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      })
        .then(setEvents)
        .catch(() => setError('Error al cargar eventos'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [refreshKey, search, categoryFilter, statusFilter, token])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  return {
    events,
    loading,
    error,
    search,
    categoryFilter,
    statusFilter,
    setSearch,
    setCategoryFilter,
    setStatusFilter,
    refresh,
  }
}
