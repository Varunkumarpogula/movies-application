import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./css/index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key! Add it to your .env file.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);




// App (Manages global state)
// ├── Home (Shows movies, search, filters)
// │   ├── HeroSection (Featured movies banner)
// │   ├── SearchBar (Search input)
// │   ├── FilterDropdowns (Genre/Language filters)
// │   └── MovieGrid (Grid of MovieCards)
// │       └── MovieCard (Individual movie)
// ├── Favorites (Shows favorite movies)
// └── RecentMovies (Shows recently viewed)