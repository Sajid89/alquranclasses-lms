import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthPageLayout } from '../../components';
import Image from '../../data/icons/verified_icon.png';
import signupImage from '../../data/images/auth/signup.png';
import { PAGE_TEXTS } from '../../data/TextConstants';
import { CustomButton } from '../../components';

const AfterSuccessfulSignup = () => {
      const navigate = useNavigate();

      const handleClick = () => {
            navigate('/login');
      }

    return (
      <div className='flex flex-col sm:flex-row  justify-between items-stretch min-h-screen main-wrapper'>
            <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                {PAGE_TEXTS.SIGNUP.TEXT}
            </AuthPageLayout>

            <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col items-center
                py-10 px-30 rounded-bl-10xl justify-center'>
                  <div className='w-full flex-grow bg-white flex flex-col 
                  items-center rounded-bl-10xl justify-center text-center'>
                  <img src={Image} alt="email verification" 
                        className="pb-8" style={{ width: '80px' }} />
                  <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                  text-left font-semibold pb-3'>Password Changed Successfully!</h3>
                  <p>Your password is changed successfully, you can now 
                        <br /> login with your new password.
                  </p>

                  <CustomButton onClick={handleClick}>Login Now</CustomButton>
                  </div> 
            </div>
      </div>
    );
}

export default AfterSuccessfulSignup;