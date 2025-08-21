// Import Icons
import { IoMdClose } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineCleaningServices } from "react-icons/md";

// Import image post component
import  ImagePostAuthor  from './imagePostAuthor'

// Import Post Image
import frozono from "../../../images/profile/defaultPhoto.png";

// Import Libraries
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';

function PostComment() {

    const { idPost } = useParams();
    const [post, setPost] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const inputRef = useRef(null);

    // get the post based on the idPost
    useEffect(() => {
        Axios.get(`http://localhost:3001/getPost/${idPost}`)
            .then((res) => {
            if (res.data.success) {
                setPost(res.data.post);
            }
            })
            .catch(err => console.error(err));
    }, [idPost]);

    // clear comment
    const deleteComment = () => {
        inputRef.current.value = ""
        inputRef.current.focus()
    }

    // submit the comment
    const handleCommentSubmit = () => {
        const commentText = inputRef.current.value.trim();

        if (!commentText) return toast.error("Write something first!");

        // add the comment to the database
        Axios.post("http://localhost:3001/addComment", {
            idPost,
            idUser: user.idUser,
            descriptionComment: commentText,
            replay: post.username
        }).then(res => {
            if (res.data.success) {
                toast.success("Comment saved!");
                inputRef.current.value = "";
            } else {
                toast.error("Failed to save comment");
            }
        }).catch(err => console.error("Comment error", err));
    };

    if (!post) return <p>Loading post...</p>;

  return (
    <div className='post-content'>
        <ToastContainer style={{fontWeight: "bold"}}/>
        <div className="separation-post">
            <ImagePostAuthor
            imageUrl={`http://localhost:3001${post.imagePost}`}
            />

            <div className="content-users-posts">
                <div className="users-posts">
                    <div className="author-post">
                        <div className="first-line-autor">
                            <img src={post.imageUser ? `http://localhost:3001${post.imageUser}` : frozono} alt="Author" title='Author'/>
                            <div className="second-line-author">
                                <div className="inline-info-content">
                                    <p id='name-author'>{post?.name}</p>
                                    <p id='user-author'><a> @{post?.username}</a></p>
                                    <p id='separations'>~</p>
                                    <p id='data-time'>{post.publicationDate.slice(0, 10)}</p>
                                </div>
                                <div className="inline-text-content">
                                    <h2 id='title-post'>{post?.title}</h2>
                                    <p id='descripcion-post'>{post?.description}</p>
                                    <p id='hashtag-post-author'>{post?.hashtag}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="author-post comments-replaying-author">
                        <div className="close-comments">
                            <Link to={`/post/${post.idPost}`}><IoMdClose style={{fontSize: "22px", cursor: "pointer", marginLeft: "5px"}}/></Link>
                        </div>
                        <div className="first-line-autor">
                            <img src={user.imageUser ? `http://localhost:3001${user.imageUser}` : frozono} alt="You photo" title='Name author 2' />
                            <div className="second-line-author">
                                <div className="inline-info-content">
                                    <p id='name-author'>{user?.name}</p>
                                    <p id='user-author'>@{user?.username}</p>
                                </div>
                                <div className="inline-text-content">
                                    <p id='replaying-author'>Replying to <span id='replaying'>@{post?.username}</span></p>
                                    <textarea wrap='soft' name="comment-replaying" className="comment-replaying" ref={inputRef} rows="7" cols="50" placeholder='Write a comment.'></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div className="buttons-post-actions">

                            <button type="button" className='buttons-comment-replaying' onClick={deleteComment}><MdOutlineCleaningServices style={{marginRight: "8px"}}/>Clear Comment</button>
                            <button type="button" className='buttons-comment-replaying' onClick={handleCommentSubmit}><IoSendSharp style={{marginRight: "8px"}} /> Comment</button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostComment