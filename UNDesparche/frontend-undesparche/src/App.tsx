import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Top bar */}
      <Box
        sx={{
          borderTop: 4,
          borderColor: 'primary.main',
          bgcolor: 'background.paper',
          boxShadow: 1,
          py: 2,
          px: 3,
          mb: 4,
        }}
      >
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
          UNDesparche &mdash; Theme Preview
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {/* Typography */}
        <Typography variant="h4" gutterBottom>
          Tipografia
        </Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          {(
            ['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption'] as const
          ).map((v) => (
            <Box key={v}>
              <Typography variant="caption" color="text.secondary">
                {v}
              </Typography>
              <Typography variant={v}>
                {v === 'h1'
                  ? 'Display Grande'
                  : v === 'h2'
                    ? 'Headline Principal'
                    : v === 'h3'
                      ? 'Titulo de Seccion'
                      : v === 'h4'
                        ? 'Subtitulo o Lead'
                        : v === 'body1'
                          ? 'Cuerpo de texto principal con Arimo. Este es el parrafo estandar para contenido.'
                          : v === 'body2'
                            ? 'Label y texto secundario de UI'
                            : 'Caption small 12px'}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Buttons */}
        <Typography variant="h4" gutterBottom>
          Botones
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Button variant="contained">Primario</Button>
          <Button variant="contained" color="secondary">
            Secundario
          </Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="outlined" color="secondary">
            Outline Grey
          </Button>
          <Button variant="contained" color="error">
            Destructivo
          </Button>
          <Button variant="contained" disabled>
            Deshabilitado
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Inputs */}
        <Typography variant="h4" gutterBottom>
          Inputs
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <TextField label="Nombre del evento" variant="outlined" />
          <TextField label="Email institucional" variant="outlined" placeholder="user@unal.edu.co" />
          <TextField label="Error" variant="outlined" error helperText="Campo obligatorio" />
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Chips / Status Badges */}
        <Typography variant="h4" gutterBottom>
          Status Badges
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
          <Chip label="Programado" color="primary" variant="filled" />
          <Chip label="En Curso" color="success" variant="filled" />
          <Chip label="Finalizado" color="secondary" variant="filled" />
          <Chip label="Cancelado" color="error" variant="filled" />
          <Chip label="Reservado" color="warning" variant="filled" />
          <Chip label="Info" color="info" variant="filled" />
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Cards */}
        <Typography variant="h4" gutterBottom>
          Cards
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: 'wrap', gap: 3 }}>
          {[
            { title: 'Simposio de IA', category: 'Academico', date: 'Oct 15, 2024', status: 'Programado' },
            { title: 'Concierto Filarmonica', category: 'Cultura', date: 'Oct 18, 2024', status: 'En Curso' },
            { title: 'Torneo de Voleibol', category: 'Deportes', date: 'Oct 19, 2024', status: 'Finalizado' },
          ].map((ev) => (
            <Card key={ev.title} sx={{ width: 280 }}>
              <CardContent>
                <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={ev.category} size="small" color="info" variant="filled" />
                  <Chip
                    label={ev.status}
                    size="small"
                    color={ev.status === 'Programado' ? 'primary' : ev.status === 'En Curso' ? 'success' : 'secondary'}
                    variant="filled"
                  />
                </Stack>
                <Typography variant="h3" sx={{ fontSize: '1.25rem', mb: 1 }}>
                  {ev.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ev.date}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" fullWidth>
                  Ver detalle
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Table */}
        <Typography variant="h4" gutterBottom>
          Tabla
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Evento</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Ubicacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { name: 'Simposio de Fisica Cuantica', status: 'Programado', date: '15 Oct, 2024', loc: 'Auditorio Leon de Greiff' },
              { name: 'Concierto Filarmonica UNAL', status: 'Borrador', date: '22 Nov, 2024', loc: 'Plaza Che' },
              { name: 'Torneo Interfacultades', status: 'En Curso', date: 'Hoy', loc: 'Coliseo Central' },
            ].map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'Programado' ? 'primary' : row.status === 'En Curso' ? 'success' : 'secondary'}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.loc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Box>
  )
}

export default App
