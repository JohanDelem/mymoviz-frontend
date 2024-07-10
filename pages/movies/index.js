
import { useRouter } from 'next/router';

const MovieDetail = () => {
    const router = useRouter();
    const item = router.query;
  
    // Simulez la récupération des détails du produit
    // Dans une application réelle, vous voudrez probablement récupérer ces données depuis une API
console.log(item);
    return (
      <div>
      <h1>{item.title}</h1>
      <h1>{item.overview}</h1>
      <img src={item.poster}/>
      </div>
    );
  };
  
  export default MovieDetail;