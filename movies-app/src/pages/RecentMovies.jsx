import { useState } from "react"
import MovieCard from "../components/MovieCard"
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/RecentMovies.css"

function RecentMovies({ recentMovies = [], favorites = [], onToggleFavorite, onAddToRecent, onClearRecent }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)


  const isFavorite = (id) => favorites.some(movie => movie.id === id)

  const handleMovieClick = (movie) => {
    onAddToRecent(movie)
  }


  const handleClearRecent = async () => {
    if (clearing) return
    if (!recentMovies || recentMovies.length === 0) return

    if (!showClearConfirm) {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
      return
    }

    setClearing(true)
    try {
      await onClearRecent()
    } catch (err) {
      console.error("Failed to clear recent movies:", err)
    }

    setClearing(false)
    setShowClearConfirm(false)
  }


  const uniqueRecentMovies = recentMovies.reduce((acc, movie) => {
    if (!acc.some(m => m.id === movie.id)) acc.push(movie)
    return acc
  }, [])


  const Header = () => (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title" onClick={() => navigate('/')}>MovieHub</h1>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>

          <button
            className={`nav-tab ${location.pathname === "/favorites" ? "active" : ""}`}
            onClick={() => navigate('/favorites')}
          >
            ❤️ Favorites ({favorites.length})
          </button>

          <button className="nav-tab active">
            Recent ({recentMovies.length})
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
            <p>Movies you click on will appear here.</p>

            <div className="empty-actions">
              <button className="browse-movies-button" onClick={() => navigate('/')}>
                🎬 Browse Movies
              </button>
              <button className="view-favorites-button" onClick={() => navigate('/favorites')}>
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
          <h2 className="section-title">Recently Viewed</h2>

          <div className="recent-actions">
            <button
              className={`clear-recent-button ${showClearConfirm ? "confirm" : ""}`}
              onClick={handleClearRecent}
              disabled={clearing}
            >
              {clearing ? "Clearing..." :
                showClearConfirm ? "⚠️ Click again to clear" : "🗑️ Clear All"}
            </button>

            {showClearConfirm && (
              <button className="cancel-clear-button" onClick={() => setShowClearConfirm(false)}>
                ✕ Cancel
              </button>
            )}
          </div>
        </div>

        {/* ✅ Stats */}
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

        {/* ✅ Movie Grid */}
        <div className="movies-grid">
          {uniqueRecentMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => onToggleFavorite(movie)}
              onMovieClick={() => handleMovieClick(movie)}
              index={index}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default RecentMovies
