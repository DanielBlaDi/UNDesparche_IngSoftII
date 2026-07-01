import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#191c1d',
        color: 'white',
        py: 6,
        px: { xs: 2, md: 5 },
        borderTop: '1px solid',
        borderColor: 'grey.700',
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 4,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.5rem', fontWeight: 700 }}>
            <Icon
              baseClassName="material-symbols-outlined"
              sx={{ fontVariationSettings: "'FILL' 1", fontSize: 28, color: 'white' }}
            >
              school
            </Icon>
            UNDesparche
          </Box>
          <Typography variant="body2" sx={{ color: '#d9dadb' }}>
            &copy; 2026 Universidad Nacional de Colombia - Sede Bogotá
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#d9dadb', '&:hover': { color: 'white' }, cursor: 'pointer', fontWeight: 700 }}
          >
            Términos de Servicio
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#d9dadb', '&:hover': { color: 'white' }, cursor: 'pointer', fontWeight: 700 }}
          >
            Política de privacidad
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
