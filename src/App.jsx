import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecentMovies from './pages/RecentMovies';
import { SignInPage, SignUpPage } from './components/Auth';
import { Navigation } from './components/Navigation';
import { useState, useEffect } from 'react';
import DataManager from './utils/dataManager';
import './css/App.css';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);

  useEffect(() => {
    const savedFavorites = DataManager.getFavorites();
    const savedRecent = DataManager.getRecentMovies();
    
    if (savedFavorites) setFavorites(savedFavorites);
    if (savedRecent) setRecentMovies(savedRecent);
  }, []);

  useEffect(() => {
    DataManager.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    DataManager.saveRecentMovies(recentMovies);
  }, [recentMovies]);

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === movie.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const addToRecentMovies = (movie) => {
    setRecentMovies(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 20);
    });
  };

  const clearRecentMovies = () => {
    setRecentMovies([]);
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const ProtectedRoute = ({ children }) => {
    return (
      <>
        <SignedIn>
          <Navigation />
          {children}
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home 
                favorites={favorites}
                recentMovies={recentMovies}
                onToggleFavorite={toggleFavorite}
                onAddToRecent={addToRecentMovies}
                isFavorite={isFavorite}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <Favorites 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddToRecent={addToRecentMovies}
                isFavorite={isFavorite}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recent" 
          element={
            <ProtectedRoute>
              <RecentMovies 
                recentMovies={recentMovies}
                onToggleFavorite={toggleFavorite}
                onAddToRecent={addToRecentMovies}
                isFavorite={isFavorite}
                onClearRecent={clearRecentMovies}
              />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;