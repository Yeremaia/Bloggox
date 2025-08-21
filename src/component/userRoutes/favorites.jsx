import React, { useEffect, useState } from 'react';

// Import Axios
import Axios from 'axios';

// Link Library
import { Link } from 'react-router-dom'

// Icons Libraries
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";

// Import Img for darkMode
import { useDarkMode } from '../darkMode/darkModeContext';
import ImageNotYet from '../../images/logos/favoriteNotFound.png';
import ImageNotYetDark from '../../images/logos/logoError.png';

function Favorites() {

  const { darkMode } = useDarkMode();
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // get posts based on the idUser
  useEffect(() => {
    if (user?.idUser) {
      Axios.get(`http://localhost:3001/favorites/${user.idUser}`)
        .then(res => {
          if (res.data.success) {
            setFavorites(res.data.favorites);
          }
        })
        .catch(err => console.error("Error fetching favorites", err));
    }
  }, [user?.idUser]);

  // If there is no post, it will display the following content:
  if (favorites.length === 0) {
    return (
      <p className='no-favorite-yet'>
        No favorites yet.
        <img
          src={darkMode ? ImageNotYetDark : ImageNotYet}
          alt="No favorites"
        />
      </p>
    );
  }

  // Remove from favorites
  const removeFavorite = (idPost) => {
    Axios.delete(`http://localhost:3001/removeFavorite/${user.idUser}/${idPost}`)
      .then((res) => {
        if (res.data.success) {
          setFavorites(prev => prev.filter(post => post.idPost !== idPost));
        }
      })
      .catch(err => console.error("Error removing favorite:", err));
  };

  return (
    <div className="blogs-home">
        <h2>My Favorites</h2>
        <div className="blogs-containers-post">
          {favorites.map(post => (
            // This part says: This div represents the post with id post.idPost, so if this id doesn't change, don't re-render it completely.
            <div className="post-container" key={post.idPost}>
              <img
                src={`http://localhost:3001${post.imagePost}`}
                alt={post.title}
                title={post.title}
                className='image-post'
              />
              <p className='date-time'>{post.publicationDate?.slice(0, 10)}</p>
              <h3 className='title-post'>{post.title}</h3>
              <p className='description-post'>
                {post.description.length > 100
                  ? post.description.substring(0, 100) + "..."
                  : post.description}
              </p>
              <p className='hashtag-post'>{post.tags}</p>
              <p className='author-post-home'>
                By: <Link to="/otherProfile"><span>@{post.username}</span></Link>
              </p>

              <div className="buttons-post-actions">
                <Link to={`/postComment/${post.idPost}`}><FaMessage style={{ fontSize: "20px" }} /></Link>
                <MdFavorite
                  style={{ fontSize: "26px", color: "red", cursor: "pointer" }}
                  onClick={() => removeFavorite(post.idPost)}
                />
                <Link to={`/post/${post.idPost}`}>
                  <IoEyeSharp
                    style={{ fontSize: "27px" }}
                    onClick={() => localStorage.setItem("previousPage", window.location.pathname)}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default Favorites