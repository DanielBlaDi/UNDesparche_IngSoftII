import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  FACULTY_LABELS,
  IMPLEMENT_CATEGORY_LABELS,
  type Faculty,
  type Implement,
  type ImplementCategory,
  type ImplementPayload,
} from '../types/inventory.types'

const FACULTY_ENTRIES = Object.entries(FACULTY_LABELS) as [Faculty, string][]
const CATEGORY_ENTRIES = Object.entries(IMPLEMENT_CATEGORY_LABELS) as [ImplementCategory, string][]

interface EquipmentFormProps {
  open: boolean
  implement: Implement | null
  onClose: () => void
  onSave: (payload: ImplementPayload) => Promise<unknown>
}

export function EquipmentForm({ open, implement, onClose, onSave }: EquipmentFormProps) {
  const { hasRole } = useAuth()
  // El backend solo exige/usa 'faculty' del body cuando quien crea es
  // Administrador del Sistema; el Administrador de Implementos siempre usa
  // su propia facultad (perform_create en ImplementViewSet).
  const isSystemAdmin = hasRole('Administrador del Sistema')

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ImplementCategory | ''>('')
  const [faculty, setFaculty] = useState<Faculty | ''>('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(implement?.name ?? '')
      setCategory(implement?.category ?? '')
      setFaculty(implement?.faculty ?? '')
      setDescription(implement?.description ?? '')
      setImageFile(undefined)
      setError(null)
    }
  }, [open, implement])

  const handleSubmit = async () => {
    setError(null)

    if (!name.trim() || !description.trim()) {
      setError('Nombre y descripción son obligatorios.')
      return
    }
    if (isSystemAdmin && !faculty) {
      setError('Selecciona la facultad del implemento.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        name,
        category: category || undefined,
        faculty: isSystemAdmin ? (faculty as Faculty) : undefined,
        description,
        image_file: imageFile,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el implemento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{implement ? 'Editar implemento' : 'Nuevo implemento'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label="Nombre" value={name} onChange={e => setName(e.target.value)} fullWidth required />

        <Select
          value={category}
          onChange={e => setCategory(e.target.value as ImplementCategory | '')}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Sin categoría</MenuItem>
          {CATEGORY_ENTRIES.map(([code, label]) => (
            <MenuItem key={code} value={code}>
              {label}
            </MenuItem>
          ))}
        </Select>

        {isSystemAdmin && (
          <Select
            value={faculty}
            onChange={e => setFaculty(e.target.value as Faculty | '')}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Selecciona una facultad
            </MenuItem>
            {FACULTY_ENTRIES.map(([code, label]) => (
              <MenuItem key={code} value={code}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}

        <TextField
          label="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          minRows={3}
        />

        <Button component="label" variant="outlined">
          {imageFile ? imageFile.name : 'Subir imagen (opcional)'}
          <input type="file" accept="image/*" hidden onChange={e => setImageFile(e.target.files?.[0])} />
        </Button>

        {implement?.image && !imageFile && (
          <Typography variant="caption" color="text.secondary">
            Ya tiene una imagen cargada. Sube un archivo nuevo solo si quieres reemplazarla.
          </Typography>
        )}

        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}