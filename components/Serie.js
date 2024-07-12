import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Serie.module.css';
import { useRouter } from 'next/router';

function Serie(props) {
  const [watchCount, setWatchCount] = useState(0);
  const [personalNote, setPersonalNote] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Average evaluation
  const stars = [];
  for (let i = 0; i < 10; i++) {
    let style = {};
    if (i < props.voteAverage - 1) {
      style = { color: '#f1c40f' };
    }
    stars.push(<FontAwesomeIcon key={i} icon={faStar} style={style} />);
  }

  // Watch serie
  const handleWatchSerie = () => {
    setWatchCount(watchCount + 1);
  };
  let videoIconStyle = { cursor: 'pointer' };
  if (watchCount > 0) {
    videoIconStyle = { color: '#e74c3c', cursor: 'pointer' };
  }

  // Like serie
  const handleLikeSerie = () => {
    props.updateLikedSeries(props.title);
  };
  let heartIconStyle = { cursor: 'pointer' };
  if (props.isLiked) {
    heartIconStyle = { color: '#e74c3c', cursor: 'pointer' };
  }

  // Personal note
  const personalStars = [];
  for (let i = 0; i < 10; i++) {
    let style = { cursor: 'pointer' };
    if (i < personalNote) {
      style = { color: '#2196f3', cursor: 'pointer' };
    }
    personalStars.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        onClick={() => setPersonalNote(i + 1)}
        style={style}
        className="note"
      />
    );
  }

  const getColorByRate = (voteAverage) => {
    if (voteAverage >= 7.5) {
      return { color: 'green' };
    } else if (voteAverage >= 6.5) {
      return { color: 'orange' };
    } else {
      return { color: 'red' };
    }
  };

//   const handleNavigation = (data) => {
//     router.push(`/series/${data.id}-${data.slug}`);
//   };

  return (
    <div className={styles.card}>
      <a onClick={() => handleNavigation(props)}>
        <img
          className={styles.image}
          src={isHovered ? props.poster : props.poster}
          alt={props.title}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </a>
      <div className={styles.textContainer}>
        <div>
          <span className={styles.name}>{props.title}</span>
          <p className={styles.description}>{props.overview}</p>
          <p className={styles.releaseDate}>Release date: {props.releaseDate}</p>
        </div>
        <div className={styles.iconContainer}>
          <span className={styles.vote}>
            {stars} <em style={getColorByRate(props.voteAverage)}>{props.voteAverage.toFixed(2)}</em> ({props.voteCount})
          </span>
          <span>{personalStars} ({personalNote})</span>
          <span>
            <FontAwesomeIcon icon={faVideo} onClick={handleWatchSerie} style={videoIconStyle} className="watch" /> ({watchCount})
          </span>
          <span>
            <FontAwesomeIcon icon={faHeart} onClick={handleLikeSerie} style={heartIconStyle} className="like" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Serie;
