import { useState, useEffect } from "react"
import "../css/MovieCard.css"

function MovieCard({ movie, isFavorite, onToggleFavorite, onMovieClick, index }) {
  const [isVisible, setIsVisible] = useState(false)

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'

  return (
    <div 
      className={`movie-card ${isVisible ? 'visible' : ''}`}
      onClick={() => onMovieClick(movie)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="movie-poster-container">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'
          }}
        />
        <button 
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
        </p>
        {movie.vote_average > 0 && (
          <div className="movie-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard