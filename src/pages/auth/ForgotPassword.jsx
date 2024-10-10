import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';
import { DynamicForm, AuthPageLayout, Spinner } from '../../components';

import signupImage from '../../data/images/auth/signup.png';
import { PAGE_TEXTS } from '../../data/TextConstants';
import api from '../../utils/api';

function ForgotPassword() {
    const fields = [
        { type: 'email', name: 'email', placeholder: 'Email Address' },
        { type: 'button', buttonText: 'Send Verification Link' }
    ];

    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            await api.post('/forgot-password', formData);
            toast.success('Password reset link sent to your email address');
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Forgot password failed:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Spinner loading={true} text={'Sending link...'} />}
            <div className='flex flex-col sm:flex-row  justify-between items-stretch min-h-screen main-wrapper'>
                <AuthPageLayout title={PAGE_TEXTS.SIGNUP.TITLE} image={signupImage}>
                    {PAGE_TEXTS.SIGNUP.TEXT}
                </AuthPageLayout>
            
                <div className='w-full sm:w-1/2 flex-grow bg-white flex flex-col items-center
                    py-10 px-30 rounded-bl-10xl justify-center'>
                    <h2 className='w-full max-w-sm text-2xl sm:text-2xl md:text-2xl lg:text-3xl 
                    text-left font-semibold'>Reset Password</h2>
                    <p className='w-full max-w-sm text-left'>Enter Your Email Address</p>

                    <DynamicForm
                        fields={fields}
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
