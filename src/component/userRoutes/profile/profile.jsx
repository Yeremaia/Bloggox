import { useState } from 'react'

// Import Default images
import defaultPhoto from "../../../images/profile/defaultPhoto.png";
import defaultBackgroundPhoto from "../../../images/profile/defaultPhoto.png";

// Import Icon Library
import { FaRegEdit } from "react-icons/fa";
import { MdEdit, MdCancel } from "react-icons/md";

// Import Axios
import Axios from 'axios';

// Import custom alert
import { ToastContainer, toast } from 'react-toastify';

// Import Components
import AboutProfile from './aboutProfile';
import EditProfile from './editProfile';

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [photoImage, setPhotoImage] = useState(
    user.imageUser && user.imageUser !== '' 
      ? `http://localhost:3001${user.imageUser}` 
      : defaultPhoto
  );

  const [backgroundImage, setBackgroundImage] = useState(
    user.backgroundImage && user.backgroundImage !== '' 
      ? `http://localhost:3001${user.backgroundImage}` 
      : defaultBackgroundPhoto
  );
  
  const [previewProfileImage, setPreviewProfileImage] = useState(photoImage);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState(backgroundImage);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(null);

  const [aboutShow, setAboutShow] = useState(true);
  const [editProfile, setEditProfile] = useState(false);

  // This is to change the profile image
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'profile') {
      setSelectedProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
      showConfirmToast(() => handleUploadImage(file, 'profile'));
    } else {
      setSelectedBackgroundImage(file);
      setPreviewBackgroundImage(URL.createObjectURL(file));
      showConfirmToast(() => handleUploadImage(file, 'background'));
    }
  };

  // update profile image
  const handleUploadImage = async (file, imageType) => {
    toast.dismiss();

    // Prepare formData for upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user.idUser);

    try {
      // Upload the image to the server
      const uploadRes = await Axios.post("http://localhost:3001/upload", formData);
      const imagePath = uploadRes.data.path; // Relative path

      // Update the image in the database
      await Axios.put("http://localhost:3001/updateUserImage", {
        userId: user.idUser,
        imageType,
        imagePath
      }, { headers: { "Content-Type": "application/json" } });

      // Update localStorage
      const updatedUser = {
        ...user,
        [imageType === "profile" ? "imageUser" : "backgroundImage"]: imagePath
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the status on the screen
      if (imageType === "profile") {
        setPhotoImage(`http://localhost:3001${imagePath}`);
        setSelectedProfileImage(null);
      } else {
        setBackgroundImage(`http://localhost:3001${imagePath}`);
        setSelectedBackgroundImage(null);
      }

      toast.success(`Image of ${imageType === "profile" ? "perfil" : "background"} updated`);

    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Error uploading image");
    }
  };

  // cancel the image change
  const handleCancel = (type) => {
    toast.dismiss();
    if (type === 'profile') {
      setPreviewProfileImage(photoImage);
      setSelectedProfileImage(null);
    } else {
      setPreviewBackgroundImage(backgroundImage);
      setSelectedBackgroundImage(null);
    }
    toast.info("Cancel");
  };

  // Toast to confirm/cancel photo update
  const showConfirmToast = (onConfirm) => {
    toast.info(
      <div style={{ width: "300px" }}>
        <p>Are you sure you want to continue?</p>
        <button onClick={onConfirm} style={confirmButtonStyle}>Confirm</button>
        <button onClick={() => handleCancel(selectedProfileImage ? 'profile' : 'background')} style={cancelButtonStyle}>Cancel</button>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false, position: "top-center" }
    );
  };

  // toast button styles
  const confirmButtonStyle = { marginRight: 10, border: "1px solid green", padding: "7px 17px", color: "green", fontWeight: "bold" };
  const cancelButtonStyle = { border: "1px solid red", padding: "7px 17px", color: "red", fontWeight: "bold" };

  return (
    <div className='other-profile-content'>
      <ToastContainer />
      <div className="photo-profile-content">
        <img src={previewBackgroundImage} alt="Background" className='background-photo-profile' />

        <div className="profile-photo">
          <img src={previewProfileImage} alt="Profile" className='profile-photo-circle' />
          <input type="file" id="inputProfile" onChange={(e) => handleFileChange(e, 'profile')} style={{ display: "none" }} />
          <label htmlFor="inputProfile"><FaRegEdit className='edit-button-photo' title='Edit Photo' /></label>
        </div>

        <input type="file" id="inputImageBackground" onChange={(e) => handleFileChange(e, 'background')} style={{ display: "none" }} />

        <label htmlFor='inputImageBackground' className='button-edit-background'>
          <FaRegEdit className='img-button-background' /> Edit Background Photo
        </label>
        
      </div>

      <div className="name-profile">
        <p id='profile-name'>{user.name}</p>
        <p id='profile-last-name'>{user.lastName}</p>
      </div>
      <p className='username-profile'>@{user.username}</p>

      <div className="buttons-profile">

        <p className={aboutShow && !editProfile ? "bottom-line-color" : ""} onClick={() => { setAboutShow(true); setEditProfile(false);}}>About</p>

        <button type='button' className={editProfile ? "border-button-edit-profile edit-button-profile-change" : "edit-button-profile-change"} 
          onClick={() => {
            setEditProfile(prev => {
              const newEditState = !prev;
              setAboutShow(!newEditState); // If we are leaving edit mode, show About
              return newEditState;
            });
        }} >
          {editProfile ? <MdCancel className='icon-button-profile' /> : <MdEdit className='icon-button-profile' />}
          {editProfile ? "Cancel" : "Edit Profile"}
        </button>

      </div>

      <div className="content-box-profile">
        {aboutShow && <AboutProfile />}
        {editProfile && <EditProfile />}
      </div>
    </div>
  );
}

export default Profile;
