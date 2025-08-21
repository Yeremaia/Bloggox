import React, { useEffect, useState } from 'react';
import Axios from 'axios';

// Icons Libraries
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

// Import Img for darkMode
import { useDarkMode } from '../darkMode/darkModeContext';
import ImageNotYet from '../../images/logos/favoriteNotFound.png';
import ImageNotYetDark from '../../images/logos/logoError.png';

import { Link } from 'react-router-dom';

function MyCreations() {

  const { darkMode } = useDarkMode();
  const [myPosts, setMyPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Load user posts (add [] as a dependency to avoid continuous re-fetching)
  useEffect(() => {
    if (!user?.idUser) return;
    Axios.get(`http://localhost:3001/myCreations/${user.idUser}`)
      .then(res => {
        if (res.data.success) setMyPosts(res.data.posts);
      })
      .catch(err => console.error("Error loading posts", err));
  }, [user?.idUser]);

  // Delete post (without confirmation. Confirmation is done by the toast)
  const handleDelete = (idPost) => {
    Axios.delete(`http://localhost:3001/deletePost/${idPost}`)
      .then(res => {
        if (res.data.success) {
          setMyPosts(prev => prev.filter(p => p.idPost !== idPost));
          toast.success("Post successfully deleted.");
        } else {
          toast.error("The post could not be deleted.");
        }
      })
      .catch(err => {
        console.error("Error deleting post", err);
        toast.error("There was an error deleting the post.");
      });
  };

  // Show confirmation toast
  const showConfirmToast = (idPost) => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div style={{ width: 300, textAlign: "center" }}>
          <p>Are you sure you want to continue?</p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
            <button
              onClick={() => {
                handleDelete(idPost);
                closeToast(); // just close this toast
              }}
              style={confirmButtonStyle}
            >
              Confirm
            </button>
            <button
              onClick={closeToast}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        position: "top-center",
        toastId: `confirm-delete-${idPost}`, // avoid duplicates
      }
    );
    return toastId;
  };

  // Simple inline styles for custom toasts/alerts
  const confirmButtonStyle = {
    border: "1px solid green",
    padding: "6px 14px",
    color: "green",
    fontWeight: "bold",
    background: "transparent",
    cursor: "pointer",
  };
  const cancelButtonStyle = {
    border: "1px solid red",
    padding: "6px 14px",
    color: "red",
    fontWeight: "bold",
    background: "transparent",
    cursor: "pointer",
  };

  // Empty state
  if (myPosts.length === 0) {
    return (
      <div className="blogs-home">
        <ToastContainer style={{ fontWeight: "bold" }} />
        <p className='no-favorite-yet'>
          You have no posts created.
          <img
            src={darkMode ? ImageNotYetDark : ImageNotYet}
            alt="No posts"
          />
        </p>
      </div>
    );
  }

  return (
    <div className="blogs-home">
        <h2>My Creations</h2>
          <ToastContainer style={{fontWeight: "bold"}}/>
          <div className="blogs-containers-post">   
            
            {/* This condition says: if there is no post, show the next message, otherwise show all posts. */}
            {myPosts.length === 0 ? (
              <p className='no-favorite-yet'>You don't have a post created yet. <img src={ImageNotYet} /></p>
            ) : (
              // This loops through each element of the "myPosts" array and performs an operation on each "post", returning a new array with the results.
              myPosts.map((post) => (
                <div className="post-container" key={post.idPost}>

                  <div className="buttons-my-creations">

                    <span onClick={() => showConfirmToast(post.idPost)}>
                      <RiDeleteBin6Fill title='Delete' style={{ fontSize: "30px", color: "white" }} />
                    </span>
                    
                    <Link to={`/updatePost/${post.idPost}`}>
                      <FaRegEdit title='Edit Post' style={{ fontSize: "30px", color: "white" }} />
                    </Link>

                  </div>

                  <img src={`http://localhost:3001${post.imagePost}`} alt="Post" className='image-post' />

                  {/* This only shows the year */}
                  <p className='date-time'>{post.publicationDate.slice(0, 10)}</p>

                  {/* This will cut off the text content if its characters are greater than 40. */}
                  <h3 className='title-post'>{post.title.length > 40 ? post.title.substring(0, 40) + "..." : post.title}</h3>
                  <p className='description-post'>
                    {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
                  </p>
                  <p className='hashtag-post'>{post.tags.length > 50 ? post.tags.substring(0, 50) + "..." : post.tags}</p>
                  <p className='author-post-home'>By: <span>@{post.username}</span></p>

                  <div className="buttons-post-actions">
                    <Link 
                      to={`/postComment/${post.idPost}`}
                      onClick={() => {
                        // Save the current path (the one you're coming from) to localStorage under the previousPage key. For example, if you're in /home, it will save "previousPage": "/home"
                        localStorage.setItem("previousPage", window.location.pathname);
                        localStorage.setItem("postSource", "home");
                      }}
                    >
                      <FaMessage style={{fontSize: "20px", marginTop: "5px"}}/>
                    </Link>
                    <Link 
                      to={`/post/${post.idPost}`}
                      onClick={() => {
                        localStorage.setItem("previousPage", window.location.pathname);
                        localStorage.setItem("postSource", "myCreations");
                        // Saves the list of visible post IDs
                        localStorage.setItem("postList", JSON.stringify(myPosts.map(p => p.idPost)));
                      }}
                    >
                      <IoEyeSharp style={{ fontSize: "27px" }} />
                    </Link>
                  </div>
                </div>
              ))
            )}

        </div>
    </div>
  )
}

export default MyCreations