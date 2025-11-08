import { useState, useEffect } from "react"
import "../css/HeroSection.css"

function HeroSection({ movies, onMovieClick }) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (movies.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [movies.length])

  const currentMovie = movies[currentMovieIndex]

  if (!currentMovie) return null

  const backdropUrl = currentMovie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333333/ffffff?text=Movie+Hub'

  const nextMovie = () => {
    setCurrentMovieIndex((prev) => (prev + 1) % movies.length)
  }

  const prevMovie = () => {
    setCurrentMovieIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  return (
    <section 
      className={`hero-section ${isVisible ? 'visible' : ''}`}
      style={{ backgroundImage: `url(${backdropUrl})` }}
      onClick={() => onMovieClick(currentMovie)}
    >
      {/* Navigation Arrows */}
      <button className="hero-nav-arrow left" onClick={(e) => {
        e.stopPropagation()
        prevMovie()
      }}>
        ‹
      </button>
      
      <button className="hero-nav-arrow right" onClick={(e) => {
        e.stopPropagation()
        nextMovie()
      }}>
        ›
      </button>

      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-info">
            <h1 className="hero-title">{currentMovie.title}</h1>
            <p className="hero-overview">
              {currentMovie.overview?.substring(0, 200)}...
            </p>
            <div className="hero-meta">
              <span className="hero-year">
                {currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : 'Coming Soon'}
              </span>
              {currentMovie.vote_average && (
                <span className="hero-rating">
                  ⭐ {currentMovie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Movie indicators */}
        <div className="movie-indicators">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentMovieIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentMovieIndex(index)
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection