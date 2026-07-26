import { useState, useRef, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import type { Event, EventFormData, EventCategory, EventStatus } from '../types/event.types'

const categories: { value: EventCategory; label: string }[] = [
  { value: 'ACA', label: 'Académico' },
  { value: 'CUL', label: 'Cultural' },
  { value: 'DEP', label: 'Deportes' },
  { value: 'ASA', label: 'Asamblea' },
  { value: 'PAR', label: 'Parche' },
  { value: 'OTR', label: 'Otro' },
]

function formFromEvent(event: Event): EventFormData {
  return {
    name: event.name,
    description: event.description,
    place: event.place,
    latitude: event.latitude,
    longitude: event.longitude,
    datetime_start: event.datetime_start.slice(0, 16),
    datetime_end: event.datetime_end.slice(0, 16),
    status: event.status,
    category: event.category,
    image_file: null,
  }
}

interface EventFormProps {
  open: boolean
  event?: Event | null
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
}

export default function EventForm({ open, event, onClose, onSave }: EventFormProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<EventFormData>(() => event ? formFromEvent(event) : {
    name: '',
    description: '',
    place: '',
    latitude: 4.638,
    longitude: -74.0835,
    datetime_start: '',
    datetime_end: '',
    status: 'PRO' as EventStatus,
    category: 'ACA' as EventCategory,
    image_file: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const minDateTime = useMemo(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }, [])
  const isCreating = !event
  const startDateInvalid = isCreating && form.datetime_start && form.datetime_start < minDateTime
  const endDateInvalid = form.datetime_start && form.datetime_end && form.datetime_end <= form.datetime_start

  const update = (field: keyof EventFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const now = new Date()
      const start = new Date(form.datetime_start)
      const end = new Date(form.datetime_end)
      let status: EventStatus
      if (now >= start && now < end) {
        status = 'ECU'
      } else if (now >= end) {
        status = 'FIN'
      } else {
        status = 'PRO'
      }

      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('place', form.place)
      formData.append('latitude', Number(form.latitude).toFixed(7))
      formData.append('longitude', Number(form.longitude).toFixed(7))
      formData.append('datetime_start', start.toISOString())
      formData.append('datetime_end', end.toISOString())
      formData.append('status', status)
      if (form.category) formData.append('category', form.category)
      if (form.image_file) formData.append('image_file', form.image_file)
      await onSave(formData)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon baseClassName="material-symbols-outlined" sx={{ color: 'primary.main' }}>edit_square</Icon>
        {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Nombre del Evento *"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Categoría"
            value={form.category ?? ''}
            onChange={e => update('category', e.target.value || null)}
            fullWidth
          >
            <MenuItem value="">Sin categoría</MenuItem>
            {categories.map(c => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Fecha y Hora Inicio *"
              type="datetime-local"
              value={form.datetime_start}
              onChange={e => update('datetime_start', e.target.value)}
              required
              slotProps={{
                inputLabel: { shrink: true },
                input: { inputProps: isCreating ? { min: minDateTime } : undefined },
              }}
              error={!!startDateInvalid}
              helperText={startDateInvalid ? 'La fecha y hora de inicio no puede ser anterior a la fecha y hora actual.' : undefined}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Fecha y Hora Fin *"
              type="datetime-local"
              value={form.datetime_end}
              onChange={e => update('datetime_end', e.target.value)}
              required
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!endDateInvalid}
              helperText={endDateInvalid ? 'La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio.' : undefined}
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
          <TextField
            label="Lugar *"
            value={form.place}
            onChange={e => update('place', e.target.value)}
            required
            fullWidth
          />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Ubicación en el mapa — arrastra el marcador para ajustar las coordenadas
            </Typography>
            <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''}>
                <Map
                  defaultCenter={{ lat: form.latitude, lng: form.longitude }}
                  center={{ lat: form.latitude, lng: form.longitude }}
                  defaultZoom={15}
                  disableDefaultUI
                  gestureHandling="greedy"
                  style={{ width: '100%', height: '100%' }}
                >
                  <Marker
                    position={{ lat: form.latitude, lng: form.longitude }}
                    draggable
                    onDragEnd={(e) => {
                      if (e.latLng) {
                        update('latitude', e.latLng.lat())
                        update('longitude', e.latLng.lng())
                      }
                    }}
                  />
                </Map>
              </APIProvider>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Icon baseClassName="material-symbols-outlined">upload</Icon>}
            >
              {form.image_file ? form.image_file.name : 'Subir Imagen'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => update('image_file', e.target.files?.[0] ?? null)}
              />
            </Button>
            {event?.image && !form.image_file && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Imagen actual conservada
              </Typography>
            )}
          </Box>
          <TextField
            label="Descripción *"
            value={form.description}
            onChange={e => update('description', e.target.value)}
            required
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !form.name || !form.description || !form.datetime_start || !form.datetime_end || !form.place || !!startDateInvalid || !!endDateInvalid}
          startIcon={<Icon baseClassName="material-symbols-outlined">save</Icon>}
        >
          {saving ? 'Guardando...' : event ? 'Actualizar' : 'Crear Evento'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
