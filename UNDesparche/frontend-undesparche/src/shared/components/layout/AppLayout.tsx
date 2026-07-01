import Box from '@mui/material/Box'
import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default AppLayout
