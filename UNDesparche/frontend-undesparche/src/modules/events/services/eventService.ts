import { apiRequest } from '../../../shared/services/api'
import type { Event } from '../types/event.types'

interface EventListParams {
  search?: string
  category?: string
  status?: string
}

function parseEvent(event: Event): Event {
  return {
    ...event,
    latitude: Number(event.latitude),
    longitude: Number(event.longitude),
  }
}

export async function getEvents(token: string | null, params?: EventListParams): Promise<Event[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.category) query.set('category', params.category)
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  const data = await apiRequest<Event[]>(`/events/${qs ? `?${qs}` : ''}`, { token })
  return data.map(parseEvent)
}

export async function getEventById(id: number, token: string | null): Promise<Event> {
  return apiRequest<Event>(`/events/${id}/`, { token }).then(parseEvent)
}

export async function createEvent(data: FormData, token: string): Promise<Event> {
  return apiRequest<Event>('/events/', {
    method: 'POST',
    body: data,
    token,
  }).then(parseEvent)
}

export async function updateEvent(id: number, data: FormData, token: string): Promise<Event> {
  return apiRequest<Event>(`/events/${id}/`, {
    method: 'PATCH',
    body: data,
    token,
  }).then(parseEvent)
}

export async function deleteEvent(id: number, token: string): Promise<void> {
  return apiRequest<void>(`/events/${id}/`, {
    method: 'DELETE',
    token,
  })
}

export async function publishEvent(id: number, token: string): Promise<Event> {
  return apiRequest<Event>(`/events/${id}/publish/`, {
    method: 'POST',
    token,
  }).then(parseEvent)
}

export async function subscribeToEvent(id: number, token: string | null, email?: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>(`/events/${id}/subscribe/`, {
    method: 'POST',
    token,
    body: !token && email ? JSON.stringify({ email }) : undefined,
  })
}

export async function unsubscribeFromEvent(id: number, token: string | null, email?: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>(`/events/${id}/unsubscribe/`, {
    method: 'POST',
    token,
    body: !token && email ? JSON.stringify({ email }) : undefined,
  })
}
