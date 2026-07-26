import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import type { Event } from '../../events/types/event.types'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

const CATEGORY_STYLES: Record<string, { fill: string }> = {
  ACA: { fill: '#003865' },
  CUL: { fill: '#FFC107' },
  DEP: { fill: '#C62828' },
  ASA: { fill: '#28A745' },
  PAR: { fill: '#2E5BFF' },
  OTR: { fill: '#436900' },
}

function markerIcon(fill: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <rect x="4" y="4" width="32" height="32" rx="8" fill="${fill}" stroke="white" stroke-width="3"/>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

interface CampusMapProps {
  events: Event[]
  selectedEvent: Event | null
  onSelectEvent: (event: Event | null) => void
}

function MapInitializer({ events }: { events: Event[] }) {
  const map = useMap()

  useEffect(() => {
    if (!map || events.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    events.forEach(e => bounds.extend({ lat: e.latitude, lng: e.longitude }))
    map.fitBounds(bounds, 80)
  }, [map, events])

  return null
}

function MapControls({ events }: { events: Event[] }) {
  const map = useMap()

  return (
    <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '0.75rem', boxShadow: 3, border: '1px solid', borderColor: 'grey.400', overflow: 'hidden' }}>
        <Box
          onClick={() => map?.setZoom((map.getZoom() ?? 15) + 1)}
          sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
        >
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>add</Icon>
        </Box>
        <Box sx={{ height: 1, bgcolor: 'grey.400' }} />
        <Box
          onClick={() => map?.setZoom((map.getZoom() ?? 15) - 1)}
          sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
        >
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>remove</Icon>
        </Box>
      </Box>
      <Box
        onClick={() => {
          if (!map || events.length === 0) return
          const bounds = new google.maps.LatLngBounds()
          events.forEach(e => bounds.extend({ lat: e.latitude, lng: e.longitude }))
          map.fitBounds(bounds, 80)
        }}
        sx={{ bgcolor: 'background.paper', borderRadius: '0.75rem', boxShadow: 3, border: '1px solid', borderColor: 'grey.400', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>my_location</Icon>
      </Box>
    </Box>
  )
}

function MapLegend() {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        zIndex: 10,
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        p: 2,
        borderRadius: '0.75rem',
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'grey.400',
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 1, pb: 1, borderBottom: '1px solid', borderColor: 'grey.400' }}>Zonas</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {Object.entries(ZONE_LABELS).map(([key, label]) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: CATEGORY_STYLES[key]?.fill ?? '#003865', flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function CampusMapView({ events, selectedEvent, onSelectEvent }: CampusMapProps) {
  const navigate = useNavigate()
  const center = events.length > 0
    ? { lat: events[0].latitude, lng: events[0].longitude }
    : { lat: 4.638, lng: -74.0835 }

  return (
    <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
      <Map
        defaultCenter={center}
        defaultZoom={15}
        mapTypeControl={false}
        fullscreenControl={false}
        streetViewControl={false}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapInitializer events={events} />

        {events.map(event => {
          const style = CATEGORY_STYLES[event.category ?? ''] ?? { fill: '#003865' }
          return (
            <Marker
              key={event.id}
              position={{ lat: event.latitude, lng: event.longitude }}
              title={event.name}
              icon={markerIcon(style.fill)}
              onClick={() => onSelectEvent(event)}
            />
          )
        })}

        {selectedEvent && (
          <InfoWindow
            position={{ lat: selectedEvent.latitude, lng: selectedEvent.longitude }}
            onCloseClick={() => onSelectEvent(null)}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: CATEGORY_STYLES[selectedEvent.category ?? '']?.fill ?? '#003865', textTransform: 'uppercase', fontSize: 10, lineHeight: 1.2 }}>
                {CATEGORY_LABELS[selectedEvent.category ?? ''] ?? selectedEvent.category ?? ''}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 13, mt: 0.25 }}>{selectedEvent.name}</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
                {formatEventDate(selectedEvent)}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                {selectedEvent.place}
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate(`/events/${selectedEvent.id}`)}
                sx={{ mt: 1, width: '100%', fontSize: 11, py: 0.5, textTransform: 'none' }}
              >
                Ver Detalles
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 14 }}>directions</Icon>}
                href={`https://www.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}`}
                target="_blank"
                rel="noopener"
                sx={{ mt: 0.5, width: '100%', fontSize: 11, py: 0.25, textTransform: 'none' }}
              >
                Cómo llegar
              </Button>
            </Box>
          </InfoWindow>
        )}
      </Map>

      <MapControls events={events} />
      <MapLegend />
    </Box>
  )
}

export default function CampusMap(props: CampusMapProps) {
  if (!API_KEY) {
    return (
      <Box
        sx={{
          flex: 1,
          height: '100%',
          bgcolor: 'grey.200',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, #42474f 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'primary.main' }}>map</Icon>
        <Typography variant="body2" color="text.secondary">Mapa no disponible</Typography>
        <Typography variant="caption" color="text.disabled">Configura VITE_GOOGLE_MAPS_API_KEY en .env</Typography>
      </Box>
    )
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <CampusMapView {...props} />
    </APIProvider>
  )
}

const ZONE_LABELS: Record<string, string> = {
  ACA: 'Ingeniería y Ciencias',
  CUL: 'Artes y Humanidades',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

const CATEGORY_LABELS: Record<string, string> = {
  ACA: 'Académico',
  CUL: 'Cultural',
  DEP: 'Deportes',
  ASA: 'Asamblea',
  PAR: 'Parche',
  OTR: 'Otro',
}

function formatEventDate(event: Event): string {
  const d = new Date(event.datetime_start)
  const e = new Date(event.datetime_end)
  if (d.toDateString() === e.toDateString()) return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${d.toLocaleDateString('es', { day: 'numeric', month: 'short' })} - ${e.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}`
}
