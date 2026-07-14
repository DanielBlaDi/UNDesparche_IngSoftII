import type { User as FirebaseUser } from 'firebase/auth'

export type RoleName =
  | 'Miembro de la Comunidad'
  | 'Administrador de Eventos'
  | 'Administrador de Implementos'
  | 'Administrador del Sistema'

export interface BackendProfile {
  id: number
  email: string
  name: string
  faculty: string | null
  status: 'ACT' | 'SAN'
  roles: RoleName[]
}

export interface AuthContextValue {
  firebaseUser: FirebaseUser | null
  token: string | null
  profile: BackendProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (roles: RoleName | RoleName[]) => boolean
}