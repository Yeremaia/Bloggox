// This page works by entering an incorrect link into the software.

import React from 'react'
import Image from '../../images/logos/logoError.png'

function ErrorPage() {
  return (
    <div className='errorContent'>
        <h1>Error 404</h1>
        <p>Page no found.</p>
        <img src={Image} alt="Error Logo" title='Error Logo' />
    </div>
  )
}

export default ErrorPage