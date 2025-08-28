import React, { useRef, useEffect, useState } from 'react'

// Import link library
import { useParams, useNavigate } from 'react-router-dom'

// Import Axios
import Axios from 'axios';

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

// Import Icons Libraries
import { IoMdClose } from "react-icons/io";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

function UpdatePost() {
  const { idPost } = useParams();
  const navigate = useNavigate();
  const textareaRef1 = useRef();
  const textareaRef2 = useRef();
  const textareaRef3 = useRef();

  const [viewAges, setViewAges] = useState("everyone");
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [imagePost, setImagePost] = useState("");

  // get posts based on their PostID
  useEffect(() => {
    Axios.get(`http://localhost:3001/getPostById/${idPost}`)
      .then(res => {
        if (res.data.success) {
          const post = res.data.post;
          setTitle(post.title);
          setTags(post.tags);
          setDescription(post.description);
          setViewAges(post.viewsAges);
          setImagePost(`http://localhost:3001${post.imagePost}`);
        }
      });
  }, [idPost]);

  const handleClearPost = () => {
    textareaRef1.current.value = '';
    textareaRef2.current.value = '';
    textareaRef3.current.value = '';
  }

  // update post
  const handleUpdatePost = () => {
    Axios.put(`http://localhost:3001/updatePost/${idPost}`, {
      title,
      tags,
      description,
      viewAges,
      imagePost: imagePost.replace('http://localhost:3001', '') // just the route
    }).then(res => {
      if (res.data.success) {
        toast.success('Post updated successfully!');
        navigate('/myCreations');
      }
    }).catch(err => {
      toast.error("Error updating post");
      console.error("Error updating post", err);
    });
  };

  // -------- IMAGE UPLOAD FLOW --------

  // upload image to the backend
  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    Axios.post("http://localhost:3001/upload", formData)
      .then((res) => {
        if (res.data.success) {
          setImagePost(`http://localhost:3001${res.data.path}`);
          setPreviewImage(null);
        }
      })
      .catch((err) => {
        toast.error("Error uploading image");
        console.error("Error uploading image", err);
      });
  };

  // show confirmation toast before uploading
  const showConfirmImageToast = (file, previewUrl) => {
    setPreviewImage(previewUrl);

    toast.info(
      ({ closeToast }) => (
        <div style={{ width: 300, textAlign: "center" }}>
          <p>Do you want to save this new image?</p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
            <button
              onClick={() => {
                uploadImage(file); // upload the image
                closeToast();
              }}
              style={confirmButtonStyle}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setPreviewImage(null); // clear the preview if you cancel
                closeToast();
              }}
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
        toastId: "confirm-image-upload",
      }
    );
  };

  // when a new image is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      showConfirmImageToast(file, previewUrl);
    }
  };

  // -------- DELETE POST --------
  const handleDelete = (idPost) => {
    Axios.delete(`http://localhost:3001/deletePost/${idPost}`)
      .then(res => {
        if (res.data.success) {
          toast.success('Post successfully deleted.');
          navigate('/myCreations');
        }
      })
      .catch(err => {
        toast.error("Error deleting post");
        console.log("Error deleting post", err);
      });
  };

  const showConfirmToast = (idPost) => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div style={{ width: 300, textAlign: "center" }}>
          <p>Are you sure you want to delete this post?</p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
            <button
              onClick={() => {
                handleDelete(idPost);
                closeToast();
              }}
              style={confirmButtonStyle}
            >
              Confirm
            </button>
            <button onClick={closeToast} style={cancelButtonStyle}>
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
        toastId: `confirm-delete-${idPost}`,
      }
    );
    return toastId;
  };

  // -------- UPDATE POST --------
  const showConfirmUpdateToast = (idPost) => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div style={{ width: 300, textAlign: "center" }}>
          <p>Are you sure you want to update this post?</p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
            <button
              onClick={() => {
                handleUpdatePost();
                closeToast();
              }}
              style={confirmButtonStyle}
            >
              Confirm
            </button>
            <button onClick={closeToast} style={cancelButtonStyle}>
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
        toastId: `confirm-update-${idPost}`,
      }
    );
    return toastId;
  };

  // -------- BUTTON STYLES --------
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

  return (
    <div className='create-post-container'>
        <ToastContainer style={{fontWeight: "bold"}}/>
        <h1>Update Post</h1>
        <div className="create-post-box">
          <div className="first-block-create-post">
              { (previewImage || imagePost) && (
                  <img 
                    src={previewImage ? previewImage : imagePost} 
                    alt="Post image" 
                    className='create-post-image'
                  />
              )}
              
              <input type="file" name="" id="inputImage" onChange={handleImageChange} style={{display: "none"}}/>
              <label htmlFor="inputImage"><FaRegEdit className="edit-icon-create-post" /></label>

              <div className="columns-block-create-post">
                <div className="title-create-post">
                  <h3>Title</h3>
                  <textarea name="title-create" id="title-create" placeholder='Title' ref={textareaRef1} value={title} onChange={(e) => setTitle(e.target.value)}></textarea>
                </div>

                <div className="tag-create-post">
                  <h3>Tags</h3>
                  <textarea name="tags-create" id="tags-create" placeholder='#Tags' ref={textareaRef2} value={tags} onChange={(e) => setTags(e.target.value)}></textarea>
                </div>
              </div>
          </div>

          <div className="description-create">
            <h3>Description</h3>
            <textarea name="description-create" id="description-create" placeholder='Description' ref={textareaRef3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <div className="ages-create-post">
            <label className='button-radio-underage'>
              <input type="radio" name="ageGroup" value="underage" checked={viewAges === "underage"} onChange={() => setViewAges("underage")}/>
              <span>Underage</span>
            </label>

            <label className='button-radio-everyone'>
              <input type="radio" name="ageGroup" value="everyone" checked={viewAges === "everyone"} onChange={() => setViewAges("everyone")}/>
              <span>Everyone</span>
            </label>
            <p>This option is used to determine what type of audience this post is aimed at.</p>
          </div>

          <div className="buttons-create-post">
            <button type="button" id='button-create-post-delete' onClick={() => showConfirmToast(idPost)}><IoMdClose />Delete Post</button>
            <button type="button" id='button-create-post-clear' onClick={handleClearPost}><MdOutlineCleaningServices />Clear Post</button>
            <button
              type="button"
              id='button-create-post-send'
              onClick={() => showConfirmUpdateToast()}
            >
              <GrUpdate />Update Post
            </button>
          </div>
          
        </div>
    </div>
  )
}

export default UpdatePost