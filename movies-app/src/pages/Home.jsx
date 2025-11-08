
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import MovieCard from "../components/MovieCard"
import MovieDetails from "../components/MovieDetails"
import HeroSection from "../components/HeroSection"
import { 
  searchMovies, 
  getPopularMovies, 
  getNowPlayingMovies, 
  getMoviesByGenre, 
  getMoviesByLanguage,
  getGenres, 
  getLanguages 
} from "../services/Api"
import "../css/Home.css"

function Home({ favorites, onToggleFavorite, onAddToRecent, isFavorite, recentMovies }) {
  const [movies, setMovies] = useState([])
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [error, setError] = useState("")
  
  // Search states for dropdowns
  const [genreSearch, setGenreSearch] = useState("")
  const [languageSearch, setLanguageSearch] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const genreDropdownRef = useRef(null)
  const languageDropdownRef = useRef(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError("")
        console.log("Loading initial data...")
        
        const [popularMovies, nowPlayingMovies, genresList, languagesList] = await Promise.all([
          getPopularMovies(),
          getNowPlayingMovies(),
          getGenres(),
          getLanguages()
        ])
        
        console.log("Data loaded:", {
          popular: popularMovies.length,
          nowPlaying: nowPlayingMovies.length,
          genres: genresList.length,
          languages: languagesList.length
        })
        
        setMovies(popularMovies)
        setFeaturedMovies(nowPlayingMovies.slice(0, 5))
        setGenres(genresList)
        setLanguages(languagesList)
        
        if (popularMovies.length === 0) {
          setError("No movies loaded. Check API key or network connection.")
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load movies. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false)
        setGenreSearch("")
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false)
        setLanguageSearch("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered genres based on search
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(genreSearch.toLowerCase())
  )

  // Filtered languages based on search
  const filteredLanguages = languages.filter(language =>
    language.english_name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    (language.name && language.name.toLowerCase().includes(languageSearch.toLowerCase()))
  )

  // Search and filter functionality
  useEffect(() => {
    let isMounted = true

    const executeSearch = async () => {
      if (!isMounted) return

      // If no filters and no search, show popular movies (initial state)
      if (!searchQuery.trim() && !selectedGenre && !selectedLanguage) {
        console.log("No filters active, showing popular movies")
        if (movies.length === 0) {
          try {
            const popularMovies = await getPopularMovies()
            if (isMounted) {
              setMovies(popularMovies)
              setError(popularMovies.length === 0 ? "No movies found." : "")
            }
          } catch (err) {
            console.error("Error loading popular movies:", err)
            if (isMounted) setError("Failed to load movies.")
          }
        }
        return
      }

      setLoading(true)
      setError("")
      
      try {
        let results = []
        console.log("Executing search/filter:", { 
          searchQuery, 
          selectedGenre: selectedGenre?.name, 
          selectedLanguage: selectedLanguage?.english_name 
        })

        // CASE 1: Only Search
        if (searchQuery.trim() && !selectedGenre && !selectedLanguage) {
          console.log("Case 1: Only search")
          results = await searchMovies(searchQuery)
        }
        // CASE 2: Only Genre
        else if (selectedGenre && !searchQuery.trim() && !selectedLanguage) {
          console.log("Case 2: Only genre")
          results = await getMoviesByGenre(selectedGenre.id)
        }
        // CASE 3: Only Language - FIXED: Use dedicated language endpoint
        else if (selectedLanguage && !searchQuery.trim() && !selectedGenre) {
          console.log("Case 3: Only language - fetching by language:", selectedLanguage.iso_639_1)
          results = await getMoviesByLanguage(selectedLanguage.iso_639_1)
        }
        // CASE 4: Search + Genre
        else if (searchQuery.trim() && selectedGenre && !selectedLanguage) {
          console.log("Case 4: Search + genre")
          const searchResults = await searchMovies(searchQuery)
          results = searchResults.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(selectedGenre.id)
          )
        }
        // CASE 5: Search + Language
        else if (searchQuery.trim() && selectedLanguage && !selectedGenre) {
          console.log("Case 5: Search + language")
          const searchResults = await searchMovies(searchQuery)
          results = searchResults.filter(movie => 
            movie.original_language === selectedLanguage.iso_639_1
          )
        }
        // CASE 6: Genre + Language
        else if (selectedGenre && selectedLanguage && !searchQuery.trim()) {
          console.log("Case 6: Genre + language")
          const genreResults = await getMoviesByGenre(selectedGenre.id)
          results = genreResults.filter(movie => 
            movie.original_language === selectedLanguage.iso_639_1
          )
        }
        // CASE 7: All three filters
        else if (searchQuery.trim() && selectedGenre && selectedLanguage) {
          console.log("Case 7: All filters")
          const searchResults = await searchMovies(searchQuery)
          results = searchResults.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(selectedGenre.id) &&
            movie.original_language === selectedLanguage.iso_639_1
          )
        }

        console.log("Final results count:", results.length)
        
        if (isMounted) {
          setMovies(results)
          if (results.length === 0) {
            setError(`No ${selectedLanguage ? selectedLanguage.english_name + ' ' : ''}${selectedGenre ? selectedGenre.name + ' ' : ''}movies found${searchQuery ? ` for "${searchQuery}"` : ''}. Try different search terms or filters.`)
          } else {
            setError("")
          }
        }
      } catch (err) {
        console.error("Search error:", err)
        if (isMounted) {
          setError("Search failed. Please try again.")
          setMovies([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timeoutId = setTimeout(executeSearch, 600)
    
    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [searchQuery, selectedGenre, selectedLanguage])

  const handleMovieClick = (movie) => {
    console.log("Movie clicked:", movie.title)
    setSelectedMovie(movie)
    onAddToRecent(movie)
  }

  const handleCloseDetails = () => {
    setSelectedMovie(null)
  }

  const clearFilters = async () => {
    console.log("Clearing all filters")
    setSearchQuery("")
    setSelectedGenre(null)
    setSelectedLanguage(null)
    setShowGenreDropdown(false)
    setShowLanguageDropdown(false)
    setGenreSearch("")
    setLanguageSearch("")
    setError("")
    
    setLoading(true)
    try {
      const popularMovies = await getPopularMovies()
      setMovies(popularMovies)
    } catch (err) {
      console.error("Error loading popular movies:", err)
      setError("Failed to load movies.")
    } finally {
      setLoading(false)
    }
  }

  const handleGenreSelect = (genre) => {
    console.log("Genre selected:", genre.name)
    setSelectedGenre(genre)
    setSelectedLanguage(null)
    setShowGenreDropdown(false)
    setGenreSearch("")
    setSearchQuery("")
  }

  const handleLanguageSelect = (language) => {
    console.log("Language selected:", language.english_name)
    setSelectedLanguage(language)
    setSelectedGenre(null)
    setShowLanguageDropdown(false)
    setLanguageSearch("")
    setSearchQuery("")
  }

  // Get display title based on current filters
  const getSectionTitle = () => {
    if (searchQuery) {
      return `Search: "${searchQuery}"`
    }
    if (selectedGenre) {
      return `${selectedGenre.name} Movies`
    }
    if (selectedLanguage) {
      return `${selectedLanguage.english_name} Movies`
    }
    return "Popular Movies"
  }

  return (
    <div className="home">
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

      <div className="home-content">
        {/* Hero Section - Only show when no filters active */}
        {!searchQuery && !selectedGenre && !selectedLanguage && featuredMovies.length > 0 && (
          <HeroSection 
            movies={featuredMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search for movies..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.trim()) {
                    setSelectedGenre(null)
                    setSelectedLanguage(null)
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (searchQuery.trim()) {
                      setSelectedGenre(null)
                      setSelectedLanguage(null)
                    }
                  }
                }}
              />
              <button 
                type="button" 
                className="search-button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    setSelectedGenre(null)
                    setSelectedLanguage(null)
                  }
                }}
              >
                🔍 Search
              </button>
            </div>
            
            {/* Genre Filter with Search */}
            <div className="filter-container" ref={genreDropdownRef}>
              <button 
                type="button"
                className={`filter-button ${selectedGenre ? 'active' : ''}`}
                onClick={() => {
                  setShowGenreDropdown(!showGenreDropdown)
                  setShowLanguageDropdown(false)
                  setGenreSearch("")
                }}
              >
                🎭 {selectedGenre ? selectedGenre.name : 'Genres'}
                <span className={`dropdown-arrow ${showGenreDropdown ? 'open' : ''}`}>▼</span>
              </button>
              
              {showGenreDropdown && (
                <div className="filter-dropdown">
                  {/* Genre Search Input */}
                  <div className="dropdown-search-container">
                    <input
                      type="text"
                      placeholder="Search genres..."
                      className="dropdown-search-input"
                      value={genreSearch}
                      onChange={(e) => setGenreSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="dropdown-list">
                    {filteredGenres.length > 0 ? (
                      filteredGenres.map(genre => (
                        <button
                          key={genre.id}
                          className={`filter-option ${selectedGenre?.id === genre.id ? 'selected' : ''}`}
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre.name}
                        </button>
                      ))
                    ) : (
                      <div className="no-options">
                        No genres found for "{genreSearch}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Filter with Search */}
            <div className="filter-container" ref={languageDropdownRef}>
              <button 
                type="button"
                className={`filter-button ${selectedLanguage ? 'active' : ''}`}
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown)
                  setShowGenreDropdown(false)
                  setLanguageSearch("")
                }}
              >
                🌐 {selectedLanguage ? selectedLanguage.english_name : 'Languages'}
                <span className={`dropdown-arrow ${showLanguageDropdown ? 'open' : ''}`}>▼</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="filter-dropdown language-dropdown">
                  {/* Language Search Input */}
                  <div className="dropdown-search-container">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      className="dropdown-search-input"
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="dropdown-list">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map(language => (
                        <button
                          key={language.iso_639_1}
                          className={`filter-option ${selectedLanguage?.iso_639_1 === language.iso_639_1 ? 'selected' : ''}`}
                          onClick={() => handleLanguageSelect(language)}
                        >
                          {language.english_name}
                          {language.name && language.name !== language.english_name && (
                            <span className="native-name"> ({language.name})</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="no-options">
                        No languages found for "{languageSearch}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedGenre || selectedLanguage) && (
            <div className="active-filters">
              <span className="active-filters-label">Active Filters:</span>
              {searchQuery && (
                <span className="filter-tag">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery("")}
                    aria-label="Remove search filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="filter-tag">
                  Genre: {selectedGenre.name}
                  <button 
                    onClick={() => setSelectedGenre(null)}
                    aria-label="Remove genre filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedLanguage && (
                <span className="filter-tag">
                  Language: {selectedLanguage.english_name}
                  <button 
                    onClick={() => setSelectedLanguage(null)}
                    aria-label="Remove language filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <button 
                className="clear-all-filters" 
                onClick={clearFilters}
              >
                🗑️ Clear All
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div className="movies-container">
          <h2 className="section-title">
            {getSectionTitle()} 
            {!loading && movies.length > 0 && ` (${movies.length} movies)`}
          </h2>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : error && movies.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">😕</div>
              <h3>{error}</h3>
              <button 
                className="browse-movies-button"
                onClick={clearFilters}
              >
                Browse Popular Movies
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🎬</div>
              <h3>No movies found</h3>
              <p>Try adjusting your search terms or filters</p>
              <button 
                className="browse-movies-button"
                onClick={clearFilters}
              >
                Browse Popular Movies
              </button>
            </div>
          ) : (
            <div className="movies-grid">
              {movies.map((movie, index) => (
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
          )}
        </div>

        {/* Debug Info - Enable by changing display to 'block' */}
        <div className="debug-info" style={{ 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '1rem', 
          margin: '1rem', 
          borderRadius: '8px',
          fontSize: '0.8rem',
          display: 'none'
        }}>
          <h4>Debug Info:</h4>
          <p>Search Query: "{searchQuery}"</p>
          <p>Selected Genre: {selectedGenre?.name || 'None'}</p>
          <p>Selected Language: {selectedLanguage?.english_name || 'None'} ({selectedLanguage?.iso_639_1 || 'N/A'})</p>
          <p>Movies Count: {movies.length}</p>
          <p>Loading: {loading.toString()}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie}
          onClose={handleCloseDetails}
          isFavorite={isFavorite(selectedMovie.id)}
          onToggleFavorite={() => onToggleFavorite(selectedMovie)}
        />
      )}
    </div>

      


  )
}

export default Home