import React, { useEffect } from "react"
import "../css/MovieDetails.css"

function MovieDetails({ movie, onClose, isFavorite, onToggleFavorite }) {
  console.log('🎭 MovieDetails rendered with movie:', movie ? movie.title : 'null')

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        console.log('ESC key pressed - closing modal')
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!movie) {
    console.log('❌ MovieDetails: No movie provided, returning null')
    return null
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333333/ffffff?text=No+Background'

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/333333/ffffff?text=No+Image'

  const handlePlayTrailer = () => {
    console.log('🎬 Opening trailer for:', movie.title)
    const searchQuery = `${movie.title} official trailer`
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
    window.open(youtubeUrl, '_blank')
  }

  console.log('✅ MovieDetails rendering modal for:', movie.title)

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div 
          className="movie-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="backdrop-overlay"></div>
        </div>

        <div className="movie-details-content">
          <div className="movie-poster-section">
            <img src={posterUrl} alt={movie.title} className="details-poster" />
            <div className="action-buttons">
              <button 
                className="trailer-button"
                onClick={handlePlayTrailer}
              >
                🎬 Watch Trailer
              </button>
              <button 
                className={`favorite-button-large ${isFavorite ? 'favorited' : ''}`}
                onClick={() => onToggleFavorite(movie)}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>

          <div className="movie-info-section">
            <h1 className="movie-title-large">{movie.title}</h1>
            
            <div className="movie-meta">
              <span className="movie-year">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
              </span>
              {movie.runtime && <span className="movie-runtime">{movie.runtime} min</span>}
              {movie.vote_average > 0 && (
                <span className="movie-rating-large">
                  ⭐ {movie.vote_average.toFixed(1)}/10
                </span>
              )}
            </div>

            <p className="movie-overview">{movie.overview || 'No overview available.'}</p>

            {movie.genres && movie.genres.length > 0 && (
              <div className="genres">
                <h3>Genres</h3>
                <div className="genres-list">
                  {movie.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails