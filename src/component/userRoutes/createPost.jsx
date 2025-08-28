import React, { useRef, useState } from 'react'
import Axios from 'axios';

// Random image
import randomImage from '../../images/blogs/unknow.jpg'

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

// Import Icons Libraries
import { IoMdClose } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function CreatePost() {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imagePost, setImagePost] = useState('')
    const [tags, setTags] = useState('')
    const [viewAges, setViewAges] = useState(0);
    
    const handleTitle = (e) => {
      setTitle(e.target.value)
    }
  
    const handleDescription = (e) => {
      setDescription(e.target.value)
    }
  
    const handleImagePost = async (e) => {

      // e.target.files[0]: Accesses the first file the user selected.
      const file = e.target.files[0];
      // If file is null or undefined, do nothing (return)
      if (!file) return;

      // Create a FormData to send the file
      const formData = new FormData();
      // add the file named "image" to the form to be submitted to the backend.
      formData.append("image", file);

      // Send the file to the server
      try {
        const response = await Axios.post("http://localhost:3001/upload", formData, {
          // This is necessary so that the backend understands that it is receiving a file
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        // Handling server response
        if (response.data.success) {
          setImagePost(response.data.path);
        } else {
          toast.error("Image upload failed");
        }
      } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
      }
    };
  
    const handleTags = (e) => {
      setTags(e.target.value)
    }
  
    // get current date
    const currentDate = () => {
      const date = new Date();
      return date.toISOString().split('T')[0];
    };

    const publicationDate = currentDate();

    const user = JSON.parse(localStorage.getItem("user"));
    const idUser = user?.idUser || null;

    const textareaRef1 = useRef();
    const textareaRef2 = useRef();
    const textareaRef3 = useRef();

    const prueba = useRef();

    // Clear the textarea and the image of the post
    const handleClearPost = () => {
      textareaRef1.current.value = '';
      textareaRef2.current.value = '';
      textareaRef3.current.value = '';
      
      prueba.current.src = randomImage;
    }
    
    const addPost = () => {
      if ((!title.trim() || !description.trim() || !tags.trim() || !idUser || !imagePost)) {
        return toast.error('You must fill in all fields, including an image');
      } else {
        Axios.post("http://localhost:3001/create-post", {
          title,
          description,
          imagePost,
          tags,
          viewAges,
          publicationDate,
          idUser
        }).then(() => {
          toast.success('The post was created successfully');

          setTitle('');
          setDescription('');
          setTags('');
          setViewAges(0);
          setImagePost('');

          console.log(title, description, imagePost, tags, viewAges, publicationDate, idUser);
        });
      }
    };

  return (
    <div className='create-post-container'>
        <h1>Create Post</h1>
        <ToastContainer style={{fontWeight: "bold"}}/>
        <div className="create-post-box">
          <div className="first-block-create-post">
              {imagePost 
                ? 
                  imagePost && (
                    <img src={imagePost === 'default' || !imagePost ? randomImage : `http://localhost:3001${imagePost}`}  alt="Post preview" className='create-post-image ' ref={prueba}/>
                  )
                :
                  <img src={randomImage} alt="random image" className='create-post-image '/>
              }
              <input type="file" id="inputImage" onChange={handleImagePost} style={{ display: "none" }} />
              <label htmlFor="inputImage"><FaRegEdit className="edit-icon-create-post" /></label>
              <div className="columns-block-create-post">
                <div className="title-create-post">
                  <h3>Title</h3>
                  <textarea name="title-create" id="title-create" ref={textareaRef1} onChange={handleTitle} placeholder='Title' value={title}></textarea>
                </div>

                <div className="tag-create-post">
                  <h3>Tags</h3>
                  <textarea name="tags-create" id="tags-create" ref={textareaRef2} onChange={handleTags} placeholder='#Tags' value={tags}></textarea>
                </div>
              </div>
          </div>

          <div className="description-create">
            <h3>Description</h3>
            <textarea name="description-create" id="description-create" ref={textareaRef3} placeholder='Description' value={description} onChange={handleDescription}></textarea>
          </div>

          <div className="ages-create-post">
            <label className='button-radio-underage'>
              <input 
                type="radio" 
                name="ageGroup" 
                value={0} 
                checked={viewAges === 0} 
                onChange={(e) => setViewAges(Number(e.target.value))}
              />
              <span>Underage</span>
            </label>

            <label className='button-radio-everyone'>
              <input 
                type="radio" 
                name="ageGroup" 
                // The value that will be assigned if that button is selected
                value={1} 
                // Check the button if the viewAges value is equal to the value (0 or 1)
                checked={viewAges === 1} 
                // Changes the viewAges state to the value of the selected button
                onChange={(e) => setViewAges(Number(e.target.value))}
              />
              <span>Everyone</span>
            </label>
            <p>This option is used to determine what type of audience this post is aimed at.</p>
          </div>
          <div className="buttons-create-post">
            <button type="button" id='button-create-post-clear' onClick={handleClearPost}><MdOutlineCleaningServices />Clear Post</button>
            <button type="button" id='button-create-post-send' onClick={addPost}><IoSendSharp />Send Post</button>
          </div>
        </div>
    </div>
  )
}

export default CreatePost