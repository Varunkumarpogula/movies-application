// src/pages/RecentMovies.jsx
import { useState } from "react"
import MovieCard from "../components/MovieCard"
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/RecentMovies.css"

function RecentMovies({ recentMovies, onToggleFavorite, onAddToRecent, isFavorite, onClearRecent, favorites }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleMovieClick = (movie) => {
    onAddToRecent(movie)
  }

  const handleClearRecent = () => {
    if (recentMovies.length === 0) return
    
    if (!showClearConfirm) {
      setShowClearConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000)
      return
    }
    
    onClearRecent()
    setShowClearConfirm(false)
  }

  const handleAddToRecent = (movie) => {
    // This ensures the movie is added to recent when clicked from this page
    onAddToRecent(movie)
  }

  // Get unique recent movies (remove duplicates)
  const uniqueRecentMovies = recentMovies.reduce((acc, movie) => {
    if (!acc.find(m => m.id === movie.id)) {
      acc.push(movie)
    }
    return acc
  }, [])

  // Common header component to avoid duplication
  const Header = () => (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title" onClick={() => navigate('/')}>
          MovieHub
        </h1>
        
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigate('/')}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-tab ${location.pathname === "/favorites" ? "active" : ""}`}
            onClick={() => navigate('/favorites')}
          >
            ❤️ Favorites ({favorites?.length || 0})
          </button>
          <button 
            className={`nav-tab ${location.pathname === "/recent" ? "active" : ""}`}
            onClick={() => navigate('/recent')}
          >
            ⏰ Recent ({recentMovies.length})
          </button>
        </nav>
      </div>
    </header>
  )

  if (uniqueRecentMovies.length === 0) {
    return (
      <div className="recent-movies-page">
        <div className="fixed-banner"></div>
        <Header />
        
        <div className="recent-movies-container">
          <h2 className="section-title">Recently Viewed</h2>
          <div className="empty-recent">
            <div className="empty-icon">⏰</div>
            <h3>No Recent Movies</h3>
            <p>Movies you click on will appear here for quick access!</p>
            <div className="empty-actions">
              <button 
                className="browse-movies-button"
                onClick={() => navigate('/')}
              >
                🎬 Browse Movies
              </button>
              <button 
                className="view-favorites-button"
                onClick={() => navigate('/favorites')}
              >
                ❤️ View Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="recent-movies-page">
      <div className="fixed-banner"></div>
      <Header />
      
      <div className="recent-movies-container">
        <div className="recent-header">
          <div className="recent-title-section">
            <h2 className="section-title">Recently Viewed</h2>
            <p className="recent-subtitle">Your last {uniqueRecentMovies.length} viewed movies</p>
          </div>
          
          <div className="recent-actions">
            <button 
              className={`clear-recent-button ${showClearConfirm ? 'confirm' : ''}`}
              onClick={handleClearRecent}
              disabled={uniqueRecentMovies.length === 0}
            >
              {showClearConfirm ? '⚠️ Click again to clear' : '🗑️ Clear All'}
            </button>
            
            {showClearConfirm && (
              <button 
                className="cancel-clear-button"
                onClick={() => setShowClearConfirm(false)}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>

        {/* Recent movies stats */}
        <div className="recent-stats">
          <div className="stat-item">
            <span className="stat-number">{uniqueRecentMovies.length}</span>
            <span className="stat-label">Movies</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {uniqueRecentMovies.filter(movie => isFavorite(movie.id)).length}
            </span>
            <span className="stat-label">Favorited</span>
          </div>
        </div>

        <div className="movies-grid">
          {uniqueRecentMovies.map((movie, index) => (
            <MovieCard 
              key={`${movie.id}-${index}`}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => onToggleFavorite(movie)}
              onMovieClick={() => handleAddToRecent(movie)}
              index={index}
            />
          ))}
        </div>

        {/* Load more section if needed */}
        {uniqueRecentMovies.length >= 10 && (
          <div className="recent-footer">
            <p>Showing your most recent {uniqueRecentMovies.length} movies</p>
            <button 
              className="browse-more-button"
              onClick={() => navigate('/')}
            >
              Discover More Movies
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentMovies