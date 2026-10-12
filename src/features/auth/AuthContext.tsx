import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../../services/supabase/client.ts'
import type { AuthState, AuthUser, UserProfile } from '../../types/auth.ts'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (supabaseUser: User): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) return null
    try {
      const { data, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (profileErr || !data) {
        return {
          id: supabaseUser.id,
          username:
            supabaseUser.user_metadata?.username ||
            supabaseUser.email?.split('@')[0] ||
            'MovieExplorer',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        }
      }
      return data as UserProfile
    } catch {
      return null
    }
  }, [])

  const handleSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await fetchProfile(session.user)
      setUser({
        id: session.user.id,
        email: session.user.email,
        profile,
      })
    } catch {
      setUser({
        id: session.user.id,
        email: session.user.email,
      })
    } finally {
      setLoading(false)
    }
  }, [fetchProfile])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        handleSession(session)
      })
      .catch((err) => {
        console.warn('Session restoration notice:', err.message)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [handleSession])

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase authentication is not configured. Please add VITE_SUPABASE_URL and key.',
      }
    }
    setError(null)
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authErr) {
        setError(authErr.message)
        return { success: false, error: authErr.message }
      }

      return { success: true }
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in'
      setError(msg)
      return { success: false, error: msg }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase authentication is not configured. Please add VITE_SUPABASE_URL and key.',
      }
    }
    setError(null)
    try {
      const cleanUsername = username.trim()
      const { data, error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: cleanUsername,
          },
        },
      })

      if (authErr) {
        setError(authErr.message)
        return { success: false, error: authErr.message }
      }

      // If session immediately returned, trigger profile creation fallback if needed
      if (data.user) {
        try {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              username: cleanUsername,
            },
            { onConflict: 'id' }
          )
        } catch {
          // Trigger may have handled it
        }
      }

      // Auto login: establish session immediately upon successful signup
      if (data.session) {
        await handleSession(data.session)
      } else {
        try {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })
          if (!signInErr && signInData.session) {
            await handleSession(signInData.session)
          }
        } catch {
          // signIn fallback
        }
      }

      return { success: true }
    } catch (err: any) {
      const msg = err.message || 'Failed to register account'
      setError(msg)
      return { success: false, error: msg }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  const refreshProfile = async () => {
    if (user?.id) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user)
        setUser({
          id: session.user.id,
          email: session.user.email,
          profile,
        })
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
