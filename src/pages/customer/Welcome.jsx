import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authActions';
import { setProfile } from '../../store/authSlice';
import { getStudents } from '../../store/studentsSlice';

import { AiOutlineArrowRight, AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { CustomButton, StudentProfileSkeletonLoader } from '../../components';
import api from '../../utils/api';

import Image  from '../../data/images/logo.png';
import avatar from '../../data/placedolder_avatar.jpg';

const Welcome = () => {
    const profile = useSelector(state => state.auth.profile);
    const students = useSelector(state => state.students.data);
    const loading = useSelector(state => state.students.loading);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enteredPin, setEnteredPin] = useState('');
    const [pinError, setPinError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/customer-profile');
                dispatch(setProfile(response.data.data));
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
            }
        };

        fetchProfile();
    }, [dispatch]);

    // Fetch the students data
    useEffect(() => {
        try {
            dispatch(getStudents());
            console.log('Students', students);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    }, [dispatch]);

    const customer = {
        name: profile ? profile.name.split(' ')[0] : '',
        email: profile ? profile.email : '',
        profilePic: profile && profile.profile_photo_path ? profile.profile_photo_path : avatar,
        parentalLock: profile ? profile.parental_lock : false
    }

    // Transform the data to fit the displayed data
    const transformedStudents = students && Array.isArray(students) ? students.map(student => ({
        id: student.id,
        name: student.name,
        profilePic: student.profile_photo_url || avatar
    })) : [];

    const handleClick = (event) => {
        event.preventDefault();
        dispatch(logout());
    }

    const handlePinSubmit = (event) => {
        event.preventDefault();

        if (enteredPin == profile.parental_lock_pin) {
            navigate('/customer/dashboard');
        } else {
            setPinError('The entered pin is incorrect.');
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };
    
    const handleResetPin = () => {
        // Add your reset pin logic here
    };

    return (
        <div className='flex flex-col items-stretch min-h-screen main-wrapper 
            py-12'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center text-center'>
                <img src={Image} alt="email verification" 
                    className="mb-4" style={{ width: '35px' }} />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                text-left font-semibold mb-6'>Who’s Using AlQuran Portal?</h3>

                <div className='content-wrapper flex flex-col md:flex-row 
                    items-center justify-between 
                    bg-green w-[90%] md:w-3/5 p-4 rounded-md mb-4'>
                    <div className='flex items-center'>
                        <img src={customer.profilePic} alt="Profile" 
                            className="w-10 h-10 rounded-full mr-4
                            border-1.5 border-white" />
                        <div className='text-left'>
                            <p className='text-white font-semibold'>{customer.name}</p>
                            <p className='text-white'>{customer.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={customer.parentalLock == 1 ? () => setIsModalOpen(true) : undefined}
                        className='flex items-center bg-green-light 
                            text-white mt-3 md:mt-0 
                            px-4 py-2 rounded-md'
                    >
                        {customer.parentalLock == 0 ? (
                            <Link to='/customer/dashboard'
                                className='flex items-center'
                            >
                                <AiOutlineArrowRight className="mr-2" />
                                Account Holder Dashboard
                            </Link>
                        ) : (
                            <>
                                <AiOutlineArrowRight className="flex items-center mr-2" />
                                Account Holder Dashboard
                            </>
                        )}
                        
                    </button>
                </div>

                <div className="flex flex-wrap w-[90%] md:w-3/5">
                    {loading ? (
                        <StudentProfileSkeletonLoader />
                    ) : (
                        <>
                            {transformedStudents.map((student, index) => (
                                <div key={index} className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
                                    <div className="border-1 border-gray-200 p-4 rounded-md
                                        flex flex-col items-center h-36">
                                        <Link to={`/student/${student.name.toLowerCase()}/dashboard`}>
                                            <img src={student.profilePic} alt="Profile" 
                                                className="w-16 h-16 rounded-full mb-4" />
                                            <p>{student.name}</p>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {transformedStudents && transformedStudents.length < 10 && (
                                <div className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
                                    <div className="border-1 border-gray-200 p-4 h-36
                                        rounded-md flex flex-col items-center 
                                        justify-center cursor-pointer">
                                        <Link to="/customer/student/add-student" 
                                            className="flex flex-col items-center justify-center 
                                            text-grey-500">
                                            <AiOutlinePlus className="w-6 h-6 mb-4" />
                                            <p>Add Student</p>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <CustomButton onClick={handleClick} customClass={'mt-4 shadow bg-grey-500'} >Logout</CustomButton>
            </div> 

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                        <button className="absolute top-0 right-0 m-4" onClick={handleClose}>
                            <AiOutlineClose size={24} />
                        </button>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <div className="mt-2">
                                    <form className='w-full' onSubmit={handlePinSubmit}>
                                        <div className='md:flex md:items-center mb-2'>
                                            <div className='w-full'>
                                                <label className='block text-gray-700 font-semibold mb-2 pr-4' 
                                                    htmlFor="pin">
                                                    Enter Pin
                                                </label>
                                                <input 
                                                    type="password"
                                                    className='bg-white appearance-none border-1 border-gray-200 
                                                    rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
                                                    focus:border-gray-600' 
                                                    id="pin"
                                                    name="pin"
                                                    placeholder="Enter Pin"
                                                    value={enteredPin}
                                                    onChange={(event) => {
                                                        setEnteredPin(event.target.value);
                                                        setPinError('');
                                                    }}                         
                                                />
                                                <p className="text-red-500 pt-2 text-xs italic">{pinError}</p>
                                            </div>
                                        </div>
                                        <div className='md:flex md:items-center mb-6 text-right'>
                                            <div className='w-full'>
                                                <button className=" text-green underline bg-transparent" 
                                                    onClick={handleResetPin}>
                                                    Reset Pin
                                                </button>
                                            </div>
                                        </div>
                                        <div className='md:flex md:items-center'>
                                            <button className='w-full shadow bg-green hover:bg-dark-green 
                                                focus:shadow-outline focus:outline-none text-white  
                                                py-2 px-4 rounded' type='submit'>
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Welcome