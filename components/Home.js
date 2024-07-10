import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [moviesData, setMoviesData] = useState([]);
  const [page, setPage] = useState(1);
  const [likedMovies, setLikedMovies] = useState([]);

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-') 
      .replace(/[^\w-]+/g, ''); 
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);
  const apiExemple = `https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&page=${page}`;
  const fetchMovies = (page) => {
    fetch(apiExemple)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.results.map(movie => ({
          title: movie.title,
          slug : createSlug(movie.title),
          id: movie.id,
          poster: `https://image.tmdb.org/t/p/w1280/${movie.poster_path}`, 
          poster2: `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          overview: movie.overview.length > 230 ? movie.overview.substring(0, 230) + "..." : movie.overview,
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
    return <Movie key={i} updateLikedMovies={updateLikedMovies} id={data.id} isLiked={isLiked} slug={data.slug} title={data.title} overview={data.overview} poster={data.poster} poster2={data.poster2} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
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
