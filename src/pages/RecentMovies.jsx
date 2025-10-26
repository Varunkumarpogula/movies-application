// src/pages/RecentMovies.jsx
import MovieCard from "../components/MovieCard"
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/RecentMovies.css"

function RecentMovies({
  recentMovies = [],
  onToggleFavorite = () => {},
  onAddToRecent = () => {},
  isFavorite = () => false,
  onClearRecent = () => {},
  favorites = []
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMovieClick = (movie) => {
    onAddToRecent && onAddToRecent(movie)
  }

  if ((recentMovies || []).length === 0) {
    return (
      <div className="recent-movies-page">
        

        <div className="recent-movies-container">
          <h2 className="section-title">Recently Viewed</h2>
          <div className="empty-recent">
            <div className="empty-icon">⏰</div>
            <h3>No recent movies</h3>
            <p>Movies you view will appear here!</p>
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
    <div className="recent-movies-page">
      

      <div className="recent-movies-container">
        <div className="recent-header">
          <h2 className="section-title">Recently Viewed ({(recentMovies || []).length})</h2>
          <button 
            className="clear-recent-button"
            onClick={() => onClearRecent && onClearRecent()}
          >
            Clear All
          </button>
        </div>
        <div className="movies-grid">
          {(recentMovies || []).map((movie, index) => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => onToggleFavorite && onToggleFavorite(movie)}
              onMovieClick={handleMovieClick}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentMovies
