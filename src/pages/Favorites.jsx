// src/pages/Favorites.jsx
import MovieCard from "../components/MovieCard"
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/Favorites.css"
import LogoutButton from "../components/LogoutButton";

function Favorites({ favorites, onToggleFavorite, onAddToRecent, isFavorite,recentMovies }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMovieClick = (movie) => {
    onAddToRecent(movie)
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="fixed-banner"></div>
        
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
                 Home
              </button>
              <button 
                className={`nav-tab ${location.pathname === "/favorites" ? "active" : ""}`}
                onClick={() => navigate('/favorites')}
              >
                ❤️ Favorites ({favorites.length})
              </button>
              <button 
                className={`nav-tab ${location.pathname === "/recent" ? "active" : ""}`}
                onClick={() => navigate('/recent')}
              >
                 Recent ({recentMovies.length})
              </button>
              <LogoutButton />
            </nav>
          </div>
        </header>

        <div className="favorites-container">
          <h2 className="section-title">My Favorites</h2>
          <div className="empty-favorites">
            <div className="empty-icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Start adding movies to your favorites by clicking the heart icon!</p>
            <button 
              className="browse-movies-button"
              onClick={() => navigate('/')}
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <div className="fixed-banner"></div>
      
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
               Home
            </button>
            <button 
              className={`nav-tab ${location.pathname === "/favorites" ? "active" : ""}`}
              onClick={() => navigate('/favorites')}
            >
              ❤️ Favorites ({favorites.length})
            </button>
            <button 
              className={`nav-tab ${location.pathname === "/recent" ? "active" : ""}`}
              onClick={() => navigate('/recent')}
            >
               Recent ({recentMovies.length})
            </button>
          </nav>
        </div>
      </header>

      <div className="favorites-container">
        <h2 className="section-title">My Favorites ({favorites.length})</h2>
        <div className="movies-grid">
          {favorites.map((movie, index) => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => onToggleFavorite(movie)}
              onMovieClick={handleMovieClick}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Favorites