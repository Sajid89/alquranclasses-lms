import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { useSelector } from 'react-redux';

const UserProfile = ({ handleClick, handleClose }) => {
    const userType = useSelector(state => state.auth.profile?.user_type);
    const basePath = userType === 'customer' ? '/customer' : '/teacher';
    const dropdownRef = useRef(null);

    const handleLogout = (event) => {
        event.preventDefault();
        handleClick(event);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClose(event);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="absolute top-14 right-0 w-48 py-2 mt-2 mr-6 md:mr-0 
            bg-white rounded-md shadow-xl">
            <ul>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-gray-900">
                    <AiOutlineSetting className="text-green mr-2" />
                    <span className="text-gray-400">
                        <Link to={`${basePath}/settings`}>Edit</Link>
                    </span>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-gray-900">
                    <BiLogOut className="text-green mr-2" />
                    <span className="text-gray-400">
                        <a href="#" onClick={handleLogout}>Logout</a>
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default UserProfile;