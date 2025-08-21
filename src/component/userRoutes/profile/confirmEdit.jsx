import React, { useRef } from 'react'

// Import icon Library
import { IoMdCloseCircle } from "react-icons/io";
import { IoSend } from "react-icons/io5";

// Import custom alert
import { toast } from 'react-toastify';

function ConfirmEdit({ onClose, onVerify, updatedData }) {

  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    // Validate entered data
    if (
      usernameRef.current.value !== user.username ||
      passwordRef.current.value !== user.password ||
      emailRef.current.value !== user.email
    ) {
      toast.error("Incorrect username, email, or password");
      return;
    }

    // Call the update function
    onVerify(updatedData);
    onClose();
  };

  return (
    <div className='perfil-verify-background'>
        <div className="perfil-verify-content">
            <IoMdCloseCircle onClick={onClose} className='dark-mode-close-edit-confirm' />
            <h2>Verify that it is you</h2>
            <form className="form-verify-perfil" onSubmit={handleSubmit}>
                <input type="text" placeholder='Username' ref={usernameRef} required />
                <input type="password" placeholder='Password' ref={passwordRef} required />
                <input type="email" placeholder='Email' ref={emailRef} required />
                <button type="submit" className='button-confirm-verify'><IoSend /> Verify</button>
            </form>
        </div>
    </div>
  )
}

export default ConfirmEdit;