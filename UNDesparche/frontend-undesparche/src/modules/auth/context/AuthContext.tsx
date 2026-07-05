import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import {
  fetchMyProfile,
  getIdToken,
  signInWithGoogle as startGoogleSignIn,
  signOutUser,
  subscribeToAuthChanges,
} from '../services/authService'
import type { AuthContextValue, BackendProfile } from '../types/auth.types'

type SessionData = {
  token: string
  profile: BackendProfile
}

async function buildSession(user: FirebaseUser): Promise<SessionData> {
  const token = await user.getIdToken()
  const profile = await fetchMyProfile(token)

  return { token, profile }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<BackendProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    setFirebaseUser(null)
    setToken(null)
    setProfile(null)
  }, [])

  const setSession = useCallback(
    (user: FirebaseUser, session: SessionData) => {
      setFirebaseUser(user)
      setToken(session.token)
      setProfile(session.profile)
    },
    [],
  )

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const freshToken = await getIdToken(true)

      if (!freshToken) {
        throw new Error('No hay una sesión activa.')
      }

      const nextProfile = await fetchMyProfile(freshToken)
      setToken(freshToken)
      setProfile(nextProfile)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo refrescar el perfil.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [firebaseUser])

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const user = await startGoogleSignIn()
      const session = await buildSession(user)
      setSession(user, session)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo iniciar sesión.'

      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setSession])

  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signOutUser()
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }, [clearSession])

  const hasRole = useCallback(
    (roles: AuthContextValue['profile'] extends never ? never : string | string[]) => {
      if (!profile) {
        return false
      }

      const requiredRoles = Array.isArray(roles) ? roles : [roles]
      return requiredRoles.some((role) => profile.roles.includes(role as never))
    },
    [profile],
  )

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setIsLoading(true)
      setError(null)

      if (!user) {
        clearSession()
        setIsLoading(false)
        return
      }

      try {
        const session = await buildSession(user)
        setSession(user, session)
      } catch (err) {
        clearSession()
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo restaurar la sesión.',
        )
      } finally {
        setIsLoading(false)
      }
    })

    return unsubscribe
  }, [clearSession, setSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      token,
      profile,
      isAuthenticated: Boolean(firebaseUser && token),
      isLoading,
      error,
      signInWithGoogle,
      logout,
      refreshProfile,
      hasRole,
    }),
    [
      error,
      firebaseUser,
      hasRole,
      isLoading,
      logout,
      profile,
      refreshProfile,
      signInWithGoogle,
      token,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }