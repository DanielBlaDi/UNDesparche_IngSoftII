const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit
  token?: string | null
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

function formatApiError(data: unknown): string {
  if (typeof data === 'string') {
    return data
  }

  if (Array.isArray(data)) {
    const messages = data.map(formatApiError).filter(Boolean)
    return messages.join(' ')
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>

    if (typeof obj.detail === 'string') {
      return obj.detail
    }

    if (Array.isArray(obj.detail)) {
      return formatApiError(obj.detail)
    }

    if (Array.isArray(obj.non_field_errors)) {
      return formatApiError(obj.non_field_errors)
    }

    if (typeof obj.non_field_errors === 'string') {
      return obj.non_field_errors
    }

    const fieldErrors: string[] = []
    for (const [field, value] of Object.entries(obj)) {
      const msg = formatApiError(value)
      if (msg) {
        if (field === 'non_field_errors' || field === 'detail') {
          fieldErrors.push(msg)
        } else {
          fieldErrors.push(`${field}: ${msg}`)
        }
      }
    }

    if (fieldErrors.length > 0) {
      return fieldErrors.join(' ')
    }
  }

  return ''
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    const formatted = formatApiError(data)
    if (formatted) {
      return formatted
    }
    return JSON.stringify(data)
  } catch {
    return `Error ${response.status}: ${response.statusText}`
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, body, ...init } = options
  const finalHeaders = new Headers(headers)

  finalHeaders.set('Accept', 'application/json')

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  const isFormData = body instanceof FormData

  if (body !== undefined && !isFormData && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: finalHeaders,
    body,
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export { API_BASE_URL }