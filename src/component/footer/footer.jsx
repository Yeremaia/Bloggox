import React from 'react'

// Router Libraries
import { Link } from 'react-router-dom'

// Icon libraries
import { BiLogoGmail  } from 'react-icons/bi'
import { FaGithub } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdCreateNewFolder } from "react-icons/md";
import { MdLogout } from "react-icons/md";

function Footer() {
  return (
    <footer>
        <div className="about-footer">
            <h2>About us</h2>
            <p>We are a one-man company, tasked with creating and finding solucions.</p>
            <p className='last-child-about'>&copy; Rights reserved by: <span>Yeremy Peralta Baez</span></p>
        </div>

        <div className="links-footer">
            <h2>Links</h2>
            <ul>
                <li><Link to="/home" className='all-links-footer'><IoMdHome style={{fontSize: "30px", marginRight: "7px"}}/>Home</Link></li>
                <li><Link to='/profile' className='all-links-footer'><CgProfile style={{fontSize: "30px", marginRight: "7px"}}/>Profile</Link></li>
                <li><Link to='/createPost' className='all-links-footer'><MdCreateNewFolder style={{fontSize: "30px", marginRight: "7px"}}/>Create</Link></li>
                <li><Link to='/' className='all-links-footer'><MdLogout style={{fontSize: "30px", marginRight: "7px"}}/>Log out</Link></li>
            </ul>
        </div>

        <div className="follow-me-footer" id='follow-me'>
            <h2>Follow me</h2>
            <ul className='logos-list'>
                <li>
                    <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=yerethedark@gmail.com&su=Hola&body=Hola,%20quiero%20hablar%20contigo" className='follow-me-list' target='_blank'><BiLogoGmail className='hover-follow-me' style={{ fontSize: "30px" }} /></Link>
                </li>
                <li>
                    <Link to="https://github.com/Yeremaia" className='follow-me-list' target='_blank'><FaGithub className='hover-follow-me' style={{ fontSize: "30px" }} /></Link>
                </li>
            </ul>
        </div>
    </footer>
  )
}

export default Footer