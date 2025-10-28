// src/services/Api.js
export const BACKEND = "http://localhost:4000";

async function getJSON(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${txt}`);
  }
  return res.json();
}

/* session endpoints */
export async function createSessionOnServer(idToken) {
  const res = await fetch(`${BACKEND}/sessionLogin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return getJSON(res);
}

export async function logoutOnServer() {
  const res = await fetch(`${BACKEND}/sessionLogout`, {
    method: "POST",
    credentials: "include",
  });
  return getJSON(res);
}

/* per-user data endpoints */
export async function fetchFavoritesFromServer() {
  const res = await fetch(`${BACKEND}/api/favorites`, {
    method: "GET",
    credentials: "include",
  });
  return getJSON(res);
}

export async function saveFavoritesToServer(favorites) {
  const res = await fetch(`${BACKEND}/api/favorites`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorites }),
  });
  return getJSON(res);
}

export async function fetchRecentFromServer() {
  const res = await fetch(`${BACKEND}/api/recent`, {
    method: "GET",
    credentials: "include",
  });
  return getJSON(res);
}

export async function saveRecentToServer(recent) {
  const res = await fetch(`${BACKEND}/api/recent`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recent }),
  });
  return getJSON(res);
}

/* TMDB helpers (unchanged if you already have them) */
const TMDB_API_KEY = "5567d55ef3a379c315246861a201b42c";
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function getPopularMovies() {
  const r = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
  return (await getJSON(r)).results || [];
}
export async function getNowPlayingMovies() {
  const r = await fetch(`${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
  return (await getJSON(r)).results || [];
}
export async function searchMovies(q) {
  const r = await fetch(`${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`);
  return (await getJSON(r)).results || [];
}
export async function getMoviesByGenre(id) {
  const r = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}&language=en-US&page=1`);
  return (await getJSON(r)).results || [];
}
export async function getGenres() {
  const r = await fetch(`${TMDB_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
  return (await getJSON(r)).genres || [];
}
export async function getLanguages() {
  const r = await fetch(`${TMDB_BASE}/configuration/languages?api_key=${TMDB_API_KEY}`);
  return await getJSON(r);
}
export async function getMoviesByLanguage(lang) {
  const r = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${lang}&language=en-US&page=1`);
  return (await getJSON(r)).results || [];
}
