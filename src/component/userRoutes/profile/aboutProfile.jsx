import React from 'react'

// Icon Libraries
import { RiContactsBook3Line } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md";

function AboutProfile() {

    // declare a variable that contains the logged-in user's data
    const user = JSON.parse(localStorage.getItem("user"));

  return (
    <table className='about-component-profile' border='2px'>
        <tbody>
            <tr>
                <th title='Name'><RiContactsBook3Line /></th>
                <td>{user.name}</td>
            </tr>
            <tr>
                <th title='Last Name'><RiContactsBook3Line /></th>
                <td>{user.lastName}</td>
            </tr>
            <tr>
                <th title='Phone Number'><FaPhoneAlt /></th>
                <td>{user.phone ? user.phone : "There is no content in this field"}</td>
            </tr>
            <tr>
                <th title='Date of Birth'><FaCalendarAlt /></th>
                <td>{user.day}-{user.month}-{user.year}</td>
            </tr>
            <tr>
                <th title='Email'><MdEmail /></th>
                <td>************</td>
            </tr>
            <tr>
                <th title='Address'><FaLocationDot /></th>
                <td>{user.address ? user.address : "There is no content in this field"}</td>
            </tr>
            <tr>
                <th title='Username'><FaUserCircle /></th>
                <td>@{user.username}</td>
            </tr>
            <tr>
                <th title='Password'><RiLockPasswordFill /></th>
                <td>**********</td>
            </tr>
            <tr>
                <th title='Description'><MdOutlineDescription /></th>
                <td className='description-column'>{user.descriptionUser ? user.descriptionUser : "There is no content in this field"}</td>
            </tr>
        </tbody>
    </table>
  )
}

export default AboutProfile