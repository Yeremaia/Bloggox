import React, { useEffect, useState } from 'react'

// Icon Libraries
import { RiContactsBook3Line } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

function AboutOtherProfile() {
    const [otherUser, setOtherUser] = useState(null);

    // This retrieves the data of the selected user.
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("otherUser"));
        if (user) setOtherUser(user);
    }, []);

    if (!otherUser) return <p>No user data available.</p>;

  return (
    <table className='about-component-profile' border='2'>
        <tbody>
          <tr>
              <th><RiContactsBook3Line /></th>
              <td>{otherUser.name}</td>
          </tr>
          <tr>
              <th><RiContactsBook3Line /></th>
              <td>{otherUser.lastName || 'No last name'}</td>
          </tr>
          <tr>
              <th><FaPhoneAlt /></th>
              <td>{otherUser.phone || 'No phone'}</td>
          </tr>
          <tr>
              <th><FaCalendarAlt /></th>
              <td>{otherUser.birthDate || 'No date'}</td>
          </tr>
          <tr>
              <th><FaLocationDot /></th>
              <td>{otherUser.address || 'No address'}</td>
          </tr>
          <tr>
              <th><FaUserCircle /></th>
              <td>@{otherUser.username}</td>
          </tr>
          <tr>
              <th><MdOutlineDescription /></th>
              <td>{otherUser.description || 'No description'}</td>
          </tr>
        </tbody>
    </table>
  )
}

export default AboutOtherProfile