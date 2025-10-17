import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { useMovieContext } from "../context/MovieContext";
function NavBar() {
    const { favorites } = useMovieContext();
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">Movie App</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-links">Home</Link>
            <Link to="/favorites" className="nav-links">Favorites 💌 <span style={{color:"white"}}>{favorites.length}</span></Link>
        </div>
    </nav>
}
export default NavBar