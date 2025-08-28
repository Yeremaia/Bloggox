import React, { useState, useEffect } from 'react'

// Import Link Library
import { useLocation } from 'react-router-dom'

// Import Verify Component
import AboutOtherProfile from './aboutOtherProfile';
import OtherFavorites from './otherFavorites';
import OtherCreations from './otherCreations';

import defaultPhoto from "../../../images/profile/defaultPhoto.png";
import defaultBackgroundPhoto from "../../../images/profile/defaultBackgroundPhoto.jpeg";

function OtherProfile() {

  const location = useLocation();

  const [ aboutShow, setAboutShow ] = useState(true);
  const [ showFavorite, setShowFavorite ] = useState(false);
  const [ showCreations, setShowCreations ] = useState(false);

  const handleShowAbout = () => {
    setShowFavorite(false)
    setShowCreations(false)
  }

  const handleShowFavorite = () => {
    setShowFavorite(prev => !prev)
    setAboutShow(false)
    setShowCreations(false)
  }

  const handleShowCreations = () => {
    setShowCreations(prev => !prev)
    setShowFavorite(false)
    setAboutShow(false)
  }

  useEffect(() => {
    const tab = location.state?.tab || localStorage.getItem("otherProfileTab");

    if (tab === 'favorites') {
      setAboutShow(false);
      setShowFavorite(true);
      setShowCreations(false);
    } else if (tab === 'creations') {
      setAboutShow(false);
      setShowFavorite(false);
      setShowCreations(true);
    }
  }, [location.state]);

  const otherUser = JSON.parse(localStorage.getItem("otherUser"));

  return (
    <div className='other-profile-content'>
        <div className="photo-profile-content">
            <img 
            // This is to show a default image in case there is no image in the db.
              src={
                otherUser.backgroundImage &&
                otherUser.backgroundImage !== null &&
                otherUser.backgroundImage !== undefined &&
                otherUser.backgroundImage.trim() !== ""
                  ? `http://localhost:3001${otherUser.backgroundImage}`
                  : defaultBackgroundPhoto
              }
              alt="Author Image" 
              title='Author Image' 
              className='background-photo-profile'
            />

            <div className="profile-photo">
                <img 
                  src={
                    otherUser.imageUser && otherUser.imageUser.trim() !== ""
                      ? `http://localhost:3001${otherUser.imageUser}`
                      : defaultPhoto
                  }
                  alt="Author background" 
                  className='profile-photo-circle'
                />
            </div>
        </div>
        <div className="name-profile">
            <p id='profile-name'>{otherUser.name}</p>
            <p id='profile-last-name'>{otherUser.lastName}</p>
        </div>
        <p className='username-profile'>@{otherUser.username}</p>

        <div className="buttons-profile">

            {
              showCreations === false && showFavorite === false
              ? 
                <p className="bottom-line-color" onClick={handleShowAbout}>About</p> 
              : 
                <p onClick={handleShowAbout}>About</p>
            }

            {
              showCreations === true 
              ? 
                <p className="bottom-line-color" onClick={handleShowCreations}>Creations</p> 
              : 
                <p onClick={handleShowCreations}>Creations</p>
            }

            {
              showFavorite === true 
              ? 
                <p className="bottom-line-color" onClick={handleShowFavorite}>Favorites</p> 
              : 
                <p onClick={handleShowFavorite}>Favorites</p>
            }
        </div>

        <div className="content-box-profile">
          {
            aboutShow == false && showFavorite == false && showCreations == false 
            ? 
            <AboutOtherProfile /> 
            : 
            (aboutShow && <AboutOtherProfile />) || (showFavorite && <OtherFavorites />) || (showCreations && <OtherCreations />)
          }

        </div>
    </div>
  )
}

export default OtherProfile