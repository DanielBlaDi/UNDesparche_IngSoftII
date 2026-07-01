import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'

function FeaturesSection() {
  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 5 },
        bgcolor: 'grey.100',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 256,
          height: 256,
          bgcolor: 'primary.main',
          opacity: 0.05,
          borderRadius: '50%',
          filter: 'blur(64px)',
          transform: 'translate(50%, -50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 320,
          height: 320,
          bgcolor: 'primary.main',
          opacity: 0.05,
          borderRadius: '50%',
          filter: 'blur(64px)',
          transform: 'translate(-25%, 50%)',
        }}
      />
      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(16px)',
          p: 5,
          borderRadius: '0.75rem',
          border: '1px solid',
          borderColor: 'grey.400',
        }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>
          how_to_reg
        </Icon>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Regístrate con tu correo institucional
        </Typography>
        <Typography variant="h4" sx={{ color: 'text.secondary', mb: 4 }}>
          Únete a UNDesparche para reservar equipos, guardar eventos favoritos y acceder a todas las funcionalidades
          exclusivas para la comunidad UNAL.
        </Typography>
        <Button
          variant="outlined"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'white',
            borderColor: 'grey.400',
            color: 'text.primary',
            px: 4,
            py: 2,
            borderRadius: '0.75rem',
            '&:hover': { bgcolor: 'grey.50' },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <Typography variant="button" sx={{ fontWeight: 600 }}>
            Continuar con Google (@unal.edu.co)
          </Typography>
        </Button>
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 2, color: 'text.secondary' }}
        >
          Solo se permiten correos del dominio @unal.edu.co
        </Typography>
      </Box>
    </Box>
  )
}

export default FeaturesSection
