import { useState, useEffect } from 'react'
import type { Event } from '../types/event.types'
import { getEventById } from '../services/eventService'
import { useAuth } from '../../auth/hooks/useAuth'

interface UseEventDetailReturn {
  event: Event | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useEventDetail(id: number): UseEventDetailReturn {
  const { token } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getEventById(id, token)
      .then(data => {
        if (cancelled) return
        setEvent(data)
      })
      .catch(() => {
        if (!cancelled) setError('Error al cargar el evento')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, token, refreshKey])

  const refresh = () => setRefreshKey(k => k + 1)

  return { event, loading, error, refresh }
}
