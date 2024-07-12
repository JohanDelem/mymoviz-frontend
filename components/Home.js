import { useState, useEffect, useContext } from 'react';
import { Popover, Button, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';
import { AppContext } from '../context/AppContext';

function Home() {
  const { mode, setMode } = useContext(AppContext);
  const router = useRouter();
  const { page: queryPage } = router.query;
  const [moviesData, setMoviesData] = useState([]);
  const [page, setPage] = useState(queryPage ? parseInt(queryPage) : 1);
  const [likedMovies, setLikedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchMovies(page);
    } else {
      fetchSearchMovies(searchQuery, page);
    }
  }, [page, searchQuery, mode]);

  const fetchMovies = (page) => {
    const frApi = `https://api.themoviedb.org/3/movie/now_playing?api_key=4e44d9029b1270a757cddc766a1bcb63&language=fr-FR&page=${page}`;
    const enApi = `https://api.themoviedb.org/3/movie/now_playing?api_key=4e44d9029b1270a757cddc766a1bcb63&page=${page}`;

    fetch(mode === 'FR' ? frApi : enApi)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.results.map(movie => ({
          title: movie.title,
          slug: createSlug(movie.title),
          id: movie.id,
          poster: `https://image.tmdb.org/t/p/w1280/${movie.poster_path}`,
          poster2: `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          releaseDate: movie.release_date,
          overview: movie.overview.length > 230 ? movie.overview.substring(0, 230) + "..." : movie.overview,
        }));

        setMoviesData(formattedData);
      });
  };

  const fetchSearchMovies = (query, page) => {
    const searchEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&query=${query}&page=${page}`;
    fetch(searchEndpoint)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.results.map(movie => ({
          title: movie.title,
          slug: createSlug(movie.title),
          id: movie.id,
          poster: `https://image.tmdb.org/t/p/w1280/${movie.poster_path}`,
          poster2: `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          releaseDate: movie.release_date,
          overview: movie.overview.length > 180 ? movie.overview.substring(0, 180) + "..." : movie.overview,
        }));

        setMoviesData(formattedData);
      });
  };

  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} id={data.id} isLiked={isLiked} slug={data.slug} title={data.title} releaseDate={data.releaseDate} overview={data.overview} poster={data.poster} poster2={data.poster2} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });

  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    router.push(`/?page=${newPage}`, undefined, { shallow: true });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      router.push(`/?page=${newPage}`, undefined, { shallow: true });
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <div className={styles.languageButtons}>
          <Button onClick={() => setMode('FR')}>Français</Button>
          <Button onClick={() => setMode('EN')}>English</Button>
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <Input
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
      <div className={styles.pagination}>
        <Button onClick={handlePrevPage} disabled={page === 1}>Previous</Button>
        <Button onClick={handleNextPage}>Next</Button>
      </div>
    </div>
  );
}

export default Home;
