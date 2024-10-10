import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';

import './Signup.css';
import { DynamicForm, AuthPageLayout, Spinner } from '../../components';
import signupImage from '../../data/images/auth/signup.png';
import appleImage from '../../data/icons/apple_icon.png';
import googleImage from '../../data/icons/google_icon.png';
import facebookImage from '../../data/icons/facebook_icon.png';
import { PAGE_TEXTS } from '../../data/TextConstants';
import api from '../../utils/api';

const Signup = () => {
    const fields = [
        { type: 'imageUpload', name: 'profile_photo_url', buttonText: 'Upload Profile Picture' },
        { type: 'text', name: 'name', placeholder: 'Full Name' },
        { type: 'email', name: 'email', placeholder: 'Email Address' },
        { type: 'password', name: 'password', placeholder: 'Password' },
        { type: 'tel', name: 'phone', placeholder: 'Phone Number' },
        { type: 'checkbox', name: 'agree', text: 'I Agree to the <a href="/terms" class="text-green font-semibold hover:underline">Terms And Conditions</a> and <a href="/privacy" class="text-green font-semibold hover:underline">Privacy Policy</a>'  },
        { type: 'button', buttonText: 'Sign Up' }
    ];
    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            // Get user's IP, country, and timezone
            const ipResponse = await axios.get('https://api.ipify.org?format=json');
            const geoResponse = await axios.get(`https://ipapi.co/${ipResponse.data.ip}/json/`);

            // Add country and timezone to formData
            const updatedFormData = {
                ...formData,
                country: geoResponse.data.country_name,
                timezone: geoResponse.data.timezone,
            };

            const response = await api.post('/signup', updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success(response.data.message);
            localStorage.setItem('signupEmail', formData.email);
            setTimeout(() => {
                navigate('/verify-your-email');
            }, 5000);
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Spinner loading={true} text={'Signing you up...'} />
            ) : (
                <div className='flex flex-col sm:flex-row  justify-between items-stretch min-h-screen main-wrapper'>
                    <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                        {PAGE_TEXTS.SIGNUP.TEXT}
                    </AuthPageLayout>
                    
                    <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col items-center 
                        py-10 px-10 rounded-bl-10xl'>
                        <h2 className='text-2xl sm:text-2xl md:text-2xl lg:text-3xl 
                        text-left font-semibold'>Create A Free Account</h2>
                        <p>Enter Your Details To Get An Account For A Free Trial Class</p>

                        <DynamicForm
                            fields={fields}
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />

                        <p className='pt-4'>Already have an account? 
                            <Link to="/login" className="text-green font-semibold hover:underline">Log In</Link>
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
                            <a href="https://www.apple.com" target="_blank" rel="noopener noreferrer">
                                <img src={appleImage} alt="signup with apple" className="w-12" />
                            </a>
                        </div>
                    </div>
                    
                </div>
            )}
        </>
    );
}

export default Signup;