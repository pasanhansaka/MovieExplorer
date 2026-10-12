import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../../services/supabase/client.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { AuthPromptDialog } from '../../components/auth/AuthPromptDialog.tsx'
import type { FavoriteMovie } from '../../types/favorite.ts'
import type { Movie, MovieDetails } from '../../types/movie.ts'

const GUEST_FAVORITES_STORAGE_KEY = 'movie-explorer:guest-favorites'

interface FavoritesContextType {
  favorites: FavoriteMovie[]
  loading: boolean
  isFavorite: (tmdbMovieId: number) => boolean
  toggleFavorite: (movie: Movie | MovieDetails | FavoriteMovie) => Promise<boolean>
  removeFavorite: (tmdbMovieId: number) => Promise<boolean>
  refreshFavorites: () => Promise<void>
  promptLogin: (movieTitle?: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

function getGuestFavorites(): FavoriteMovie[] {
  try {
    const raw = localStorage.getItem(GUEST_FAVORITES_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FavoriteMovie[]
  } catch {
    return []
  }
}

function saveGuestFavorites(favs: FavoriteMovie[]): void {
  try {
    localStorage.setItem(GUEST_FAVORITES_STORAGE_KEY, JSON.stringify(favs))
  } catch {
    // LocalStorage quota or unavailable
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [authPromptOpen, setAuthPromptOpen] = useState<boolean>(false)
  const [promptMovieTitle, setPromptMovieTitle] = useState<string | undefined>()

  const promptLogin = useCallback((movieTitle?: string) => {
    setPromptMovieTitle(movieTitle)
    setAuthPromptOpen(true)
  }, [])

  // Fetch favorites from Supabase for authenticated user
  const fetchSupabaseFavorites = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      setFavorites(getGuestFavorites())
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Error fetching favorites:', error.message)
        setFavorites([])
      } else {
        setFavorites((data as FavoriteMovie[]) || [])
      }
    } catch {
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Synchronize guest favorites to Supabase upon login
  const mergeGuestFavorites = useCallback(async (userId: string) => {
    const guestFavs = getGuestFavorites()
    if (guestFavs.length === 0 || !isSupabaseConfigured) return

    try {
      const recordsToInsert = guestFavs.map((fav) => ({
        user_id: userId,
        tmdb_movie_id: fav.tmdb_movie_id,
        title: fav.title,
        poster_path: fav.poster_path,
        release_date: fav.release_date,
        vote_average: fav.vote_average,
      }))

      // Upsert into Supabase to prevent duplicate key errors
      await supabase
        .from('favorites')
        .upsert(recordsToInsert, { onConflict: 'user_id, tmdb_movie_id' })

      // Clear guest local storage once safely merged
      localStorage.removeItem(GUEST_FAVORITES_STORAGE_KEY)
    } catch (err) {
      console.warn('Notice: guest favorites sync encountered:', err)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    if (user?.id) {
      // User is logged in: merge any local guest favorites, then fetch database favorites
      mergeGuestFavorites(user.id).then(() => {
        fetchSupabaseFavorites(user.id)
      })
    } else {
      // Guest mode
      setFavorites(getGuestFavorites())
      setLoading(false)
    }
  }, [user?.id, fetchSupabaseFavorites, mergeGuestFavorites])

  const isFavorite = useCallback(
    (tmdbMovieId: number): boolean => {
      return favorites.some((fav) => fav.tmdb_movie_id === tmdbMovieId)
    },
    [favorites]
  )

  const toggleFavorite = async (
    movie: Movie | MovieDetails | FavoriteMovie
  ): Promise<boolean> => {
    const tmdbId = 'tmdb_movie_id' in movie ? movie.tmdb_movie_id : movie.id
    const currentlyFav = isFavorite(tmdbId)

    if (currentlyFav) {
      return await removeFavorite(tmdbId)
    }

    // Require authentication to bookmark / add to favorites
    if (!user?.id) {
      promptLogin(movie.title)
      return false
    }

    const newFav: FavoriteMovie = {
      tmdb_movie_id: tmdbId,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date || null,
      vote_average: movie.vote_average ?? null,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      // Optimistic update
      setFavorites((prev) => [newFav, ...prev])
      try {
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          tmdb_movie_id: newFav.tmdb_movie_id,
          title: newFav.title,
          poster_path: newFav.poster_path,
          release_date: newFav.release_date,
          vote_average: newFav.vote_average,
        })

        if (error) {
          // Revert on failure
          setFavorites((prev) => prev.filter((f) => f.tmdb_movie_id !== tmdbId))
          console.error('Failed to save favorite:', error.message)
          return false
        }
        return true
      } catch {
        setFavorites((prev) => prev.filter((f) => f.tmdb_movie_id !== tmdbId))
        return false
      }
    } else {
      // Local fallback if Supabase not configured but authenticated in mock/local mode
      const updated = [newFav, ...favorites.filter((f) => f.tmdb_movie_id !== tmdbId)]
      setFavorites(updated)
      saveGuestFavorites(updated)
      return true
    }
  }

  const removeFavorite = async (tmdbMovieId: number): Promise<boolean> => {
    const previous = [...favorites]
    setFavorites((prev) => prev.filter((f) => f.tmdb_movie_id !== tmdbMovieId))

    if (user?.id && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tmdb_movie_id', tmdbMovieId)

        if (error) {
          setFavorites(previous)
          console.error('Failed to remove favorite:', error.message)
          return false
        }
        return true
      } catch {
        setFavorites(previous)
        return false
      }
    } else {
      const updated = previous.filter((f) => f.tmdb_movie_id !== tmdbMovieId)
      saveGuestFavorites(updated)
      return true
    }
  }

  const refreshFavorites = async () => {
    if (user?.id) {
      await fetchSupabaseFavorites(user.id)
    } else {
      setFavorites(getGuestFavorites())
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        refreshFavorites,
        promptLogin,
      }}
    >
      {children}
      <AuthPromptDialog
        open={authPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        movieTitle={promptMovieTitle}
      />
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
