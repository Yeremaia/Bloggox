import React, { useEffect, useState } from 'react';

// Import Axios
import Axios from 'axios';

// Icons Libraries
import { FaMessage } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { BsEyeSlashFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';

// Import Post Image
import frozono from "../../../images/profile/defaultPhoto.png";

// Import Routes Libraries
import { Link, useParams  } from 'react-router-dom';

// Importar Image Post
import ImagePostAuthor from './imagePostAuthor';

function PostUser() {

    const { id } = useParams(); // capture the idPost
    const [post, setPost] = useState(null);

    const [favorites, setFavorites] = useState([]);

    // save post to favorites
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        Axios.get(`http://localhost:3001/favorites/${user.idUser}`)
          .then(res => {
            if (res.data.success) {
              const favIds = res.data.favorites.map(fav => fav.idPost);
              setFavorites(favIds);
            }
          })
          .catch(err => console.error(err));
      }
    }, []);

    // get posts based on their idPost
    useEffect(() => {
        Axios.get(`http://localhost:3001/getPost/${id}`)
        .then((res) => {
            if (res.data.success) {
            setPost(res.data.post);
            }
        })
        .catch(err => console.error(err));
    }, [id]);

  if (!post) return <p>Loading...</p>;

  // toggle to add or remove from favorites
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
    <div className='post-content'>
        <ToastContainer style={{fontWeight: "bold"}}/>
        <div className="separation-post user-view-post">

            <ImagePostAuthor imageUrl={`http://localhost:3001${post.imagePost}`} />

            <div className="content-users-posts">
                <div className="users-posts">
                    <div className="author-post content-view-post">
                        <div className="first-line-autor">
                            <img src={post.imageUser ? `http://localhost:3001${post.imageUser}` : frozono} alt="Author" title='Author'/>
                            <div className="second-line-author">
                                <div className="inline-info-content">
                                    <p id='name-author'>
                                        <Link to="/otherProfile" onClick={() => localStorage.setItem("otherUser", JSON.stringify(post))}>
                                            {post.name}
                                        </Link>
                                    </p>
                                    <p id='user-author'>
                                        <Link to="/otherProfile" onClick={() => localStorage.setItem("otherUser", JSON.stringify(post))}>
                                        @{post.username}
                                        </Link>
                                    </p>
                                    <p id='separations'>~</p>
                                    <p id='data-time'>{post.publicationDate.slice(0, 10)}</p>
                                </div>
                                <div className="inline-text-content inline-view-post">
                                    <h2 id='title-post'>{post.title}</h2>
                                    <p id='descripcion-post' className='description-view-post'>{post.description}
                                    </p>
                                    <p id='hashtag-post-author'>{post.tags}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="buttons-view-post">
                        <Link to={`/postComment/${post.idPost}`}>
                            <FaMessage style={{fontSize: "17px"}}/>
                        </Link>
                        <MdFavorite 
                            style={{fontSize: "23px", cursor: "pointer", color: favorites.includes(post.idPost) ? "red" : "gray"}}
                            onClick={() => toggleFavorite(post.idPost)}
                        />
                        <Link to={`/post/${post.idPost}`}><BsEyeSlashFill style={{fontSize: "25px", marginTop: "-2px"}}/></Link>
                    </div>           
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostUser