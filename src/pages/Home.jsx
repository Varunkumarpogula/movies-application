import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import MovieCard from "../components/MovieCard";
import MovieDetails from "../components/MovieDetails";
import HeroSection from "../components/HeroSection";
import { 
  searchMovies, 
  getPopularMovies, 
  getNowPlayingMovies, 
  getMoviesByGenre, 
  getGenres, 
  getLanguages 
} from "../services/api";
import { mockGenres, mockLanguages } from "../utils/mockData";
import "../css/Home.css";

function Home({ favorites, onToggleFavorite, onAddToRecent, isFavorite }) {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const genreDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const popularMovies = await getPopularMovies();
        const nowPlayingMovies = await getNowPlayingMovies();
        
        setMovies(popularMovies);
        setFeaturedMovies(nowPlayingMovies.slice(0, 5));
        
        try {
          const genresList = await getGenres();
          setGenres(genresList);
        } catch (genreErr) {
          console.warn("Failed to load genres, using mock data:", genreErr);
          setGenres(mockGenres);
        }
        
        try {
          const languagesList = await getLanguages();
          setLanguages(languagesList);
        } catch (langErr) {
          console.warn("Failed to load languages, using mock data:", langErr);
          setLanguages(mockLanguages);
        }
        
      } catch (err) {
        console.error("Error loading main data:", err);
        setError("Failed to load movies. Please try again.");
        setMovies([]);
        setFeaturedMovies([]);
        setGenres(mockGenres);
        setLanguages(mockLanguages);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMoviesDebounced = async () => {
      if (!searchQuery.trim() && !selectedGenre && !selectedLanguage) {
        try {
          const popularMovies = await getPopularMovies();
          setMovies(popularMovies);
        } catch (err) {
          console.error("Error loading popular movies:", err);
        }
        return;
      }

      setLoading(true);
      
      try {
        let results = [];
        if (searchQuery) {
          results = await searchMovies(searchQuery);
        } else if (selectedGenre) {
          results = await getMoviesByGenre(selectedGenre.id);
        }
        
        if (selectedLanguage && results.length > 0) {
          results = results.filter(movie => movie.original_language === selectedLanguage.iso_639_1);
        }
        
        setMovies(results);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMoviesDebounced, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre, selectedLanguage]);

  const handleMovieClick = (movie) => {
    console.log('🎬 HOME: Movie clicked:', movie.title);
    setSelectedMovie(movie);
    onAddToRecent(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre(null);
    setSelectedLanguage(null);
    setShowGenreDropdown(false);
    setShowLanguageDropdown(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setSelectedLanguage(null);
    setShowGenreDropdown(false);
    setSearchQuery("");
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setSelectedGenre(null);
    setShowLanguageDropdown(false);
    setSearchQuery("");
  };

  // CRITICAL FIX: Prevent form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="home">
      <div className="fixed-banner"></div>

      <div className="home-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!searchQuery && !selectedGenre && !selectedLanguage && featuredMovies.length > 0 && (
          <HeroSection 
            movies={featuredMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        <div className="search-section">
          {/* CRITICAL FIX: Added onSubmit handler */}
          <form onSubmit={handleFormSubmit} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search for movies..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* CRITICAL FIX: Changed to type="button" */}
              <button 
                type="button"
                className="search-button"
              >
                Search
              </button>
            </div>
            
            {genres.length > 0 && (
              <div className="filter-container" ref={genreDropdownRef}>
                <button 
                  type="button"
                  className={`filter-button ${selectedGenre ? 'active' : ''}`}
                  onClick={() => {
                    setShowGenreDropdown(!showGenreDropdown);
                    setShowLanguageDropdown(false);
                  }}
                >
                  🎭 {selectedGenre ? selectedGenre.name : 'Genres'}
                  <span className={`dropdown-arrow ${showGenreDropdown ? 'open' : ''}`}>▼</span>
                </button>
                
                {showGenreDropdown && (
                  <div className="filter-dropdown">
                    {genres.map(genre => (
                      <button
                        key={genre.id}
                        type="button"
                        className={`filter-option ${selectedGenre?.id === genre.id ? 'selected' : ''}`}
                        onClick={() => handleGenreSelect(genre)}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {languages.length > 0 && (
              <div className="filter-container" ref={languageDropdownRef}>
                <button 
                  type="button"
                  className={`filter-button ${selectedLanguage ? 'active' : ''}`}
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown);
                    setShowGenreDropdown(false);
                  }}
                >
                  🌐 {selectedLanguage ? selectedLanguage.english_name : 'Language'}
                  <span className={`dropdown-arrow ${showLanguageDropdown ? 'open' : ''}`}>▼</span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="filter-dropdown">
                    {languages.slice(0, 30).map(language => (
                      <button
                        key={language.iso_639_1}
                        type="button"
                        className={`filter-option ${selectedLanguage?.iso_639_1 === language.iso_639_1 ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        {language.english_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {(searchQuery || selectedGenre || selectedLanguage) && (
            <div className="active-filters">
              {searchQuery && (
                <span className="filter-tag">
                  Search: "{searchQuery}"
                  <button 
                    type="button"
                    onClick={() => setSearchQuery("")}
                  >×</button>
                </span>
              )}
              {selectedGenre && (
                <span className="filter-tag">
                  Genre: {selectedGenre.name}
                  <button 
                    type="button"
                    onClick={() => setSelectedGenre(null)}
                  >×</button>
                </span>
              )}
              {selectedLanguage && (
                <span className="filter-tag">
                  Language: {selectedLanguage.english_name}
                  <button 
                    type="button"
                    onClick={() => setSelectedLanguage(null)}
                  >×</button>
                </span>
              )}
              <button 
                type="button"
                className="clear-all-filters" 
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : (
          <div className="movies-container">
            <h2 className="section-title">
              {searchQuery 
                ? `Search Results for "${searchQuery}"`
                : selectedGenre 
                ? `${selectedGenre.name} Movies`
                : selectedLanguage
                ? `${selectedLanguage.english_name} Movies`
                : "Popular Movies"
              }
            </h2>
            
            {movies.length === 0 ? (
              <div className="no-results">
                <p>No movies found. Try a different search or filter.</p>
              </div>
            ) : (
              <div className="movies-grid">
                {movies.map((movie, index) => (
                  <MovieCard 
                    key={movie.id}
                    movie={movie}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={() => onToggleFavorite(movie)}
                    onMovieClick={() => handleMovieClick(movie)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie}
          onClose={handleCloseDetails}
          isFavorite={isFavorite(selectedMovie.id)}
          onToggleFavorite={() => onToggleFavorite(selectedMovie)}
        />
      )}
    </div>
  );
}

export default Home;