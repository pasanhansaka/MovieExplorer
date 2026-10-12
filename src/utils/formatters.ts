/**
 * Format date string (YYYY-MM-DD) into a 4-digit release year.
 */
export function formatReleaseYear(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return 'N/A'
  const year = dateStr.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : 'N/A'
}

/**
 * Format rating (e.g. 7.423) into 1 decimal place (e.g. "7.4").
 */
export function formatRating(rating?: number | null): string {
  if (rating === null || rating === undefined || Number.isNaN(rating)) return 'NR'
  return rating.toFixed(1)
}

/**
 * Format runtime minutes into "Xh Ym" string.
 */
export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Format date into localized human-readable string (e.g. "Nov 12, 2024").
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Unknown'
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TMDBImageSize = 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original'

/**
 * Build TMDb image URL with fallbacks.
 */
export function getTMDBImageUrl(
  path?: string | null,
  size: TMDBImageSize = 'w500'
): string | null {
  if (!path || typeof path !== 'string') return null
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${TMDB_IMAGE_BASE_URL}/${size}${cleanPath}`
}
