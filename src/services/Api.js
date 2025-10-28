// src/services/Api.js
const TMDB_API_KEY = "5567d55ef3a379c315246861a201b42c";
const BASE_URL = "https://api.themoviedb.org/3";
const BACKEND_URL = "http://localhost:4000"; // Your backend server

// TMDB API calls
export async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results || [];
}

export async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.results || [];
}

export async function getNowPlayingMovies() {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.results || [];
}

export async function getMoviesByGenre(genreId) {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  const data = await response.json();
  return data.results || [];
}

export async function getMoviesByLanguage(languageCode) {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${languageCode}&sort_by=popularity.desc`
  );
  const data = await response.json();
  return data.results || [];
}

export async function getGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.genres || [];
}

export async function getLanguages() {
  const response = await fetch(`${BASE_URL}/configuration/languages?api_key=${TMDB_API_KEY}`);
  return await response.json();
}

// Backend Auth & Data calls
export async function createSessionOnServer(idToken) {
  const response = await fetch(`${BACKEND_URL}/sessionLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) throw new Error("Session creation failed");
  return response.json();
}

export async function logoutOnServer() {
  const response = await fetch(`${BACKEND_URL}/sessionLogout`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
}

// Favorites
export async function fetchFavoritesFromServer() {
  const response = await fetch(`${BACKEND_URL}/api/favorites`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch favorites");
  return response.json();
}

export async function saveFavoritesToServer(favorites) {
  const response = await fetch(`${BACKEND_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ favorites }),
  });
  if (!response.ok) throw new Error("Failed to save favorites");
  return response.json();
}

// Recent Movies
export async function fetchRecentFromServer() {
  const response = await fetch(`${BACKEND_URL}/api/recent`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch recent");
  return response.json();
}

export async function saveRecentToServer(recent) {
  const response = await fetch(`${BACKEND_URL}/api/recent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recent }),
  });
  if (!response.ok) throw new Error("Failed to save recent");
  return response.json();
}

// Search History
export async function fetchSearchHistoryFromServer() {
  const response = await fetch(`${BACKEND_URL}/api/searches`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch search history");
  return response.json();
}

export async function saveSearchHistoryToServer(searches) {
  const response = await fetch(`${BACKEND_URL}/api/searches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ searches }),
  });
  if (!response.ok) throw new Error("Failed to save search history");
  return response.json();
}



// src/services/Api.js (append or modify)
export async function destroySessionOnServer() {
  // Best-effort: call backend logout endpoint which should clear session cookie
  const resp = await fetch("/api/logout", {
    method: "POST",
    credentials: "include", // important if you're using cookies for session
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`Failed to logout from server: ${resp.status} ${resp.statusText} ${text}`);
    err.status = resp.status;
    throw err;
  }

  return await resp.json().catch(() => ({}));
}
