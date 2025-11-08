import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecentMovies from "./pages/RecentMovies";
import DataManager from "./utils/dataManager";
import "./css/App.css";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [favs, recent] = await Promise.all([
          DataManager.getFavorites(),
          DataManager.getRecentMovies(),
        ]);

        if (!mounted) return;

        setFavorites(Array.isArray(favs) ? favs : []);
        setRecentMovies(Array.isArray(recent) ? recent : []);
      } catch (err) {
        console.error("Error loading persisted data:", err);
        if (!mounted) return;
        setFavorites([]);
        setRecentMovies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Toggle favorite
  const handleToggleFavorite = async (movie) => {
    try {
      const isFav = favorites.some((fav) => fav.id === movie.id);
      const newFavorites = isFav
        ? favorites.filter((fav) => fav.id !== movie.id)
        : [...favorites, movie];

      setFavorites(newFavorites);
      await DataManager.saveFavorites(newFavorites);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Add to recent movies
  const handleAddToRecent = async (movie) => {
    try {
      let newRecent = recentMovies.filter((m) => m.id !== movie.id);
      newRecent.unshift(movie);

      const MAX_RECENT = 50;
      if (newRecent.length > MAX_RECENT) newRecent = newRecent.slice(0, MAX_RECENT);

      setRecentMovies(newRecent);
      await DataManager.saveRecentMovies(newRecent);
    } catch (err) {
      console.error("Failed to add to recent:", err);
    }
  };

  // Clear recent movies (parent-controlled)
  const handleClearRecent = async () => {
    try {
      setRecentMovies([]);
      await DataManager.saveRecentMovies([]);
      return true;
    } catch (err) {
      console.error("Failed to clear recent in App:", err);
      return false;
    }
  };

  const isFavorite = (movieId) => favorites.some((fav) => fav.id === movieId);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading MovieHub...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={null}
              favorites={favorites}
              recentMovies={recentMovies}
              onToggleFavorite={handleToggleFavorite}
              onAddToRecent={handleAddToRecent}
              isFavorite={isFavorite}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              user={null}
              favorites={favorites}
              recentMovies={recentMovies}
              onToggleFavorite={handleToggleFavorite}
              onAddToRecent={handleAddToRecent}
            />
          }
        />

        <Route
          path="/recent"
          element={
            <RecentMovies
              recentMovies={recentMovies}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onAddToRecent={handleAddToRecent}
              onClearRecent={handleClearRecent} // ← important: parent clears and persists
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;