// This is the drop-down menu when you click on the photo in the top right corner.

import React from 'react'

// Links Libraries
import { Link, useNavigate, useLocation } from 'react-router-dom'

// Icons Libraries
import { CgProfile } from "react-icons/cg";
import { MdFavorite, MdEmail, MdLogout } from "react-icons/md";
import { HiMiniDocumentText } from "react-icons/hi2";
import { TiHome } from "react-icons/ti";
import { IoMdCreate } from "react-icons/io";
import { MdDarkMode, MdSunny  } from "react-icons/md";

// Import Dark Mode
import { useDarkMode } from '../darkMode/darkModeContext';

function DropdownMenu({ onClose }) {
    // This is a custom hook that probably accesses the DarkModeContext context.
    const { darkMode, toggleDarkMode } = useDarkMode();
    const location = useLocation();

    // Check the active route
    const isProfile = location.pathname.includes('/profile');
    const isFavorites = location.pathname.includes('/favorites');
    const isHome = location.pathname.includes('/home');
    const isMyCreations = location.pathname.includes('/myCreations');
    const isCreatePost = location.pathname.includes('/createPost');

    const navigate = useNavigate();

    // Sign out
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

  return (
    <div className='dropdown-menu'>
        <ul className="nav-list-header">
            <div className="first-dropdown-list">
                
                {/* 
                    - If the user is in the path of the following variable, the "color-dropdown-menu" class is added to it; otherwise, nothing is assigned. 
                    (This applies to the other <li>)
                */}
                
                <li className={isProfile ? "color-dropdow-menu" : undefined}><Link to='/profile' onClick={onClose}><CgProfile style={{fontSize: "30px"}} className='icon-drop-menu' />Profile</Link></li>

                <li className={isFavorites ? "color-dropdow-menu" : undefined}><Link to='/favorites' onClick={onClose}><MdFavorite style={{fontSize: "30px"}} className='icon-drop-menu' />Favorites</Link></li>

                <li className={isMyCreations ? "color-dropdow-menu" : undefined}><Link to='/myCreations' onClick={onClose}><HiMiniDocumentText style={{fontSize: "30px"}} className='icon-drop-menu' />My Creations</Link></li>

            </div>

            <div className="second-dropdown-list">

                <li className={isHome ? "color-dropdow-menu" : undefined}><Link to='/home' onClick={onClose}><TiHome style={{fontSize: "30px"}} className='icon-drop-menu' />Home</Link></li>

                <li className={isCreatePost ? "color-dropdow-menu" : undefined}><Link to='/createPost' onClick={onClose}><IoMdCreate style={{fontSize: "30px"}} className='icon-drop-menu' />Create Post</Link></li>

                <li><a href='#follow-me' onClick={onClose}><MdEmail style={{fontSize: "30px"}} className='icon-drop-menu' />Contacts</a></li>

            </div>

            <div className="third-dropdown-list">
                <li onClick={toggleDarkMode}>
                    {darkMode 
                        ? <MdSunny style={{fontSize: "30px"}} className='icon-drop-menu' />
                        : <MdDarkMode style={{fontSize: "30px"}} className='icon-drop-menu' /> }
                    {darkMode ? <p style={{cursor:"pointer"}}>Light Mode</p> : <p style={{cursor:"pointer"}}>Dark Mode</p> }
                </li>
                <li><Link to='/' onClick={handleLogout}><MdLogout style={{fontSize: "30px"}} className='icon-drop-menu' />Log Out</Link></li>
            </div>
        </ul>
    </div>
  )
}

export default DropdownMenu