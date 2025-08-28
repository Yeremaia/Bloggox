import React, { useEffect, useState, useMemo } from 'react';

// Import Axios
import Axios from 'axios';

// Import Link Library
import { Link, useLocation } from 'react-router-dom';

// Icons
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";

function OtherFavorites() {
  const [favorites, setFavorites] = useState([]);
  const otherUser = JSON.parse(localStorage.getItem("otherUser"));
  const location = useLocation();

  // get other users favorite posts
  useEffect(() => {
    if (otherUser?.idUser) {
      Axios.get(`http://localhost:3001/favorites/${otherUser.idUser}`)
        .then((res) => {
          if (res.data.success) {
            setFavorites(res.data.favorites);
          }
        })
        .catch(err => console.error("Error loading favorites:", err));
    }
  }, [otherUser]);

  // Favorite post IDs list (numeric, in case it comes as a string)
  const favoriteIds = useMemo(
    () => favorites.map(p => Number(p.idPost)),
    [favorites]
  );

  if (favorites.length === 0) {
    return <p style={{ textAlign: "center", margin: "20px 0", fontSize:"20px" }} className='dark-mode-no-yet'>No favorites yet.</p>;
  }

  // Save context before going to post/comments
  const prepNavigateToPost = () => {
    localStorage.setItem("postList", JSON.stringify(favoriteIds));
    localStorage.setItem("previousPage", "/otherProfile");       
    localStorage.setItem("otherProfileTab", "favorites");          
  };

  const buildPostHref = (idPost) => `/post/${idPost}`; 

  return (
    <div className="blogs-containers-post">
      {favorites.map((post) => (
        <div className="post-container" key={post.idPost}>
          <img 
            src={`http://localhost:3001${post.imagePost}`} 
            alt={post.title} 
            className='image-post'
          />
          <p className='date-time'>{post.publicationDate.slice(0, 10)}</p>
          <h3 className='title-post'>{post.title}</h3>
          <p className='description-post'>
            {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
          </p>
          <p className='hashtag-post'>{post.tags}</p>
          <p className='author-post-home'>By: <span>@{post.username}</span></p>
          
          <div className="buttons-post-actions">
            <Link 
              to={`/postComment/${post.idPost}`}
              state={{ from: location.pathname, tab: 'favorites' }}
              onClick={prepNavigateToPost}
            >
              <FaMessage style={{fontSize: "17px"}}/>
            </Link>

            <Link
              to={buildPostHref(post.idPost)}
              state={{ from: location.pathname, tab: 'favorites' }}
              onClick={prepNavigateToPost}
            >
              <IoEyeSharp style={{fontSize: "25px"}}/>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OtherFavorites;
