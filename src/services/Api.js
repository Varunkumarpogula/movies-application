// 5567d55ef3a379c315246861a201b42c//
// src/services/api.js
// https:api.themoviedb.org/3/movie/popular?api_key=5567d55ef3a379c315246861a201b42c
// src/services/api.js
const API_KEY = '5567d55ef3a379c315246861a201b42c' // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3'

// Helper function for API calls
const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call failed:', error)
    return { results: [], genres: [] }
  }
}

// Get popular movies
export const getPopularMovies = async () => {
  const data = await fetchFromAPI('/movie/popular')
  return data.results || []
}

// Get now playing movies
export const getNowPlayingMovies = async () => {
  const data = await fetchFromAPI('/movie/now_playing')
  return data.results || []
}

// Search movies
export const searchMovies = async (query) => {
  const data = await fetchFromAPI(`/search/movie&query=${encodeURIComponent(query)}`)
  return data.results || []
}

// Get movies by genre
export const getMoviesByGenre = async (genreId) => {
  const data = await fetchFromAPI(`/discover/movie&with_genres=${genreId}`)
  return data.results || []
}

// Get all genres
export const getGenres = async () => {
  const data = await fetchFromAPI('/genre/movie/list')
  return data.genres || []
}

// Get all languages
export const getLanguages = async () => {
  const data = await fetchFromAPI('/configuration/languages')
  return data || []
}

// Get movie details
export const getMovieDetails = async (movieId) => {
  const data = await fetchFromAPI(`/movie/${movieId}`)
  return data
}