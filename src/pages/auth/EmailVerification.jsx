import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Image from '../../data/icons/verified_icon.png';
import { CustomButton } from '../../components';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const EmailVerification = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await api.get(`verify-email/${token}`);
            } catch (error) {
                console.log('Error in email verification', error);
            }
        };
        verifyEmail();
    }, [token]);


    const handleClick = () => {
        navigate('/login');
    }

    return (
        <div className='flex flex-col items-stretch min-h-screen main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center text-center'>
                <img src={Image} alt="email verification" 
                    className="pb-8" style={{ width: '80px' }} />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                text-left font-semibold pb-3'>Email Verified!</h3>
                <p>Your email address is verified, Click continue to do 
                    <br />free trial registration.
                </p>

                <CustomButton onClick={handleClick}>Get Started</CustomButton>
            </div> 
        </div>
    );
}

export default EmailVerification;