/**
 * Trim whitespace and sanitize search query.
 */
export function sanitizeSearchQuery(query?: string | null): string {
  if (!query || typeof query !== 'string') return ''
  return query.trim()
}

/**
 * Validates whether a value is a valid positive integer movie ID.
 */
export function isValidMovieId(id: unknown): boolean {
  if (typeof id === 'number') {
    return Number.isInteger(id) && id > 0
  }
  if (typeof id === 'string') {
    const trimmed = id.trim()
    return /^\d+$/.test(trimmed) && parseInt(trimmed, 10) > 0
  }
  return false
}

/**
 * Validates YouTube video key (typically 11 alphanumeric characters and _-).
 */
export function isValidYouTubeKey(key?: string | null): boolean {
  if (!key || typeof key !== 'string') return false
  return /^[a-zA-Z0-9_-]{11}$/.test(key.trim())
}
