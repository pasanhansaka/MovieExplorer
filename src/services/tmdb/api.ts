import axios from 'axios'
import type {
  Movie,
  MovieDetails,
  MovieCredits,
  MovieVideosResponse,
  TMDBListResponse,
  Genre,
  MovieFilterParams,
} from '../../types/movie.ts'

const TMDB_PROXY_URL =
  import.meta.env.VITE_TMDB_PROXY_URL || 'https://placeholder.supabase.co/functions/v1/tmdb'

export const tmdbClient = axios.create({
  baseURL: TMDB_PROXY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fetch trending movies of the week or day.
 */
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page = 1
): Promise<TMDBListResponse<Movie>> {
  const response = await tmdbClient.get<TMDBListResponse<Movie>>('', {
    params: {
      endpoint: 'trending',
      timeWindow,
      page,
    },
  })
  return response.data
}

/**
 * Search movies by text query with pagination.
 */
export async function searchMovies(
  query: string,
  page = 1
): Promise<TMDBListResponse<Movie>> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }

  const response = await tmdbClient.get<TMDBListResponse<Movie>>('', {
    params: {
      endpoint: 'search',
      query: trimmed,
      page,
    },
  })
  return response.data
}

/**
 * Get detailed information for a single movie.
 */
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await tmdbClient.get<MovieDetails>('', {
    params: {
      endpoint: 'details',
      movieId,
    },
  })
  return response.data
}

/**
 * Get credits (cast & crew) for a movie.
 */
export async function getMovieCredits(movieId: number): Promise<MovieCredits> {
  const response = await tmdbClient.get<MovieCredits>('', {
    params: {
      endpoint: 'credits',
      movieId,
    },
  })
  return response.data
}

/**
 * Get trailer and teaser videos for a movie.
 */
export async function getMovieVideos(movieId: number): Promise<MovieVideosResponse> {
  const response = await tmdbClient.get<MovieVideosResponse>('', {
    params: {
      endpoint: 'videos',
      movieId,
    },
  })
  return response.data
}

/**
 * Get the full list of movie genres.
 */
export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  const response = await tmdbClient.get<{ genres: Genre[] }>('', {
    params: {
      endpoint: 'genres',
    },
  })
  return response.data
}

/**
 * Discover movies with combined filters (genre, release year, minimum rating, sorting).
 */
export async function discoverMovies(
  filters: MovieFilterParams
): Promise<TMDBListResponse<Movie>> {
  const params: Record<string, any> = {
    endpoint: 'discover',
    page: filters.page || 1,
  }

  if (filters.genreId) {
    params.genreId = filters.genreId
  }
  if (filters.year) {
    params.year = filters.year
  }
  if (filters.minRating) {
    params.minRating = filters.minRating
  }
  if (filters.sortBy) {
    params.sortBy = filters.sortBy
  }

  const response = await tmdbClient.get<TMDBListResponse<Movie>>('', {
    params,
  })
  return response.data
}
