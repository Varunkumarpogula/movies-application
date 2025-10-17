import "../css/Favorites.css"
import { useMovieContext } from "../context/MovieContext"
import MovieCard from "../components/MovieCard"
function Favorites() {
    // function
    const {favorites} = useMovieContext()

    if(favorites.length>0) 
        return <div className="favorites">
    <h2>Your Favorite Movies</h2>
    <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
    </div>

    return <div className="favorites-empty">
        <h1>no Favorite movies yet</h1>
        <p>start adding movies</p>
    </div>
}

export default Favorites