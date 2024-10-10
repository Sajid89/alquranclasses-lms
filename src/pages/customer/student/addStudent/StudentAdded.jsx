import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../../data/icons/verified_icon.png';
import { CustomButton } from '../../../../components';

const EmailVerification = () => {
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    return (
        <div className='flex flex-col items-stretch min-h-screen main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center text-center'>
                <img src={Image} alt="email verification" 
                    className="pb-8" style={{ width: '80px' }} />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                text-left font-semibold pb-3'>Student Added Successfully!</h3>
                <p>
                    Do you want to add another student? 
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}> {/* Add a flex container */}
                    <CustomButton onClick={() => handleClick('/add-student')} customClass="mt-4 shadow border-1 green-border transparent text-green mr-2">Add Student</CustomButton>
                    <CustomButton onClick={() => handleClick('/customer/subscription/buy')}>Buy Subscription</CustomButton>
                </div>
            </div> 
        </div>
    );
}

export default EmailVerification;