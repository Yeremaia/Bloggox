import React, { useEffect, useState } from 'react';

// Import Link library
import { useLocation, Link } from 'react-router-dom';

// Logo Default
import ImageNotYet from '../../images/logos/favoriteNotFound.png';
import ImageNotYetDark from '../../images/logos/logoError.png';

// import customizable alert
import { ToastContainer, toast } from 'react-toastify';

// Icons Libraries
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";

// Import Axios
import Axios from 'axios';

// Import Dark Mode Component
import { useDarkMode } from '../darkMode/darkModeContext';

function Search() {
    const { darkMode } = useDarkMode();
    const location = useLocation();
    const [results, setResults] = useState([]);
    const query = new URLSearchParams(location.search).get("query") || "";
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        Axios.get(`http://localhost:3001/favorites/${user.idUser}`)
          .then(res => {
            if (res.data.success) {
              // We only save favorite idPosts
              const favIds = res.data.favorites.map(fav => fav.idPost);
              setFavorites(favIds);
            }
          })
          .catch(err => console.error(err));
      }
    }, []);

    // This is to set the URL query = "written character". For example: localhost:3001/searchPost?query=thebestpost
    useEffect(() => {
        if (query.trim() !== "") {
        Axios.get(`http://localhost:3001/searchPosts?query=${encodeURIComponent(query)}`)
            .then(res => {
            if (res.data.success) {
                setResults(res.data.posts);
            }
            })
            .catch(err => console.error("Error fetching search results:", err));
        }
    }, [query]);

    if (results.length === 0) { 
        return (
            <p className='no-favorite-yet'>
                <p>No results found for "<span>{query}</span>".</p>
                <img
                src={darkMode ? ImageNotYetDark : ImageNotYet}
                alt="No favorites"
                />
            </p>
        )
    } 

    const toggleFavorite = (idPost) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("You must be logged in.");

      if (favorites.includes(idPost)) {
        Axios.delete(`http://localhost:3001/removeFavorite/${user.idUser}/${idPost}`)
          .then((res) => {
            if (res.data.success) {
              toast.info("Successfully removed from favorites")
              setFavorites(prev => prev.filter(favId => favId !== idPost));
            }
          })
          .catch(err => console.error("Error removing favorite:", err));
      } else {
        Axios.post("http://localhost:3001/addFavorite", {
          idUser: user.idUser,
          idPost: idPost
        }).then((res) => {
          if (res.data.success) {
            setFavorites(prev => [...prev, idPost]);
            toast.success("Successfully added to favorites")
          }
        }).catch(err => console.error("Error adding favorite:", err));
      }
    };

  return (
    <div className="blogs-home">
        <ToastContainer style={{fontWeight: "bold"}}/>
      <h2 className='not-found-search'>Search results for "<span>{query}</span>"</h2>
      <div className="blogs-containers-post">

        {results.map((post) => (
          <div className="post-container" key={post.idPost} style={{marginTop: "0px"}}>
            <img src={`http://localhost:3001${post.imagePost}`} alt={post.title} className='image-post'/>
            <p className='date-time'>{post.publicationDate.slice(0, 10)}</p>
            <h3 className='title-post'>{post.title}</h3>
            <p className='description-post'>
              {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
            </p>
            <p className='hashtag-post'>{post.tags}</p>
            <p className='author-post-home'>By: <span>@{post.username}</span></p>
            
            <div className="buttons-post-actions">
              <Link to={`/postComment/${post.idPost}`}>
                <FaMessage style={{fontSize: "17px"}}/>
              </Link>
              <MdFavorite 
                style={{ 
                    fontSize: "26px",  
                    marginTop: "5px", 
                    cursor: "pointer", 
                    color: favorites.includes(post.idPost) ? "red" : "gray"
                }}
                onClick={() => toggleFavorite(post.idPost)}
                />
              <Link to={`/post/${post.idPost}`}>
                <IoEyeSharp style={{fontSize: "25px"}}/>
              </Link>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Search;