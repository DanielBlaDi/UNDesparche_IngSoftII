import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Icon from '@mui/material/Icon'
import { Link } from 'react-router'

const featuredEvent = {
  title: 'Simposio Nacional de Inteligencia Artificial',
  category: 'Académico',
  status: 'En curso',
  description:
    'Reuniendo a los principales investigadores y estudiantes para debatir el futuro del aprendizaje automático en Colombia.',
  date: 'Octubre 15, 2024',
  location: 'Auditorio León de Greiff',
}

const miniEvents = [
  {
    title: 'Concierto Orquesta Filarmónica',
    category: 'Cultura',
    status: 'Programado',
    date: 'Vie, 18 Oct - 18:00',
    location: 'Plaza Che',
  },
  {
    title: 'Torneo Interfacultades de Voleibol',
    category: 'Deportes',
    status: 'Programado',
    date: 'Sab, 19 Oct - 08:00',
    location: 'Coliseo Central',
  },
]

function EventsPreview() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Eventos Destacados
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No te pierdas lo que está sucediendo esta semana en la UNAL.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/events"
          sx={{
            display: { xs: 'none', md: 'flex' },
            color: 'primary.main',
            fontWeight: 600,
            textTransform: 'none',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          Ver todos{' '}
          <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
            arrow_forward
          </Icon>
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' }, gap: 3 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '0.75rem',
            border: '1px solid',
            borderColor: 'grey.400',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              height: { xs: 200, md: 'auto' },
              bgcolor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 48, color: 'grey.500' }}>
              event
            </Icon>
          </Box>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip label={featuredEvent.category} size="small" color="info" variant="filled" />
                <Chip label={featuredEvent.status} size="small" color="success" variant="filled" />
              </Box>
              <Typography
                variant="h3"
                sx={{ mb: 1, '&:hover': { color: 'primary.main' }, cursor: 'default' }}
              >
                {featuredEvent.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {featuredEvent.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
                >
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    calendar_today
                  </Icon>{' '}
                  {featuredEvent.date}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
                >
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    location_on
                  </Icon>{' '}
                  {featuredEvent.location}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/events/1"
                variant="contained"
                sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: '0.75rem' }}
              >
                <Icon baseClassName="material-symbols-outlined">arrow_forward</Icon>
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {miniEvents.map((ev) => (
            <Box
              key={ev.title}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: 'grey.400',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Chip
                  label={ev.category}
                  size="small"
                  variant="filled"
                  sx={{ bgcolor: 'grey.100', color: 'text.primary' }}
                />
                <Chip label={ev.status} size="small" color="primary" variant="filled" />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 2, '&:hover': { color: 'primary.main' }, cursor: 'default' }}
              >
                {ev.title}
              </Typography>
              <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
                >
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    schedule
                  </Icon>{' '}
                  {ev.date}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}
                >
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
                    location_on
                  </Icon>{' '}
                  {ev.location}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center', display: { md: 'none' } }}>
        <Button component={Link} to="/events" variant="outlined" fullWidth sx={{ borderRadius: '0.75rem', py: 1 }}>
          Ver todos los eventos
        </Button>
      </Box>
    </Box>
  )
}

export default EventsPreview
