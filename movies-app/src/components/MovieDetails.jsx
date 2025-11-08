import { useEffect } from "react"
import "../css/MovieDetails.css"

function MovieDetails({ movie, onClose, isFavorite, onToggleFavorite }) {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!movie) return null

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333333/ffffff?text=No+Background'

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/333333/ffffff?text=No+Image'

  const handlePlayTrailer = () => {
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`
    window.open(youtubeUrl, '_blank')
  }

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A'
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get language name from code
  const getLanguageName = (code) => {
    const languages = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      ja: 'Japanese',
      ko: 'Korean',
      zh: 'Chinese',
      hi: 'Hindi',
      ru: 'Russian',
      ar: 'Arabic',
      pt: 'Portuguese'
    }
    return languages[code] || code?.toUpperCase() || 'N/A'
  }

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Full-width Backdrop Image */}
        <div 
          className="movie-backdrop-full"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="backdrop-overlay-full"></div>
          
          {/* Poster overlay on backdrop */}
          <div className="poster-on-backdrop">
            <img src={posterUrl} alt={movie.title} className="details-poster-large" />
          </div>
        </div>

        <div className="movie-details-content-full">
          <div className="movie-main-info">
            <div className="title-section">
              <h1 className="movie-title-full">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="original-title-full">Original Title: {movie.original_title}</p>
              )}
            </div>

            <div className="movie-meta-full">
              <span className="movie-year-full">
                {formatDate(movie.release_date)}
              </span>
              {movie.runtime && (
                <span className="movie-runtime-full">
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="movie-rating-full">
                  ⭐ {movie.vote_average.toFixed(1)}/10
                  <span className="vote-count-full">({movie.vote_count?.toLocaleString()} votes)</span>
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="genres-full">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre-tag-full">{genre.name}</span>
                ))}
              </div>
            )}

            <div className="action-buttons-full">
              <button 
                className="trailer-button-full"
                onClick={handlePlayTrailer}
              >
                🎬 Watch Trailer
              </button>
              <button 
                className={`favorite-button-full ${isFavorite ? 'favorited' : ''}`}
                onClick={() => onToggleFavorite(movie)}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>

          <div className="movie-details-grid">
            {/* Left Column - Overview and Details */}
            <div className="details-left-column">
              <div className="overview-section">
                <h3>Overview</h3>
                <p className="movie-overview-full">{movie.overview || 'No overview available.'}</p>
              </div>

              {/* Language and Budget Section */}
              <div className="key-details-section">
                <h3>Key Details</h3>
                <div className="key-details-grid">
                  <div className="key-detail-item">
                    <span className="key-detail-label">Original Language:</span>
                    <span className="key-detail-value">
                      {getLanguageName(movie.original_language)}
                    </span>
                  </div>
                  
                  <div className="key-detail-item">
                    <span className="key-detail-label">Budget:</span>
                    <span className="key-detail-value">
                      {formatCurrency(movie.budget)}
                    </span>
                  </div>
                  
                  <div className="key-detail-item">
                    <span className="key-detail-label">Revenue:</span>
                    <span className="key-detail-value">
                      {formatCurrency(movie.revenue)}
                    </span>
                  </div>
                  
                  {movie.status && (
                    <div className="key-detail-item">
                      <span className="key-detail-label">Status:</span>
                      <span className="key-detail-value">{movie.status}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Collection */}
              {movie.belongs_to_collection && (
                <div className="collection-section">
                  <h3>Part of Collection</h3>
                  <div className="collection-card">
                    {movie.belongs_to_collection.poster_path && (
                      <img 
                        src={`https://image.tmdb.org/t/p/w300${movie.belongs_to_collection.poster_path}`} 
                        alt={movie.belongs_to_collection.name}
                        className="collection-poster"
                      />
                    )}
                    <div className="collection-info">
                      <h4 className="collection-title">{movie.belongs_to_collection.name}</h4>
                      <button className="view-collection-btn">
                        View Collection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="details-right-column">
              {/* Production Companies - Full Width Images */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="production-companies-full">
                  <h3>Production Companies</h3>
                  <div className="companies-grid-full">
                    {movie.production_companies.map(company => (
                      <div key={company.id} className="company-card-full">
                        {company.logo_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w300${company.logo_path}`} 
                            alt={company.name}
                            className="company-logo-full"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }}
                          />
                        ) : null}
                        <span 
                          className="company-name-full"
                          style={{ display: company.logo_path ? 'none' : 'block' }}
                        >
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spoken Languages */}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="languages-section">
                  <h3>Spoken Languages</h3>
                  <div className="languages-list">
                    {movie.spoken_languages.map((language, index) => (
                      <span key={index} className="language-tag">
                        {language.english_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Countries */}
              {movie.production_countries && movie.production_countries.length > 0 && (
                <div className="countries-section">
                  <h3>Production Countries</h3>
                  <div className="countries-list">
                    {movie.production_countries.map((country, index) => (
                      <span key={index} className="country-tag">
                        {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Stats */}
              <div className="stats-section">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  {movie.popularity && (
                    <div className="stat-item">
                      <span className="stat-label">Popularity:</span>
                      <span className="stat-value">{movie.popularity.toFixed(0)}</span>
                    </div>
                  )}
                  {movie.vote_count && (
                    <div className="stat-item">
                      <span className="stat-label">Vote Count:</span>
                      <span className="stat-value">{movie.vote_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails