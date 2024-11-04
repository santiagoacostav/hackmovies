"use client";

import { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import MovieList from "./components/MovieList";
import axios from "axios";

export default function App() {
   const [movies, setMovies] = useState([]);
   const [filteredMovies, setFilteredMovies] = useState([]);
   const [rating, setRating] = useState(0);

   useEffect(() => {
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
            const response = await axios.get(
               "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
               options
            );
            setMovies(response.data.results);
            setFilteredMovies(response.data.results); // Actualiza filteredMovies aquí
         } catch (error) {
            console.error(error);
         }
      };

      fetchMovies();
   }, []);

   useEffect(() => {
      const filtered = movies.filter((movie) => movie.vote_average >= rating);
      console.log(filtered);
      setFilteredMovies(filtered);
   }, [rating, movies]);

   const handleRating = (rate) => {
      const minRating = rate * 2 - 2;
      setRating(minRating);
   };

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-4xl font-bold mb-8 text-center">Hackflix</h1>
         <div className="mb-8 flex justify-center">
            <Rating
               onClick={handleRating}
               initialValue={rating / 2 + 1}
               size={40}
               allowFraction={false}
            />
         </div>
         <section>
            <MovieList movies={filteredMovies} setMovies={setMovies} />
         </section>
      </div>
   );
}
