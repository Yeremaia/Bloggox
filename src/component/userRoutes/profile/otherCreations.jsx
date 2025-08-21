import React, { useEffect, useState, useMemo } from 'react'

// Import Axios
import Axios from 'axios';

// Link Library
import { Link, useLocation } from 'react-router-dom'

// Icons Libraries
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";

function OtherCreations() {

    const [creations, setCreations] = useState([]);
    const otherUser = JSON.parse(localStorage.getItem("otherUser"));
    const location = useLocation(); // current path (/otherProfile)

    // get posts created by other users
    useEffect(() => {
    if (otherUser?.idUser) {
        Axios.get(`http://localhost:3001/myCreations/${otherUser.idUser}`)
        .then((res) => {
            if (res.data.success) {
            setCreations(res.data.posts);
            }
        })
        .catch(err => console.error("Error loading creations:", err));
    }
    }, [otherUser]);

  // List of IDs (memoized so as not to recalculate in each render)
  const creationIds = useMemo(() => creations.map(p => p.idPost), [creations]);

  if (creations.length === 0) {
    return <p style={{ textAlign: "center", margin: "20px 0", fontSize:"20px" }} className='dark-mode-no-yet'>No creations yet.</p>;
  }

  // Function that saves the context before going to the post
  const prepNavigateToPost = (e) => {
    e.preventDefault();

    localStorage.setItem("postList", JSON.stringify(creationIds));    // key that Post.jsx uses for arrows
    localStorage.setItem("previousPage", "/otherProfile");            // for Back button (fallback)
    localStorage.setItem("otherProfileTab", "creations");             // to reopen the Creations tab
  };

  return (
    <div className="blogs-containers-post">
      {creations.map((post) => (
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
                onClick={() => prepNavigateToPost(post.idPost)}
            >
                <FaMessage style={{fontSize: "17px"}}/>
            </Link>

            <Link 
                to={`/post/${post.idPost}`}
                state={{ from: location.pathname, tab: 'creations' }}
                onClick={() => prepNavigateToPost(post.idPost)}
            >
                <IoEyeSharp style={{fontSize: "25px"}}/>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OtherCreations