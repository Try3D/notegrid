import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Todos from './pages/Todos'
import Matrix from './pages/Matrix'
import Links from './pages/Links'
import Settings from './pages/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { uuid } = useAuth()
  if (!uuid) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  const { uuid } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={uuid ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Todos />} />
        <Route path="matrix" element={<Matrix />} />
        <Route path="links" element={<Links />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
