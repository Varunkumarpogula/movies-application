const API_KEY = "5567d55ef3a379c315246861a201b42c";
const BASE_URL = "https://api.themoviedb.org/3";
// https://api.themoviedb.org/3/movie/popular?api_key=5567d55ef3a379c315246861a201b42c

export const getPopularMovies = async () => {
    const response = await fetch(` https://api.themoviedb.org/3/movie/popular?api_key=5567d55ef3a379c315246861a201b42c`);
    console.log(response)
    const data = await response.json();
    return data.results;
};



export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
};
