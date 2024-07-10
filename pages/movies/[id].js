import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/MovieDetail.module.css';

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63`)
        .then( (response) => response.json())
        .then(data => setMovie(data));
    }
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={styles.container}>
      <img className={styles.banner} src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`} alt={`${movie.title} banner`} />
      <div className={styles.detailsContainer}>
        <img className={styles.poster} src={`https://image.tmdb.org/t/p/w1280/${movie.poster_path}`} alt={movie.title} />
        <div className={styles.details}>
          <div className={styles.header}>
          <p className={styles.tagline}>{movie.tagline}</p>
            <h1 className={styles.title}>{movie.title}</h1>
          </div>
          <p className={styles.overview}>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
