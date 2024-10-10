import React, { useState, useEffect } from 'react';
import { AuthPageLayout } from '../../components';
import signupImage from '../../data/images/auth/signup.png';
import emailImage from '../../data/icons/email_icon.png';
import { PAGE_TEXTS } from '../../data/TextConstants';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AfterSuccessfulSignup = () => {
    const [email, setEmail] = useState(localStorage.getItem('signupEmail'));
    const [resendStatus, setResendStatus] = useState('');

    const handleResendEmail = async () => {
        try {
            await api.post('/resend-verification-email', { email });
            toast.success('Verification email resent successfully.');
        } catch (error) {
            console.log('An error occurred while resending the email.');
        }
    };

    return (
        <div className='flex flex-col sm:flex-row justify-between items-stretch min-h-screen main-wrapper'>
            <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                {PAGE_TEXTS.SIGNUP.TEXT}
            </AuthPageLayout>
            
            <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center'>
                <img src={emailImage} alt="email verification" 
                    className="pb-8" style={{ width: '150px' }} />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                text-left font-semibold pb-3'>Verify Your Email</h3>
                <p>We have sent a verification email to 
                    <span className='text-green font-semibold'> {email}</span>. 
                    Check your <br /> email inbox. If you don’t find the mail in inbox, 
                    please check spam. 
                </p>

                <p className='pt-4'>Haven’t received? 
                    <button onClick={handleResendEmail} className="pl-2 text-green font-semibold hover:underline">
                        Resend Email
                    </button>
                </p>
                {resendStatus && <p className='pt-4 text-red-500'>{resendStatus}</p>}
            </div> 
        </div>
    );
}

export default AfterSuccessfulSignup;