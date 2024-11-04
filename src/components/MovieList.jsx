import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function MovieList({ movies, setMovies }) {
   const [selectedMovie, setSelectedMovie] = useState(null);
   const [page, setPage] = useState(1);
   const [items, setItems] = useState(movies);

   useEffect(() => {
      fetchMovies();
   }, []);

   const fetchMovies = async () => {
      const options = {
         method: "GET",
         headers: {
            accept: "application/json",
            Authorization:
               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDIwY2ViOTRiYWQ0ZjQ2ZDgxOGNjZGNkMDFkNGZlOCIsIm5iZiI6MTcyNzk5Mzc4OS40MjI0MjQsInN1YiI6IjY2ZjVjNmUxMzkzZjM2ZmEwNGJlZTNhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cHc27KkoEXFmCk2xx8vixWGuC_SYIZL_3X73Xp8Nqm8",
         },
      };
      try {
         setPage((prevPage) => prevPage + 1);
         console.log(page);
         const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
            options
         );

         setItems((prevItems) => [...prevItems, ...response.data.results]);
         setMovies((prevItems) => [...prevItems, ...response.data.results]);
      } catch (error) {
         console.error(error);
      }
   };

   const handleMovieClick = (movie) => {
      setSelectedMovie(movie);
   };

   const handleClose = () => {
      setSelectedMovie(null);
   };

   if (items.length === 0) {
      return (
         <p className="text-center text-xl">
            Lo sentimos, no se encontraron películas con el rating solicitado.
         </p>
      );
   }

   return (
      <div>
         <InfiniteScroll
            dataLength={movies.length} //This is important field to render the next data
            next={fetchMovies}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
               <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
               </p>
            }
            
         >
            <div className="row row-cols-4">
               {movies.map((movie, index) => (
                  <div key={`${movie.id}-${index}`}>
                     <div
                        className="card"
                        onClick={() => handleMovieClick(movie)}
                     >
                        <div className="card-body">
                           <h5 className="card-title">{movie.title}</h5>
                           <img
                              src={movie.poster_path}
                              alt=""
                              className="img-fluid"
                           />
                           <p className="card-text">
                              Rating: {movie.vote_average}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            {selectedMovie && (
               <div
                  className="modal"
                  style={{
                     display: "block",
                     backgroundColor: "rgba(0,0,0,0.5)",
                  }}
               >
                  <div className="modal-dialog">
                     <div className="modal-content">
                        <div className="modal-header">
                           <h5 className="modal-title">
                              {selectedMovie.title}
                           </h5>
                           <button
                              type="button"
                              className="close"
                              onClick={handleClose}
                           >
                              <span>&times;</span>
                           </button>
                        </div>
                        <div className="modal-body">
                           <p>{selectedMovie.overview}</p>
                           <p>Rating: {selectedMovie.vote_average}</p>
                        </div>
                        <div className="modal-footer">
                           <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleClose}
                           >
                              Close
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </InfiniteScroll>
      </div>
   );
}
