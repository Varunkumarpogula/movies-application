import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './css/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)




// App (Manages global state)
// ├── Home (Shows movies, search, filters)
// │   ├── HeroSection (Featured movies banner)
// │   ├── SearchBar (Search input)
// │   ├── FilterDropdowns (Genre/Language filters)
// │   └── MovieGrid (Grid of MovieCards)
// │       └── MovieCard (Individual movie)
// ├── Favorites (Shows favorite movies)
// └── RecentMovies (Shows recently viewed)