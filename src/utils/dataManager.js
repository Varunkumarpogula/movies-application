// src/utils/dataManager.js
import * as api from "../services/Api";

const FAVORITES_KEY = "moviehub_favorites_v1";
const RECENT_KEY = "moviehub_recent_v1";

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
  getFavoritesLocal() {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? safeParse(raw) : [];
  },
  saveFavoritesLocal(favs) {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); } catch (e) { console.warn(e); }
  },

  getRecentLocal() {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? safeParse(raw) : [];
  },
  saveRecentLocal(recent) {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch (e) { console.warn(e); }
  },

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

  // local-only helpers
  getFavoritesLocalOnly() { return this.getFavoritesLocal(); },
  getRecentLocalOnly() { return this.getRecentLocal(); },
  clearFavoritesLocal() { localStorage.removeItem(FAVORITES_KEY); },
  clearRecentLocal() { localStorage.removeItem(RECENT_KEY); }
};

export default DataManager;
