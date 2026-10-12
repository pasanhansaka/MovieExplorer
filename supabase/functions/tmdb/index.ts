// Supabase Edge Function: tmdb
// Secure proxy for The Movie Database (TMDb) API

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

const ALLOWED_SORT_OPTIONS = new Set([
  'popularity.desc',
  'popularity.asc',
  'vote_average.desc',
  'vote_average.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'vote_count.desc',
])

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const tmdbToken = Deno.env.get('TMDB_ACCESS_TOKEN')
    if (!tmdbToken) {
      return new Response(
        JSON.stringify({
          error:
            'TMDB_ACCESS_TOKEN secret is not configured in Supabase. Run: supabase secrets set TMDB_ACCESS_TOKEN="..."',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing required "endpoint" query parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let tmdbPath = ''
    const tmdbParams = new URLSearchParams()
    tmdbParams.set('language', 'en-US')

    // 2. Validate and map operations
    switch (endpoint) {
      case 'trending': {
        const timeWindow = url.searchParams.get('timeWindow') === 'day' ? 'day' : 'week'
        tmdbPath = `/trending/movie/${timeWindow}`
        const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1), 500)
        tmdbParams.set('page', page.toString())
        break
      }

      case 'search': {
        const query = url.searchParams.get('query')?.trim()
        if (!query || query.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Search query parameter "query" is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        if (query.length > 100) {
          return new Response(
            JSON.stringify({ error: 'Search query exceeds maximum length of 100 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1), 500)
        tmdbPath = '/search/movie'
        tmdbParams.set('query', query)
        tmdbParams.set('page', page.toString())
        tmdbParams.set('include_adult', 'false')
        break
      }

      case 'details': {
        const movieId = parseInt(url.searchParams.get('movieId') || '', 10)
        if (!movieId || movieId <= 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing movieId parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        tmdbPath = `/movie/${movieId}`
        break
      }

      case 'credits': {
        const movieId = parseInt(url.searchParams.get('movieId') || '', 10)
        if (!movieId || movieId <= 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing movieId parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        tmdbPath = `/movie/${movieId}/credits`
        break
      }

      case 'videos': {
        const movieId = parseInt(url.searchParams.get('movieId') || '', 10)
        if (!movieId || movieId <= 0) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing movieId parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        tmdbPath = `/movie/${movieId}/videos`
        break
      }

      case 'genres': {
        tmdbPath = '/genre/movie/list'
        break
      }

      case 'discover': {
        tmdbPath = '/discover/movie'
        const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1), 500)
        tmdbParams.set('page', page.toString())
        tmdbParams.set('include_adult', 'false')

        const genreId = url.searchParams.get('genreId')
        if (genreId && /^\d+$/.test(genreId)) {
          tmdbParams.set('with_genres', genreId)
        }

        const year = url.searchParams.get('year')
        if (year && /^\d{4}$/.test(year)) {
          tmdbParams.set('primary_release_year', year)
        }

        const minRating = url.searchParams.get('minRating')
        if (minRating) {
          const ratingNum = parseFloat(minRating)
          if (!isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 10) {
            tmdbParams.set('vote_average.gte', ratingNum.toString())
            tmdbParams.set('vote_count.gte', '50') // Filter out obscure ratings
          }
        }

        const sortBy = url.searchParams.get('sortBy')
        if (sortBy && ALLOWED_SORT_OPTIONS.has(sortBy)) {
          tmdbParams.set('sort_by', sortBy)
        } else {
          tmdbParams.set('sort_by', 'popularity.desc')
        }
        break
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported endpoint "${endpoint}"` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // 3. Make authenticated request to upstream TMDb
    const targetUrl = `${TMDB_BASE_URL}${tmdbPath}?${tmdbParams.toString()}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 9000)

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tmdbToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: data.status_message || `TMDb API responded with status ${response.status}`,
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=600',
        },
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'TMDb API request timed out' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ error: 'Failed to contact TMDb upstream service' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Internal proxy server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
