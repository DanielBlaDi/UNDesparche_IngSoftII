import { BrowserRouter, Routes } from 'react-router'
import { AuthProvider } from './modules/auth/context/AuthContext'
import { routes } from './routes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
