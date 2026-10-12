export interface FavoriteMovie {
  id?: string | number
  user_id?: string
  tmdb_movie_id: number
  title: string
  poster_path: string | null
  release_date: string | null
  vote_average: number | null
  created_at?: string
}
