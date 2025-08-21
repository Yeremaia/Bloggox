import React, { useState } from 'react';

// Import Axios
import Axios from 'axios';

// Link Library
import { Link } from 'react-router-dom'

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

// Background Image
import background2 from '../../images/blogs/fondo1.png'

function CreateAccont() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')
  
  // This is to get the value of the input
  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleLastName = (e) => {
    setLastName(e.target.value)
  }

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePhone = (e) => {
    setPhone(e.target.value)
  }

  const handleMonth = (e) => {
    setMonth(e.target.value)
  }

  const handleDay = (e) => {
    setDay(e.target.value)
  }

  const handleYear = (e) => {
    setYear(e.target.value)
  }

  const handleUser = (e) => {
    setUsername(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  
  const addAccount = () => {
    const imageUser = '';
    const backgroundImage = '';
    const descriptionUser = '';
    const address = '';

    // Sends the form data to the /create route server to create a new account.
    // name, email, username, etc. are defined by useState()
    Axios.post("http://localhost:3001/create", {
      name,
      email,
      username,
      password,
      lastName,
      phone,
      month,
      day,
      year,
      imageUser,
      backgroundImage,
      descriptionUser,
      address
    }).then((res) => {
      // If the server responds successfully it will do this:
      if (res.data.success) {
        toast.success('The user registered successfully');
        localStorage.setItem("username", username);
        window.location.href = '/';
      } else {
        toast.error(res.data.message); // This shows the error if it already exists
      }
    }).catch((err) => {
      // If a server error occurs
      toast.error("Server error");
      console.error(err);
    });
  }

  return (
    <div className="session-background-create">

      <ToastContainer style={{fontWeight: "bold"}}/>

      <div className='create-container'>
          <div className="image-container-create">
              <img src={background2} />
          </div>

          <div className="form-container-create">
              <h1>Create your account</h1>
              <form  className='form-create-account-right' method='POST'>
                  <div className="line-create-account">
                    <input type="text" name="name" placeholder='Name' pattern='[A-Za-z]+' title='Only accepts letters.' value={name} onChange={handleName} required autoComplete="off" />

                    <input type="text" name="last-name" placeholder='Last Name' pattern='[A-Za-z]+' title='Only accepts letters.' value={lastName} onChange={handleLastName} required className='last-name' autoComplete="off" />
                  </div>
                  <input type="email" name="email" className='email-create' placeholder='Email' value={email} onChange={handleEmail} required autoComplete="off" />

                  <input type="text" name="phone" pattern='[0-9]+' title='Only accepts numbers.' className='phone-create' placeholder='Phone Number' value={phone} onChange={handlePhone} required autoComplete="off" />
                  <div className="container-birthday">

                    <input type="number" id="month" name="month" min="1" max="12" placeholder='MM' value={month} onChange={handleMonth} required autoComplete="off" title='Month' />

                    <input type="number" id="day" name="day" min="1" max="31" placeholder='DD' value={day} onChange={handleDay} required autoComplete="off" title='Day' />

                    <input type="number" id="year" name="year" min='0' max="5000" placeholder='AAAAA' value={year} onChange={handleYear} required autoComplete="off" title='Year' />

                  </div>

                  <input type="text" name="username" placeholder='Username' value={username} onChange={handleUser} required autoComplete="off" title='Username' />

                  <input type="text" name="password" placeholder='Password' value={password} onChange={handlePassword} required autoComplete="off" title='Password' />
                  
                  <div className="container-button-create">

                        <button 
                          type="button"
                          onClick={addAccount} 
                          className='create-button'
                          // This is so that if the inputs are empty, the button is disabled.
                          disabled={name.trim() === '' || lastName.trim() === '' || email.trim() === '' || phone.trim() === '' || day.trim() === '' || month.trim() === '' || year.trim() === '' || password.trim() === '' || username.trim() === ''}
                        >
                          Create
                        </button>

                    </div>
              </form>

              <Link to='/' className='back-create-accont'>Back</Link>
          </div>
      </div>
    </div>
    
  )
}

export default CreateAccont