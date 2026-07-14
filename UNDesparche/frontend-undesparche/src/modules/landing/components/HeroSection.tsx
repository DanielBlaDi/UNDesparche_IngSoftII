import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { Link } from 'react-router'
import heroBg from '../../../assets/landing.webp'

function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 500, md: 600 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#333333',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          mixBlendMode: 'overlay',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          px: { xs: 2, md: 5 },
          maxWidth: 1280,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Chip
          label="Conectando la Universidad Nacional"
          sx={{
            bgcolor: '#ffffff',
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.75rem',
            mb: 3,
            px: 2,
            border: '1px solid',
            borderColor: 'grey.400',
            borderRadius: '16px',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            mb: 2,
            maxWidth: 900,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.2,
          }}
        >
          Todo el campus,{' '}
          <Box component="span" sx={{ color: '#e1e3e4' }}>
            en un solo lugar
          </Box>
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: '#e1e3e4',
            mb: 4,
            maxWidth: 600,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Descubre eventos, gestiona reservas de equipos y navega por el campus con la plataforma oficial para la
          comunidad UNAL.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            component={Link}
            to="/events"
            variant="contained"
            sx={{ px: 4, py: 1.5, borderRadius: '0.75rem' }}
          >
            Explorar Eventos
          </Button>
          <Button
            component={Link}
            to="/equipment"
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '0.75rem',
              borderColor: '#e1e3e4',
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Ver Catálogo de Equipos
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 64,
          bgcolor: 'background.default',
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
        }}
      />
    </Box>
  )
}

export default HeroSection
