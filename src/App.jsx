// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecentMovies from "./pages/RecentMovies";
import Login from "./pages/Login";
import DataManager from "./utils/dataManager";
import "./css/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? currentUser.email : "No user");
      setUser(currentUser);

      if (currentUser) {
        // Load user data from server/localStorage
        console.log("Loading user data for:", currentUser.uid);
        try {
          const [favs, recent, searches] = await Promise.all([
            DataManager.getFavorites(),
            DataManager.getRecentMovies(),
            DataManager.getSearchHistory(),
          ]);
          setFavorites(favs);
          setRecentMovies(recent);
          setSearchHistory(searches);
          console.log("User data loaded:", { favs: favs.length, recent: recent.length, searches: searches.length });
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      } else {
        // Clear state when logged out
        setFavorites([]);
        setRecentMovies([]);
        setSearchHistory([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Toggle favorite
  const handleToggleFavorite = async (movie) => {
    const isFav = favorites.some((fav) => fav.id === movie.id);
    let newFavorites;

    if (isFav) {
      newFavorites = favorites.filter((fav) => fav.id !== movie.id);
      console.log("Removed from favorites:", movie.title);
    } else {
      newFavorites = [...favorites, movie];
      console.log("Added to favorites:", movie.title);
    }

    setFavorites(newFavorites);
    await DataManager.saveFavorites(newFavorites);
  };

  // Add to recent movies
  const handleAddToRecent = async (movie) => {
    let newRecent = recentMovies.filter((m) => m.id !== movie.id);
    newRecent.unshift(movie);
    newRecent = newRecent.slice(0, 20); // Keep only last 20

    setRecentMovies(newRecent);
    await DataManager.saveRecentMovies(newRecent);
    console.log("Added to recent:", movie.title);
  };

  // Add search to history
  const handleAddSearch = async (query) => {
    if (!query || !query.trim()) return;
    await DataManager.addSearchToHistory(query);
    
    // Reload search history
    const searches = await DataManager.getSearchHistory();
    setSearchHistory(searches);
  };

  // Check if movie is favorite
  const isFavorite = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading MovieHub...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            user ? (
              <Home
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onAddToRecent={handleAddToRecent}
                onAddSearch={handleAddSearch}
                isFavorite={isFavorite}
                recentMovies={recentMovies}
                searchHistory={searchHistory}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/favorites"
          element={
            user ? (
              <Favorites
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onAddToRecent={handleAddToRecent}
                isFavorite={isFavorite}
                recentMovies={recentMovies}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/recent"
          element={
            user ? (
              <RecentMovies
                recentMovies={recentMovies}
                onToggleFavorite={handleToggleFavorite}
                onAddToRecent={handleAddToRecent}
                isFavorite={isFavorite}
                favorites={favorites}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;