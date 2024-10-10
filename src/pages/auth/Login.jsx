import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authActions';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import { isBrowser, isMobile, isTablet } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';
import { DynamicForm, AuthPageLayout } from '../../components';

import signupImage from '../../data/images/auth/signup.png';
import googleImage from '../../data/icons/google_icon.png';
import facebookImage from '../../data/icons/facebook_icon.png';
import { PAGE_TEXTS } from '../../data/TextConstants';
import { API_BASE_URL } from '../../config';
import { Spinner } from '../../components';

function Login() {
    const dispatch = useDispatch();
    const authentication = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const fields = [
        { type: 'email', name: 'email', placeholder: 'Email Address' },
        { type: 'password', name: 'password', placeholder: 'Password' },
        { type: 'forgotPassword'},
        { type: 'button', buttonText: 'Login' }
    ];

    const validationSchema = generateValidationSchema(fields);

    // Generate a unique device_id
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem('device_id', deviceId);
    }

    let deviceType;
    if (isMobile) {
        deviceType = 'mobile';
    } else if (isTablet) {
        deviceType = 'tablet';
    } else if (isBrowser) {
        deviceType = 'browser';
    }

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const finalFormData = {
            ...formData,
            deviceId: deviceId,
            deviceType: deviceType,
        };

        try {
            await validationSchema.validate(finalFormData, { abortEarly: false });
            let actionResult = await dispatch(login(finalFormData));
            let response = unwrapResult(actionResult);
            toast.success(response.user.message);
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <Spinner loading={true} text={'Redirecting...'} />
            ) : (
                <div className='flex flex-col sm:flex-row  justify-between items-stretch min-h-screen main-wrapper'>
                    <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                        {PAGE_TEXTS.SIGNUP.TEXT}
                    </AuthPageLayout>
                
                    <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col items-center
                        py-10 px-10 rounded-bl-10xl'>
                        <h2 className='w-full max-w-sm text-2xl sm:text-2xl md:text-2xl lg:text-3xl 
                        text-left font-semibold'>Login Account</h2>
                        <p className='w-full max-w-sm text-left'>Enter Your Details To Log In To Your Account</p>

                        <DynamicForm
                            fields={fields}
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />

                        <p className='pt-4'>Don't have an account? 
                            <Link to="/signup" className="text-green font-semibold hover:underline"> Sign Up</Link>
                        </p>
                    
                        <div className="flex w-full max-w-sm items-center pt-5 pb-5">
                            <hr className="flex-grow border-gray-400 mx-2" />
                            <span>Or Sign Up With</span>
                            <hr className="flex-grow border-gray-400 mx-2" />
                        </div>

                        <div className="image-wrap flex space-x-4">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <img src={facebookImage} alt="signup with facebook" className="w-12" />
                            </a>
                            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                                <img src={googleImage} alt="signup with google" className="w-12" />
                            </a>
                        </div>

                        {/* {authentication.isLoggedIn ? (
                            <p>User is logged in</p>
                        ) : (
                            <p>User is not logged in</p>
                        )} */}
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
