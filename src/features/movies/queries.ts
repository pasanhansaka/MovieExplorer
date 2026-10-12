import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getTrendingMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieGenres,
  searchMovies,
  discoverMovies,
} from '../../services/tmdb/api.ts'
import type { MovieFilterParams } from '../../types/movie.ts'

export const movieQueryKeys = {
  all: ['movies'] as const,
  trending: (window: 'day' | 'week') => [...movieQueryKeys.all, 'trending', window] as const,
  details: (id: number) => [...movieQueryKeys.all, 'details', id] as const,
  credits: (id: number) => [...movieQueryKeys.all, 'credits', id] as const,
  videos: (id: number) => [...movieQueryKeys.all, 'videos', id] as const,
  genres: () => [...movieQueryKeys.all, 'genres'] as const,
  search: (query: string) => [...movieQueryKeys.all, 'search', query] as const,
  discover: (filters: MovieFilterParams) => [...movieQueryKeys.all, 'discover', filters] as const,
}

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: movieQueryKeys.trending(timeWindow),
    queryFn: () => getTrendingMovies(timeWindow, 1),
    staleTime: 1000 * 60 * 15, // 15 mins
    retry: 2,
  })
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: movieQueryKeys.details(movieId),
    queryFn: () => getMovieDetails(movieId),
    enabled: movieId > 0 && !Number.isNaN(movieId),
    staleTime: 1000 * 60 * 30, // 30 mins
    retry: 1,
  })
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: movieQueryKeys.credits(movieId),
    queryFn: () => getMovieCredits(movieId),
    enabled: movieId > 0 && !Number.isNaN(movieId),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: movieQueryKeys.videos(movieId),
    queryFn: () => getMovieVideos(movieId),
    enabled: movieId > 0 && !Number.isNaN(movieId),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}

export function useMovieGenres() {
  return useQuery({
    queryKey: movieQueryKeys.genres(),
    queryFn: getMovieGenres,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: (data) => data.genres,
  })
}

export function useInfiniteMovieSearch(query: string) {
  const trimmed = query.trim()

  return useInfiniteQuery({
    queryKey: movieQueryKeys.search(trimmed),
    queryFn: ({ pageParam = 1 }) => searchMovies(trimmed, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1
      }
      return undefined
    },
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

export function useInfiniteMovieDiscover(filters: MovieFilterParams) {
  return useInfiniteQuery({
    queryKey: movieQueryKeys.discover(filters),
    queryFn: ({ pageParam = 1 }) => discoverMovies({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1
      }
      return undefined
    },
    staleTime: 1000 * 60 * 5,
  })
}
