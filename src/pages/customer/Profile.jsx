import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../../store/authSlice';
import { toast } from 'react-toastify';

import avatar from '../../data/placedolder_avatar.jpg';
import { AiOutlineEdit, AiOutlineLock } from 'react-icons/ai';
import api from '../../utils/api';
import { CustomerProfileSkeletonLoader } from '../../components';
import { string } from 'yup';


const Profile = () => {
    const profile = useSelector(state => state.auth.profile);
    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigate();
    const dispatch = useDispatch();

    console.log(toggle);

    const customer = {
        name:  profile ? profile.name : '',
        email: profile ? profile.email : '',
        phone: profile ? profile.phone : '',
        profilePicture: profile && profile.profile_photo_path ? profile.profile_photo_path : avatar,
        parentalControl: profile ? profile.parental_lock : false,
        parantalLock: profile ? profile.parental_lock_pin : '',
        phoneVerified: profile ? profile.phone_verified_at : false
    } 

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/customer-profile');
                dispatch(setProfile(response.data.data));
                setToggle(response.data.data.parental_lock ? true : false);
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        //setLoading(false);
    }, [dispatch]);

    const handleToggle = async () => {
        const newToggleState = !toggle;
        setToggle(newToggleState);

        const payload = {
            name: customer.name,
            phone: customer.phone,
            parental_lock: newToggleState ? 1 : 0,
        };

        const message = 'Parental lock has been ' + (newToggleState ? 'enabled' : 'disabled');

        try {
            const response = await api.post('/update-customer-profile', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            toast.success(message);
        } catch (error) {
            console.log('Error updating customer profile:', error);
        }
    };

    const handleClick = async () => {
        
        try {
            const response = await api.post('/verify-phone', {to:profile.phone}, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);

            setTimeout(() => {
                navigation('/customer/settings');
            } , 2000);

            navigation('/customer/settings/verify-phone');
        } catch (error) {
            console.log('Error in send verification sms', error);
        }
    }

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                {loading ? (
                    <CustomerProfileSkeletonLoader />
                ) : (
                    <div className='w-full md:w-10/12 lg:w-8/12'>
                        <img src={customer.profilePicture} alt="Profile" className="rounded-full w-20 h-20" />
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold mt-4 mb-2">Personal Information</h2>
                            <Link 
                                className="flex justify-between items-center 
                                text-green font-semibold"
                                to={`/customer/settings/edit-profile`}
                            >
                                <span className='mr-2'>Edit</span> <AiOutlineEdit />
                            </Link>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className='mb-2'>Full Name:</p>
                                <p className='mb-2'>Email: </p>
                                <p className='mb-2'>Phone:</p>
                                <p className='mb-2'>Password</p>
                            </div>
                            <div>
                                <p className='mb-2'>{customer.name}</p>
                                <p className='mb-2'>{customer.email}</p>
                                <p className='mb-2'>
                                    {customer.phone}
                                    {!customer.phoneVerified ? (
                                        <button onClick={handleClick} className="text-xs text-green font-semibold ml-2">
                                            Verify
                                        </button>
                                    ) : (
                                        <span className="bg-green text-white rounded-sm text-xs py-1 px-2 ml-2">Verified</span>
                                    )}
                                </p>
                                <p>
                                    <span>********</span> 
                                    <Link 
                                        className="text-xs text-green font-semibold ml-2"
                                        to={`/customer/settings/change-password`}
                                    >
                                        Change
                                    </Link>
                                </p> 
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mt-4 mb-2">Security</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <p>Parental Lock</p>
                                <p className='text-xs w-72 lg:w-96'>Unlock Parent Console with a 4 digit code. To disable the code just use the toggle button</p>
                            </div>
                            {customer.parantalLock ? (
                                <div 
                                    className={`bg-${toggle ? 'green' : 'gray-400'} w-12 h-5 rounded-full p-0.5 cursor-pointer`} 
                                    onClick={handleToggle}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${toggle ? 'translate-x-7' : ''}`}></div>
                                </div>
                            ) : (
                                <Link 
                                    className="flex justify-between items-center 
                                    text-green font-semibold"
                                    to={`/customer/settings/parental-lock`}
                                >
                                    <span className='mr-2'>Create</span> <AiOutlineLock />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;