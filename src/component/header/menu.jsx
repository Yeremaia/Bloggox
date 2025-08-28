import React from "react";

// Router Library
import { useLocation, useNavigate, Link } from "react-router-dom";

// Default Photo Profile
import defaultPhoto from "../../images/profile/defaultPhoto.png";

// Import Dropdown Menu
import DropdownMenu from './dropdownMenu'

// Import Hook
import { useState } from "react";

function Menu() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [query, setQuery] = useState("");

    // Search engine enter handler
    const handleKeyDown = (e) => {
        // If the user presses enter and the field is not empty, remove unnecessary spaces and then redirect to the search page.
        if (e.key === "Enter") {
        if (query.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
        }
    };

    const [showDropdownMenu, setShowDropdownMenu] = useState(false);
    const location = useLocation();

    const isHome = location.pathname.includes('/home');
    const isCreate = location.pathname.includes('/createPost');

    // toggles between showing and hiding when clicked
    const handleDropdownMenu = () => {
        setShowDropdownMenu(prev => !prev);
    }

    // If the user exists, use the image from the backend, otherwise use the default image.
    const profileImage = user?.imageUser 
    ? `http://localhost:3001${user.imageUser}` 
    : defaultPhoto;


    return(
        <div className="header">
            <nav className="browser">
                <ul className="nav-list">
                    <li><Link to='/home' className={!isHome ? "nav-link-menu" : "nav-link-menu color-menu"}>Home</Link></li>
                    <li><a href='#follow-me' className="nav-link-menu">About</a></li>
                    <li><Link to='/createPost' className={!isCreate ? "nav-link-menu" : "nav-link-menu color-menu"}>Create</Link></li>
                </ul>
            </nav>
            
            <input 
                type="search" 
                name="search" 
                id="search" 
                placeholder="Search" 
                className="bg-white dark:bg-neutral-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="profile-menu" onClick={handleDropdownMenu}>
                <img 
                    src={profileImage}
                    alt="This is random image" 
                    title="Profile"
                    className="image-profile-header"
                />
            </div>
            {showDropdownMenu && <DropdownMenu onClose={() => setShowDropdownMenu(false)} />}
        </div>
    );
}

export default Menu;