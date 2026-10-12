export interface Movie {
  id: number
  title: string
  original_title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity?: number
  genre_ids?: number[]
  adult?: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number | null
  tagline: string | null
  status: string
  budget?: number
  revenue?: number
  homepage?: string | null
  imdb_id?: string | null
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface VideoResult {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string // e.g. "YouTube"
  size: number
  type: string // e.g. "Trailer", "Teaser", "Featurette"
  official: boolean
  published_at: string
}

export interface MovieVideosResponse {
  id: number
  results: VideoResult[]
}

export interface TMDBListResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface MovieFilterParams {
  query?: string
  genreId?: number | string
  year?: number | string
  minRating?: number | string
  sortBy?: string
  page?: number
}
