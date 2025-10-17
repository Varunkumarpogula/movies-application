import "./css/app.css"
import {Routes, Route} from "react-router-dom"
import Favorites from "./pages/Favorites";
import Home from "./pages/Home"
import NavBar from "./components/Navbar";
import { MovieProvider } from "./context/MovieContext";

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
      </Routes>
    </main>
    </MovieProvider>
  )
}


export default App