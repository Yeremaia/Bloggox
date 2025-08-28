import React, { useEffect, useState } from 'react';

// Import Axios
import Axios from 'axios';

// Link Library
import { Link } from 'react-router-dom'

// Import Images
import backgroundGif from '../../images/blogs/fondoGif.gif'

// Icons Libraries
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";

import { ToastContainer, toast } from 'react-toastify';

function Home() {

    const [posts, setPosts] = useState([]);

    const [userYear, setUserYear] = useState(null);

    // Calculate user age
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserYear(parseInt(user.year));
      }
    }, []);

    const visiblePosts = posts.filter(post => {
      if (userYear === null) return false; // Do not show anything if the user has not yet loaded

      // If the user was born after 2007 > minor
      if (userYear > 2007) {
        return post.viewsAges === 0; // Show only posts for minors
      }

      // If the user was born in 2007 or earlier > greater than or equal to 18 years old
      return true; // Show all posts
    });

    useEffect(() => {
      Axios.get("http://localhost:3001/showPost")
        .then((res) => {
          if (res.data.success) {
            setPosts(res.data.posts);
          }
        })
        .catch((err) => console.error(err));
    }, []);


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

    const toggleFavorite = (idPost) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("You must be logged in.");

      if (favorites.includes(idPost)) {
        // If it's already in your favorites, remove it.
        Axios.delete(`http://localhost:3001/removeFavorite/${user.idUser}/${idPost}`)
          .then((res) => {
            if (res.data.success) {
              toast.info("Successfully removed from favorites")
              setFavorites(prev => prev.filter(favId => favId !== idPost));
            }
          })
          .catch(err => console.error("Error removing favorite:", err));
      } else {
        // If it is not there, add it
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
    <div className='home-container'>
      <ToastContainer style={{fontWeight: "bold"}} className='ola' />
      <div className="introduction">
        <div className="container-text-home">
          <h1>Welcome to a world of exploration and excitement on this blog!</h1>
        </div>
        <img 
          src={backgroundGif} 
          alt="background gif"
        />
      </div>

      <div className="blogs-home">
        <h2>Blogs from our community</h2>
        <div className="blogs-containers-post">

          {/* If there is no post, it will show this comment: */}
          {visiblePosts.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", width: "100%",margin: "20px 0 40px 0" }}>
              No posts available at the moment.
            </p>
          ) : (
            // if there is a post, show all posts:
            visiblePosts.map((post, index) => (
              <div className="post-container" key={index}>
                <img src={`http://localhost:3001${post.imagePost}`} title='Post' className='image-post'/>
                <p className='date-time'>{post.publicationDate.slice(0, 10)}</p>
                <h3 className='title-post'>{post.title.length > 40 ? post.title.substring(0, 40) + "..." : post.title}</h3>
                
                <p className='description-post'>
                  {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
                </p>

                <p className='hashtag-post'>{post.tags.length > 50 ? post.tags.substring(0, 50) + "..." : post.tags}</p>
                <p className='author-post-home'>By: <Link to="/otherProfile"><span>@{post.username}</span></Link></p>

                <div className="buttons-post-actions mb-1">
                    <Link 
                      to={`/postComment/${post.idPost}`}
                      onClick={() => {
                        localStorage.setItem("previousPage", window.location.pathname);
                        localStorage.setItem("postSource", "home");
                      }}
                    >
                      <FaMessage style={{fontSize: "20px", marginTop: "5px"}}/>
                    </Link>

                    <MdFavorite
                      className='favorite-dark-mode'
                      style={{ 
                        fontSize: "26px",  
                        marginTop: "5px", 
                        cursor: "pointer", 
                        color: favorites.includes(post.idPost) ? "red" : "gray"
                      }}
                      onClick={() => toggleFavorite(post.idPost)}
                    />

                    <Link 
                      to={`/post/${post.idPost}`}
                      onClick={() => {
                        localStorage.setItem("previousPage", window.location.pathname);
                        localStorage.setItem("postSource", "home");
                        localStorage.setItem("postList", JSON.stringify(posts.map(p => p.idPost)));
                      }}
                    >
                      <IoEyeSharp style={{ fontSize: "27px", marginTop: "5px" }} />
                    </Link>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  )
}

export default Home