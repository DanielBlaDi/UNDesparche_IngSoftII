import { useCallback, useEffect, useRef, useState } from 'react'

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook genérico para peticiones de solo lectura (GET) que se disparan
 * automáticamente al montar el componente o cuando cambian `deps`.
 *
 * @param fetcher función que devuelve la promesa de datos. Debe ser estable
 *   (envuelta en useCallback en quien la use) para evitar loops de refetch.
 * @param deps arreglo de dependencias, igual que en useEffect.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  // Guardamos la última versión de fetcher en un ref para no tener que
  // meterla como dependencia literal del useCallback de refetch.
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    return fetcherRef
      .current()
      .then((data) => {
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        setState({ data: null, loading: false, error: getErrorMessage(err) })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { ...state, refetch }
}

interface UseApiMutationState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook genérico para peticiones que modifican datos (POST/PATCH/DELETE).
 * A diferencia de useApi, NO se dispara automáticamente: hay que llamar
 * `mutate(...)` manualmente (por ejemplo, al enviar un formulario).
 */
export function useApiMutation<TArgs extends unknown[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<UseApiMutationState<TResult>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (...args: TArgs) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = await mutationFn(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (err) {
        setState({ data: null, loading: false, error: getErrorMessage(err) })
        throw err
      }
    },
    [mutationFn],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, mutate, reset }
}