const KEY_FAV = "moviehub_favorites_v1";
const KEY_RECENT = "moviehub_recent_v1";
const KEY_SEARCHES = "moviehub_searches_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const DataManager = {
  
  async getFavorites() {
    try {
      const raw = localStorage.getItem(KEY_FAV);
      const parsed = safeParse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("getFavorites error", e);
      return [];
    }
  },

  async saveFavorites(favorites = []) {
    try {
      localStorage.setItem(KEY_FAV, JSON.stringify(Array.isArray(favorites) ? favorites : []));
      return true;
    } catch (e) {
      console.error("saveFavorites error", e);
      return false;
    }
  },

  // Recent movies (most-recent first)
  async getRecentMovies() {
    try {
      const raw = localStorage.getItem(KEY_RECENT);
      const parsed = safeParse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("getRecentMovies error", e);
      return [];
    }
  },

  async saveRecentMovies(recent = []) {
    try {
      localStorage.setItem(KEY_RECENT, JSON.stringify(Array.isArray(recent) ? recent : []));
      return true;
    } catch (e) {
      console.error("saveRecentMovies error", e);
      return false;
    }
  },

  // Search history
  async getSearchHistory() {
    try {
      const raw = localStorage.getItem(KEY_SEARCHES);
      const parsed = safeParse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("getSearchHistory error", e);
      return [];
    }
  },

  async saveSearchHistory(searches = []) {
    try {
      localStorage.setItem(KEY_SEARCHES, JSON.stringify(Array.isArray(searches) ? searches : []));
      return true;
    } catch (e) {
      console.error("saveSearchHistory error", e);
      return false;
    }
  },

  // Clear everything user-specific
  clearAllUserData() {
    try {
      localStorage.removeItem(KEY_FAV);
      localStorage.removeItem(KEY_RECENT);
      localStorage.removeItem(KEY_SEARCHES);
      return true;
    } catch (e) {
      console.error("clearAllUserData error", e);
      return false;
    }
  },
};

export default DataManager;
