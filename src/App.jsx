import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx';
import PopupCard from './components/PopupCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

  // const API_BASE_URL = import.meta.env.VITE_TMDB_API_ENDPOINT;
  const API_BASE_URL = import.meta.env.VITE_API_BOSSROD;
  // const API_BASE_URL = 'https://api.themoviedb.org/3';
  // const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      // Authorization: `Bearer ${API_KEY}`
    }
  };

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Debounce the search term to prevent making too many API Requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async ( query = '', signal) => {
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error messages

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, { ...API_OPTIONS, signal });
      
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      const results = data.results || [];

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Error fetching movies. Please try again.');
        setMovieList([]);
        return;
      } 
      setMovieList(results);
      
      if(query && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
      
    } catch (error) {
      if (error.name === 'AbortError') return; // stale request cancelled, ignore
      setErrorMessage('Error fetching movies. Please try again.');
      console.error('Error fetching movies:', error);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      // setErrorMessage(`Error fetching trending movies.`);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(debouncedSearchTerm, controller.signal);
    return () => controller.abort();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
    <div className="pattern" /> 

    <div className="wrapper" >
      <header>
        <img src="/hero.png" alt="Hero Banner"/>
        <h1> Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
      

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      {trendingMovies.length > 0 && (
        <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1 } </p>
                <img src={movie.poster_url} alt={movie.title} />

              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="all-movies">
        <h2>All Movies</h2>

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie}/>
            ))}
          </ul>

        )}

      </section>

      {selectedMovie && (
        <div className="movie-modal" onClick={() => setSelectedMovie(null)}>
          <PopupCard movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </div>
      )}
    </div>

     </main>
  )
}

export default App
