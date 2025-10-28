// src/App.jsx
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecentMovies from "./pages/RecentMovies";
import { useState, useEffect, useRef } from "react";
import DataManager from "./utils/dataManager";
import "./css/App.css";
import Login from "./pages/Login";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const initialLoadRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const savedFavorites = await DataManager.getFavorites();
        const savedRecent = await DataManager.getRecentMovies();
        if (!mounted) return;
        setFavorites(savedFavorites || []);
        setRecentMovies(savedRecent || []);
      } catch (e) {
        console.error("Error loading initial data:", e);
        setFavorites([]);
        setRecentMovies([]);
      } finally { initialLoadRef.current = true; }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!initialLoadRef.current) return;
    (async () => { await DataManager.saveFavorites(favorites); })();
  }, [favorites]);

  useEffect(() => {
    if (!initialLoadRef.current) return;
    (async () => { await DataManager.saveRecentMovies(recentMovies); })();
  }, [recentMovies]);

  const toggleFavorite = (movie) => {
    if (!movie || movie.id == null) return;
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === movie.id);
      if (isFav) return prev.filter(f => f.id !== movie.id);
      return [...prev, movie];
    });
  };

  const addToRecentMovies = (movie) => {
    if (!movie || movie.id == null) return;
    setRecentMovies(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 20);
    });
  };

  const clearRecentMovies = () => setRecentMovies([]);

  const isFavorite = (movieId) => favorites.some(m => m.id === movieId);

  useEffect(() => {
    // when auth state changes: if signed in, reload server data; if signed out, load local data and redirect
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const [srvFavs, srvRecent] = await Promise.all([DataManager.getFavorites(), DataManager.getRecentMovies()]);
          setFavorites(srvFavs || []);
          setRecentMovies(srvRecent || []);
        } catch (e) { console.warn("Failed to load server data on sign-in:", e); }
      } else {
        const localFavs = DataManager.getFavoritesLocalOnly();
        const localRecent = DataManager.getRecentLocalOnly();
        setFavorites(localFavs || []);
        setRecentMovies(localRecent || []);
        if (window.location.pathname !== "/login") navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home favorites={favorites} recentMovies={recentMovies} onToggleFavorite={toggleFavorite} onAddToRecent={addToRecentMovies} isFavorite={isFavorite} />} />
        <Route path="/favorites" element={<Favorites favorites={favorites} recentMovies={recentMovies} onToggleFavorite={toggleFavorite} onAddToRecent={addToRecentMovies} isFavorite={isFavorite} />} />
        <Route path="/recent" element={<RecentMovies recentMovies={recentMovies} onToggleFavorite={toggleFavorite} onAddToRecent={addToRecentMovies} isFavorite={isFavorite} onClearRecent={clearRecentMovies} />} />
      </Routes>
    </div>
  );
}

export default App;
