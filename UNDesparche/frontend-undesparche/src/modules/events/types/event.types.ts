export type EventStatus = 'PRO' | 'ECU' | 'CAN' | 'FIN'

export type EventCategory = 'ACA' | 'CUL' | 'DEP' | 'ASA' | 'PAR' | 'OTR'

export interface EventOrganizer {
  id: number
  name: string
}

export interface Event {
  id: number
  name: string
  description: string
  published: boolean
  place: string
  latitude: number
  longitude: number
  datetime_start: string
  datetime_end: string
  organizer: EventOrganizer
  status: EventStatus
  category: EventCategory | null
  image: string | null
  is_subscribed: boolean
}

export interface EventFiltersState {
  search: string
  category: EventCategory | ''
  status: EventStatus | ''
}

export interface EventFormData {
  name: string
  description: string
  place: string
  latitude: number
  longitude: number
  datetime_start: string
  datetime_end: string
  status: EventStatus
  category: EventCategory | null
  image_file?: File | null
}
