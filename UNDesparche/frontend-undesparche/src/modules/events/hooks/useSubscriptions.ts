import { useState, useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { subscribeToEvent, unsubscribeFromEvent } from '../services/eventService'

interface UseSubscriptionsReturn {
  subscribe: (eventId: number, email?: string) => Promise<void>
  unsubscribe: (eventId: number, email?: string) => Promise<void>
  toggleSubscription: (eventId: number, isSubscribed: boolean) => Promise<void>
  loading: boolean
  error: string | null
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useCallback(async (eventId: number, email?: string) => {
    setLoading(true)
    setError(null)
    try {
      await subscribeToEvent(eventId, token, email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al suscribirse'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const unsubscribe = useCallback(async (eventId: number, email?: string) => {
    setLoading(true)
    setError(null)
    try {
      await unsubscribeFromEvent(eventId, token, email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar suscripción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const toggleSubscription = useCallback(async (eventId: number, isSubscribed: boolean) => {
    if (isSubscribed) {
      await unsubscribe(eventId)
    } else {
      await subscribe(eventId)
    }
  }, [subscribe, unsubscribe])

  return { subscribe, unsubscribe, toggleSubscription, loading, error }
}
