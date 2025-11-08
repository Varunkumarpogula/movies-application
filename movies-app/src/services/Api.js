const TMDB_API_KEY = "5567d55ef3a379c315246861a201b42c";
const BASE_URL = "https://api.themoviedb.org/3";




async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json();
}

export async function searchMovies(query) {
  const data = await fetchJson(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  return data.results || [];
}

export async function getPopularMovies() {
  const data = await fetchJson(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
  return data.results || [];
}

export async function getNowPlayingMovies() {
  const data = await fetchJson(`${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`);
  return data.results || [];
}

export async function getMoviesByGenre(genreId) {
  const data = await fetchJson(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  return data.results || [];
}

export async function getMoviesByLanguage(languageCode) {
  const data = await fetchJson(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${languageCode}&sort_by=popularity.desc`
  );
  return data.results || [];
}

export async function getGenres() {
  const data = await fetchJson(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
  return data.genres || [];
}

export async function getLanguages() {
  return fetchJson(`${BASE_URL}/configuration/languages?api_key=${TMDB_API_KEY}`);
}
