import { createContext, useContext, useState, ReactNode } from 'react'

const AUTH_KEY = 'eisenhower_uuid'

interface AuthContextType {
  uuid: string | null
  setUUID: (uuid: string) => void
  clearUUID: () => void
  generateUUID: () => string
  isValidUUID: (uuid: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uuid, setUUIDState] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_KEY)
  })

  const setUUID = (newUUID: string) => {
    localStorage.setItem(AUTH_KEY, newUUID)
    setUUIDState(newUUID)
  }

  const clearUUID = () => {
    localStorage.removeItem(AUTH_KEY)
    setUUIDState(null)
  }

  const generateUUID = () => {
    return crypto.randomUUID()
  }

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  return (
    <AuthContext.Provider value={{ uuid, setUUID, clearUUID, generateUUID, isValidUUID }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
