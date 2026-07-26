import { Navigate } from 'react-router'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCEfwvwwWnpCUPIP3ZQSf1MeCU3Vg6u2XPOOW9hGM1VxWXKcS3F5N076cu_yh47W2-XhzVksCDy1V7-Uw-sFEgcBu0g53KJlfCxjq0q2pLVExFc_Z6xnCn3eS8BKyPjwklk01fQ0M6Vix_UYJpCeXQ8j2bUMMf0ex4mHj2IgMK-3yM6Lti0WvEN1Iu7FvKUw-nfHwZI4Ygy-c82MC4VbNeNrKRFxHVHr_qqifz4e7lyV7uZdpL9gyM7wmPCXrlgTo-vuXAk-8Kqj3M)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(248, 249, 250, 0.85)',
            backdropFilter: 'blur(4px)',
          },
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, px: { xs: 2, md: 0 } }}>
        <LoginForm />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
          <Typography
            variant="caption"
            component="a"
            href="#"
            color="text.secondary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            Términos de Servicio
          </Typography>
          <Typography
            variant="caption"
            component="a"
            href="#"
            color="text.secondary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            Política de Privacidad
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
