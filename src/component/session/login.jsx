import React, { useState } from 'react';

// Router Libraries
import { Link, useNavigate } from 'react-router-dom'

// Import CSS
import '../../styles/app.css'

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

// Background Image
import background from '../../images/blogs/fondo2.png'

// Import Axios
import axios from 'axios';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const navigate = useNavigate();

    // Email and password verification
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", {
            email,
            password
        }).then((response) => {
            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate('/home');
            } else {
                toast.error('The email or password does not exist');
            }
        })
    }

  return (
    <div className="session-background">
        <div className='login-container'>
            <ToastContainer style={{fontWeight: 'bold'}} />
            <div className="image-container-login">
                <img src={background} />
                <p>Welcome back!</p>
            </div>
            <div className="form-container-login">
                <h1>Login your account</h1>
                <form method='POST'>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder='Email' 
                            value={email} 
                            className='email' 
                            onChange={handleEmail} 
                            autoComplete="off"
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder='Password' 
                            value={password} 
                            className='password' 
                            onChange={handlePassword} 
                            autoComplete="off"
                        />
                        <div className="container-button-login">
                            <button 
                                type="button"
                                onClick={handleLogin} 
                                className='login' 
                                disabled={email.trim() === '' || password.trim() === ''}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                <h4><Link to='/createAccont' className='link-create-account'>Create account</Link></h4>
            </div>
        </div>
    </div>
  )
}

export default Login