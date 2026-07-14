import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

interface EventMapProps {
  lat: number
  lng: number
  height?: number | string
  zoom?: number
}

export default function EventMap({ lat, lng, height = 280, zoom = 16 }: EventMapProps) {
  const latNum = Number(lat)
  const lngNum = Number(lng)

  if (isNaN(latNum) || isNaN(lngNum)) {
    return (
      <Box sx={{ height, borderRadius: '0.75rem', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Ubicación no disponible</Typography>
      </Box>
    )
  }

  if (!API_KEY) {
    return (
      <Box
        sx={{
          height,
          borderRadius: '0.75rem',
          bgcolor: 'grey.200',
          border: '1px solid',
          borderColor: 'grey.400',
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
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'primary.main' }}>location_on</Icon>
        <Typography variant="body2" color="text.secondary">Mapa no disponible</Typography>
        <Typography variant="caption" color="text.disabled">Configura VITE_GOOGLE_MAPS_API_KEY en .env</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height, borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid', borderColor: 'grey.400' }}>
      <APIProvider apiKey={API_KEY}>
        <Map defaultCenter={{ lat: latNum, lng: lngNum }} defaultZoom={zoom} fullscreenControl={false} mapTypeControl={false}>
          <Marker position={{ lat: latNum, lng: lngNum }} />
        </Map>
      </APIProvider>
    </Box>
  )
}
