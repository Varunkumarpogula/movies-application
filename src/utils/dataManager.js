// src/utils/dataManager.js
import * as api from "../services/Api";
import { auth } from "../firebase";

// Generate user-specific localStorage keys
function getUserKey(baseKey) {
  const user = auth.currentUser;
  const uid = user ? user.uid : "anonymous";
  return `${baseKey}_${uid}`;
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch (e) { return []; }
}

async function tryServer(fn) {
  try {
    const res = await fn();
    return { ok: true, data: res };
  } catch (err) {
    console.warn("Server call failed:", err && err.message ? err.message : err);
    return { ok: false, error: err };
  }
}

const DataManager = {
  // Favorites - user-specific
  getFavoritesLocal() {
    const key = getUserKey("moviehub_favorites_v1");
    const raw = localStorage.getItem(key);
    return raw ? safeParse(raw) : [];
  },
  saveFavoritesLocal(favs) {
    const key = getUserKey("moviehub_favorites_v1");
    try { localStorage.setItem(key, JSON.stringify(favs)); } catch (e) { console.warn(e); }
  },

  // Recent Movies - user-specific
  getRecentLocal() {
    const key = getUserKey("moviehub_recent_v1");
    const raw = localStorage.getItem(key);
    return raw ? safeParse(raw) : [];
  },
  saveRecentLocal(recent) {
    const key = getUserKey("moviehub_recent_v1");
    try { localStorage.setItem(key, JSON.stringify(recent)); } catch (e) { console.warn(e); }
  },

  // Search History - user-specific
  getSearchHistoryLocal() {
    const key = getUserKey("moviehub_search_v1");
    const raw = localStorage.getItem(key);
    return raw ? safeParse(raw) : [];
  },
  saveSearchHistoryLocal(searches) {
    const key = getUserKey("moviehub_search_v1");
    try { localStorage.setItem(key, JSON.stringify(searches)); } catch (e) { console.warn(e); }
  },

  // Server sync methods
  async getFavorites() {
    const srv = await tryServer(() => api.fetchFavoritesFromServer());
    if (srv.ok) {
      const arr = Array.isArray(srv.data.favorites) ? srv.data.favorites : [];
      this.saveFavoritesLocal(arr);
      console.log("DataManager: loaded favorites from server, count=", arr.length);
      return arr;
    }
    const local = this.getFavoritesLocal();
    console.log("DataManager: fallback to local favorites, count=", local.length);
    return local;
  },

  async saveFavorites(favorites) {
    if (!Array.isArray(favorites)) return;
    const srv = await tryServer(() => api.saveFavoritesToServer(favorites));
    if (srv.ok) {
      this.saveFavoritesLocal(favorites);
      console.log("DataManager: saved favorites to server+local");
      return;
    }
    this.saveFavoritesLocal(favorites);
    console.log("DataManager: saved favorites to local (server unavailable)");
  },

  async getRecentMovies() {
    const srv = await tryServer(() => api.fetchRecentFromServer());
    if (srv.ok) {
      const arr = Array.isArray(srv.data.recent) ? srv.data.recent : [];
      this.saveRecentLocal(arr);
      console.log("DataManager: loaded recent from server, count=", arr.length);
      return arr;
    }
    const local = this.getRecentLocal();
    console.log("DataManager: fallback to local recent, count=", local.length);
    return local;
  },

  async saveRecentMovies(recent) {
    if (!Array.isArray(recent)) return;
    const srv = await tryServer(() => api.saveRecentToServer(recent));
    if (srv.ok) {
      this.saveRecentLocal(recent);
      console.log("DataManager: saved recent to server+local");
      return;
    }
    this.saveRecentLocal(recent);
    console.log("DataManager: saved recent to local (server unavailable)");
  },

  async getSearchHistory() {
    const srv = await tryServer(() => api.fetchSearchHistoryFromServer());
    if (srv.ok) {
      const arr = Array.isArray(srv.data.searches) ? srv.data.searches : [];
      this.saveSearchHistoryLocal(arr);
      console.log("DataManager: loaded search history from server, count=", arr.length);
      return arr;
    }
    const local = this.getSearchHistoryLocal();
    console.log("DataManager: fallback to local search history, count=", local.length);
    return local;
  },

  async saveSearchHistory(searches) {
    if (!Array.isArray(searches)) return;
    const srv = await tryServer(() => api.saveSearchHistoryToServer(searches));
    if (srv.ok) {
      this.saveSearchHistoryLocal(searches);
      console.log("DataManager: saved search history to server+local");
      return;
    }
    this.saveSearchHistoryLocal(searches);
    console.log("DataManager: saved search history to local (server unavailable)");
  },

  // Add search to history (with deduplication and limit)
  async addSearchToHistory(searchQuery) {
    if (!searchQuery || !searchQuery.trim()) return;
    
    let history = await this.getSearchHistory();
    
    // Remove if already exists
    history = history.filter(item => item.query.toLowerCase() !== searchQuery.toLowerCase());
    
    // Add to beginning
    history.unshift({
      query: searchQuery,
      timestamp: Date.now()
    });
    
    // Keep only last 20 searches
    history = history.slice(0, 20);
    
    await this.saveSearchHistory(history);
  },

  // Clear all user-specific data
  clearAllUserData() {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      localStorage.removeItem(`moviehub_favorites_v1_${uid}`);
      localStorage.removeItem(`moviehub_recent_v1_${uid}`);
      localStorage.removeItem(`moviehub_search_v1_${uid}`);
      console.log("Cleared localStorage for user:", uid);
    }
  },

  // Local-only helpers
  getFavoritesLocalOnly() { return this.getFavoritesLocal(); },
  getRecentLocalOnly() { return this.getRecentLocal(); },
  clearFavoritesLocal() { 
    const key = getUserKey("moviehub_favorites_v1");
    localStorage.removeItem(key); 
  },
  clearRecentLocal() { 
    const key = getUserKey("moviehub_recent_v1");
    localStorage.removeItem(key); 
  },
  clearSearchHistoryLocal() {
    const key = getUserKey("moviehub_search_v1");
    localStorage.removeItem(key);
  }
};

export default DataManager;
