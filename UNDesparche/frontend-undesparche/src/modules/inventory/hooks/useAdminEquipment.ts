import { useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useApi, useApiMutation } from '../../../shared/hooks/useApi'
import {
  listImplements,
  createImplement,
  updateImplement,
  deleteImplement,
  listReserves,
  confirmReserve,
  cancelReserve,
  listBorrowings,
  returnBorrowing,
} from '../services/inventoryService'
import type {
  Implement,
  ImplementListParams,
  ImplementPayload,
  ReserveAdmin,
  Borrowing,
} from '../types/inventory.types'

/**
 * CRUD de implementos para Administrador de Implementos / del Sistema.
 * El backend filtra por facultad automáticamente según el rol del usuario.
 */
export function useAdminImplements(params?: ImplementListParams) {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token) return Promise.resolve<Implement[]>([])
    return listImplements(token, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, JSON.stringify(params)])

  const query = useApi<Implement[]>(fetcher, [fetcher])

  const create = useApiMutation(
    useCallback(
      (payload: ImplementPayload) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return createImplement(token, payload)
      },
      [token],
    ),
  )

  const update = useApiMutation(
    useCallback(
      (id: number, payload: Partial<ImplementPayload>) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return updateImplement(token, id, payload)
      },
      [token],
    ),
  )

  const remove = useApiMutation(
    useCallback(
      (id: number) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return deleteImplement(token, id)
      },
      [token],
    ),
  )

  return { ...query, create, update, remove }
}

/**
 * Reservas visibles para el admin (el backend ya filtra por su facultad,
 * salvo Administrador del Sistema que las ve todas). Usa ReserveAdminSerializer.
 */
export function useAdminReserves() {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token) return Promise.resolve<ReserveAdmin[]>([])
    // El backend decide el serializer según el rol; en contexto admin
    // siempre será ReserveAdminSerializer, de ahí el cast.
    return listReserves(token) as Promise<ReserveAdmin[]>
  }, [token])

  const query = useApi<ReserveAdmin[]>(fetcher, [fetcher])

  const confirm = useApiMutation(
    useCallback(
      (id: number) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return confirmReserve(token, id)
      },
      [token],
    ),
  )

  const cancel = useApiMutation(
    useCallback(
      (id: number) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return cancelReserve(token, id)
      },
      [token],
    ),
  )

  return { ...query, confirm, cancel }
}

/** Préstamos gestionables por el admin (misma lógica de filtrado por facultad). */
export function useAdminBorrowings() {
  const { token } = useAuth()

  const fetcher = useCallback(() => {
    if (!token) return Promise.resolve<Borrowing[]>([])
    return listBorrowings(token)
  }, [token])

  const query = useApi<Borrowing[]>(fetcher, [fetcher])

  const returnImplement = useApiMutation(
    useCallback(
      (id: number) => {
        if (!token) return Promise.reject(new Error('No hay una sesión activa.'))
        return returnBorrowing(token, id)
      },
      [token],
    ),
  )

  return { ...query, returnImplement }
}