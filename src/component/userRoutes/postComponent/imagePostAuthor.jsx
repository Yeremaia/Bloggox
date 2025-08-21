// Icons Libraries
import { TiArrowRightThick, TiArrowLeftThick, TiArrowBack } from "react-icons/ti";

import React from "react";

// Import URL library
import { useNavigate, useLocation } from 'react-router-dom';

function ImagePostAuthor({ imageUrl, onPrev, onNext }) {

  const navigate = useNavigate();
  const location = useLocation();

  const isUserPost = location.pathname.includes('/userPost');
  const isPostComment = location.pathname.includes('/postComment');

  const handleBack = (e) => {
    e.preventDefault();

    // 1- Trying to return using React Router state
    // Extracts two pieces of information from the previous navigation (if any):
    const fromState = location.state?.from;
    const tabState = location.state?.tab;
    if (fromState) {
      navigate(fromState, { state: { tab: tabState } });
      return;
    }

    // Fallback using localStorage
    const prevPage = localStorage.getItem("previousPage");
    const tabLS = localStorage.getItem("otherProfileTab");
    if (prevPage) {
      navigate(prevPage, { state: { tab: tabLS } });
      return;
    }

    // Last resort: Home
    navigate("/");
  };

  return (
    <div className='image-container-component'>

        <a href="#" onClick={handleBack}><TiArrowBack className='close-image-post' title='Back'/></a>
        <img src={imageUrl} alt="imagePost" className='main-post-image'/>

        {!isPostComment && !isUserPost && (
          <div className="arrows-image">
            <TiArrowLeftThick 
              style={{ borderRadius: "50%", cursor: "pointer" }} 
              title='Previous Image' 
              onClick={onPrev} 
            />
            
            <TiArrowRightThick 
              style={{ borderRadius: "50%", cursor: "pointer" }} 
              title='Next Image' 
              onClick={onNext} 
            />
          </div>
        )}
    </div>
  )
}

export default ImagePostAuthor
