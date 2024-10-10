import React from 'react';
import { AuthPageLayout } from '../../components';
import signupImage from '../../data/images/auth/signup.png';
import emailImage from '../../data/icons/email_icon.png';
import { PAGE_TEXTS } from '../../data/TextConstants';

const ResetPasswordLink = () => {

    return (
        <div className='flex flex-col sm:flex-row  justify-between items-stretch min-h-screen main-wrapper'>
            <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                {PAGE_TEXTS.SIGNUP.TEXT}
            </AuthPageLayout>
            
            <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center'>
                <img src={emailImage} alt="email verification" 
                    className="pb-8" style={{ width: '150px' }} />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                text-left font-semibold pb-3'>Reset Your Password</h3>
                <p>Check your email for the verification link sent to
                    <span className='text-green font-semibold'> user@gmail.com</span>. 
                    Check your <br /> email inbox.  If you don’t find the mail in inbox, 
                    please check spam. 
                </p>

                <p className='pt-4'>Haven’t received? 
                    <a href="#" className="pl-2 text-green font-semibold hover:underline">
                        Resend Email
                    </a>
                </p>
            </div> 
        </div>
    );
}

export default ResetPasswordLink;