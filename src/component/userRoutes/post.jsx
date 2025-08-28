import React, { useEffect, useState } from 'react';

// Icons Libraries
import { IoEyeSharp } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";

// Import Images
import frozono from "../../images/profile/defaultPhoto.png";

// Import Libraries
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';

// Import components
import ImagePostAuthor from './postComponent/imagePostAuthor';
import CommunityComment from './postComponent/communityComment';

import { ToastContainer, toast } from 'react-toastify';

function Post() {
  const { id } = useParams();
  const [postList, setPostList] = useState([]);
  const [post, setPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Numeric IDs of the logged-in user's favorite posts
  const [favorites, setFavorites] = useState([]);

  // Load user favorites
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      Axios.get(`http://localhost:3001/favorites/${user.idUser}`)
        .then(res => {
          if (res.data.success) {
            const favIds = res.data.favorites.map(fav => Number(fav.idPost));
            setFavorites(favIds);
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  // Load browsable list + current post
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("postList")) || [];

    // we make sure they are all numbers
    const numericList = list.map(n => Number(n));
    setPostList(numericList);

    const current = numericList.indexOf(Number(id));
    setCurrentIndex(current);

    Axios.get(`http://localhost:3001/getPost/${id}`)
      .then((res) => {
        if (res.data.success) {
          setPost(res.data.post);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  // This is to change to next/previous post
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = postList[currentIndex - 1];
      window.location.href = `/post/${prevId}`;
    }
  };
  
  const handleNext = () => {
    if (currentIndex < postList.length - 1) {
      const nextId = postList[currentIndex + 1];
      window.location.href = `/post/${nextId}`;
    }
  };

  if (!post) return <p>Loading post...</p>;

  // Add / Remove Favorite
  const toggleFavorite = (idPost) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const numericId = Number(idPost);

    if (favorites.includes(numericId)) {
      // remove from favorites
      Axios.delete(`http://localhost:3001/removeFavorite/${user.idUser}/${numericId}`)
        .then((res) => {
          if (res.data.success) {
            toast.info("Successfully removed from favorites");
            setFavorites(prev => prev.filter(favId => favId !== numericId));
          }
        })
        .catch(err => console.error("Error removing favorite:", err));
    } else {
      // add to favorites
      Axios.post("http://localhost:3001/addFavorite", {
        idUser: user.idUser,
        idPost: numericId
      })
      .then((res) => {
        if (res.data.success) {
          setFavorites(prev => [...prev, numericId]);
          toast.success("Successfully added to favorites");
        }
      })
      .catch(err => console.error("Error adding favorite:", err));
    }
  };

  const isFav = favorites.includes(Number(post.idPost));

  return (
    <div className='post-content'>
      <ToastContainer style={{fontWeight: "bold"}}/>
      <div className="separation-post">

        {/* We pass the handles to the imagePostAuthor component */}
        <ImagePostAuthor
          imageUrl={`http://localhost:3001${post.imagePost}`}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="content-users-posts">
          <div className="users-posts">
            <div className="author-post">
              <div className="first-line-autor">
                <img 
                  src={post.imageUser ? `http://localhost:3001${post.imageUser}` : frozono} 
                  alt="Author" 
                  title='Author'
                />
                <div className="second-line-author">
                  <div className="inline-info-content">
                    <p id='name-author'>
                      <Link 
                        to="/otherProfile" 
                        // We pass the data of the user who created the post, to display in otherProfile.
                        onClick={() => {
                          const otherUserData = {
                            idUser: post.idUser,
                            name: post.name,
                            lastName: post.lastName,
                            username: post.username,
                            imageUser: post.imageUser,
                            backgroundImage: post.backgroundImage
                          };
                          localStorage.setItem("otherUser", JSON.stringify(otherUserData));
                        }}
                      >
                        {post.name}
                      </Link>
                    </p>

                    <p id='user-author'>
                      <Link 
                        to="/otherProfile" 
                        onClick={() => {
                          const otherUserData = {
                            idUser: post.idUser,
                            name: post.name,
                            lastName: post.lastName,
                            username: post.username,
                            imageUser: post.imageUser,
                            backgroundImage: post.backgroundImage
                          };
                          localStorage.setItem("otherUser", JSON.stringify(otherUserData));
                        }}
                      >
                        @{post.username}
                      </Link>
                    </p>
                    <p id='separations'>~</p>
                    <p id='data-time'>{post.publicationDate.slice(0, 10)}</p>
                  </div>

                  <div className="inline-text-content">
                    <h2 id='title-post'>{post.title}</h2>
                    <p id='descripcion-post'>
                      {post.description.length > 100 
                        ? post.description.substring(0, 100) + "..." 
                        : post.description}
                    </p>
                    <p id='hashtag-post-author'>
                      {post.tags.length > 50 ? post.tags.substring(0, 50) + "..." : post.tags}
                    </p>
                  </div>

                </div>
              </div>
              
              <div className="buttons-post-actions">
                <Link to={`/postComment/${post.idPost}`}>
                  <FaMessage style={{fontSize: "17px"}}/>
                </Link>

                <MdFavorite
                  onClick={() => toggleFavorite(post.idPost)}
                  style={{
                    fontSize: "23px",
                    cursor: "pointer",
                    color: isFav ? "red" : "gray"
                  }}
                />

                <Link to={`/postUser/${post.idPost}`}>
                  <IoEyeSharp style={{fontSize: "25px"}}/>
                </Link>
              </div>
            </div>

            <h3>Community Feedback</h3>
            <CommunityComment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;