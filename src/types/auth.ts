export interface UserProfile {
  id: string
  username: string
  avatar_url?: string | null
  created_at?: string
}

export interface AuthUser {
  id: string
  email?: string
  profile?: UserProfile | null
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}
