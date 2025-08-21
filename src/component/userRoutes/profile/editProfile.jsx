import { React, useRef, useState } from 'react'

// Import Axios
import Axios from "axios";

// Icon Libraries
import { RiContactsBook3Line } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { MdCleaningServices } from "react-icons/md";

// Import Verify Component
import ComfirmEdit from "./confirmEdit";

// Import alert customized
import { ToastContainer, toast } from 'react-toastify';

function EditProfile() {

    const [showVerify, setShowVerify] = useState(false);

    const inputRef1 = useRef(); // name
    const inputRef2 = useRef(); // lastName
    const inputRef3 = useRef(); // phone
    const inputRef4 = useRef(); // birthdate
    const inputRef6 = useRef(); // address
    const inputRef7 = useRef(); // username
    const inputRef8 = useRef(); // password
    const inputRef9 = useRef(); // description

    const user = JSON.parse(localStorage.getItem("user"));

    const handleClearForm = () => {
        [
        inputRef1, // name
        inputRef2, // lastName
        inputRef3, // phone
        inputRef4, // birthdate
        inputRef6, // address
        inputRef7, // username
        inputRef8, // password
        inputRef9  // description
        ].forEach(r => { if (r.current) r.current.value = ''; });
    };

    // opens modal (doesn't update yet)
    const handleShowVerify = () => {    
        if (
            inputRef1.current.value.trim() === '' &&
            inputRef2.current.value.trim() === '' &&
            inputRef3.current.value.trim() === '' &&
            inputRef4.current.value.trim() === '' &&
            inputRef6.current.value.trim() === '' &&
            inputRef7.current.value.trim() === '' &&
            inputRef8.current.value.trim() === '' &&
            inputRef9.current.value.trim() === ''
        ) {
            toast.error('You need to fill out the form');
        } else {
            setShowVerify(true); // It will only show ConfirmEdit
        }
    };

    const handleUpdateProfile = (updatedFields) => {
        // get date of birth
        const birthdate = updatedFields.birthdate || `${user.year}-${user.month}-${user.day}`;

        // separate the date into day, month and year
        let day = user.day, month = user.month, year = user.year;

        // Divide the date into YYYY-MM-DD
        if (birthdate.includes("-")) {
            [year, month, day] = birthdate.split("-");
        }

        // Each field is updated only if the user types something new.
        const updatedUser = {
            name: updatedFields.name || user.name,
            lastName: updatedFields.lastName || user.lastName,
            phone: updatedFields.phone || user.phone,
            day,
            month,
            year,
            address: updatedFields.address || user.address,
            username: updatedFields.username || user.username,
            password: updatedFields.password || user.password,
            descriptionUser: updatedFields.descriptionUser || user.descriptionUser
        };

        // update the information of the logged-in user
        Axios.put(`http://localhost:3001/updateUser/${user.idUser}`, updatedUser)
            .then(res => {
                if (res.data.success) {
                    toast.success("Profile updated successfully");
                    localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
                } else {
                    toast.error(res.data.message || "Error updating profile");
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Server error");
            });
    };

  return (
    <div className="content-edit-profile">
        <ToastContainer position='bottom-right' style={{fontWeight: "bold"}}/>

            {/* get the references of the inputs */}
            {showVerify && 
            <ComfirmEdit 
                onClose={() => setShowVerify(false)} 
                onVerify={handleUpdateProfile} 
                updatedData={{
                    name: inputRef1.current.value,
                    lastName: inputRef2.current.value,
                    phone: inputRef3.current.value,
                    birthdate: inputRef4.current.value,
                    address: inputRef6.current.value,
                    username: inputRef7.current.value,
                    password: inputRef8.current.value,
                    descriptionUser: inputRef9.current.value
                }}
            />
            }

            <div className="buttons-edit-profile">
                <button type="button" onClick={handleClearForm}><MdCleaningServices /> Clean</button>
                
                <button type='button' onClick={handleShowVerify}><IoSend /> Send</button>
            </div>

            <table className='edit-profile-form' border='2'>
                <tbody>
                    <tr>
                        <th><RiContactsBook3Line /></th>
                        <td><input type="text" name="" id="name" title='Name' placeholder={user.name} ref={inputRef1} required/></td>
                    </tr>
                    <tr>
                        <th><RiContactsBook3Line /></th>
                        <td><input type="text" name="" id="lastName" title='Last Name' placeholder={user.lastName} ref={inputRef2} required/></td>
                    </tr>
                    <tr>
                        <th><FaPhoneAlt /></th>
                        <td><input type="number" name="" id="phone" title='Phone Number' placeholder={user.phone} ref={inputRef3} required/></td>
                    </tr>
                    <tr>
                        <th><FaCalendarAlt /></th>
                        <td><input type="date" name="" id="birthdate" title='Birthdate' ref={inputRef4} required/></td>
                    </tr>
                    <tr>
                        <th><FaLocationDot /></th>
                        <td><input type="text" name="" id="location" title='Location' placeholder={user.address} ref={inputRef6} required/></td>
                    </tr>
                    <tr>
                        <th><FaUserCircle /></th>
                        <td><input type="text" name="" id="username" title='Username' placeholder={user.username} ref={inputRef7} required/></td>
                    </tr>
                    <tr>
                        <th><RiLockPasswordFill /></th>
                        <td><input type="password" name="" id="password" title='Password' placeholder="******" ref={inputRef8} required/></td>
                    </tr>
                    <tr>
                        <th><MdOutlineDescription /></th>
                        <td className='textarea-edit-profile'>
                            <textarea
                            id="edit-description-perfil"
                            wrap="soft"
                            rows="4"
                            title="About Me"
                            ref={inputRef9}
                            required
                            defaultValue={user.descriptionUser}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
    </div>
  )
}

export default EditProfile