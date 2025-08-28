// Import Axios
import Axios from 'axios';

// Import Libraries
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function CommunityComment() {
    const { id } = useParams(); // the post id from /post/:id
    const [comments, setComments] = useState([]);

    const navigate = useNavigate();

    const goToProfile = (username) => {
        Axios.get(`http://localhost:3001/getUser/${username}`)
        .then(res => {
        if (res.data.success) {
            localStorage.setItem("otherUser", JSON.stringify(res.data.user));
            navigate("/otherProfile"); // Only browse after saving data
        }
        })
        .catch(err => console.error("Error fetching user data:", err));
    };

    // display comments based on id
    useEffect(() => {
        Axios.get(`http://localhost:3001/comments/${id}`)
        .then(res => {
            if (res.data.success) {
            setComments(res.data.comments);
            }
        })
        .catch(err => console.error("Error loading comments", err));
    }, [id]);

    // If there are no comments, it will display this text:
    if (comments.length === 0) {
        return <p style={{ marginTop: '20px', color: "#999", textAlign: "center"}}>No comments yet.</p>;
    }

  return (
    <div className='community-comment'>
        {comments.map((comment) => (
            <div className="author-post" key={comment.idComment}>
                <div className="first-line-autor">
                    <img src={`http://localhost:3001${comment.imageUser}`} alt="author" />
                    <div className="second-line-author">
                        <div className="inline-info-content">
                            <p id='name-author' onClick={() => goToProfile(comment.username)} style={{ cursor: "pointer" }}>
                                <a>{comment.name}</a>
                            </p>
                            <p id='user-author' onClick={() => goToProfile(comment.username)} style={{ cursor: "pointer" }}>
                                <a>@{comment.username}</a>
                            </p>
                            <p>~</p>
                            <p id='data-time'>{comment.dateComment.slice(0, 10)}</p>
                        </div>
                        
                        <div className="inline-text-content">
                            <p id='replaying-author'>Replying to <span id='replaying'>@{comment.replay || "Author"}</span></p>
                            <p id='descripcion-post'>{comment.descriptionComment}</p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CommunityComment