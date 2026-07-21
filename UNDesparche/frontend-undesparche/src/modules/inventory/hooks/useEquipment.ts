import { useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useApi, useApiMutation } from '../../../shared/hooks/useApi'
import { listImplements, getImplement, createReserve, getReserve } from '../services/inventoryService'
import type {
  Implement,
  ImplementListParams,
  Reserve,
  ReserveCreatePayload,
} from '../types/inventory.types'

/** Lista de implementos visible para cualquier usuario autenticado, con filtros opcionales. */
export function useImplements(params?: ImplementListParams) {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token) return Promise.resolve<Implement[]>([])
    return listImplements(token, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, JSON.stringify(params)])

  return useApi<Implement[]>(fetcher, [fetcher])
}

/** Detalle de un implemento puntual. Pasa `id = null` para omitir el fetch. */
export function useImplement(id: number | null) {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token || id === null) return Promise.resolve<Implement | null>(null)
    return getImplement(token, id)
  }, [token, id])

  return useApi<Implement | null>(fetcher, [fetcher])
}

/**
 * Crear una reserva. La ventana de 10 minutos y el cambio de estado del
 * implemento a "RES" los calcula el backend; este hook solo dispara el POST.
 */
export function useCreateReserve() {
  const { token } = useAuth()

  const mutationFn = useCallback(
    (payload: ReserveCreatePayload) => {
      if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
      return createReserve(token, payload)
    },
    [token],
  )

  return useApiMutation(mutationFn)
}

/**
 * Consulta el estado de una reserva puntual (usado para el countdown de 10
 * minutos en ReservationPage). Pasa `id = null` para omitir el fetch.
 * NOTA: se asume contexto de usuario normal (Reserve), no admin.
 */
export function useReserve(id: number | null) {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token || id === null) return Promise.resolve<Reserve | null>(null)
    return getReserve(token, id) as Promise<Reserve | null>
  }, [token, id])

  return useApi<Reserve | null>(fetcher, [fetcher])
}