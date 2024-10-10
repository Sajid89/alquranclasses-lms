import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { DynamicForm, Breadcrumb, Spinner } from '../../components';
import api from '../../utils/api';

import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';


const UpdateProfile = () => {
    const profile = useSelector(state => state.auth.profile);
    const fields = [
        { type: 'imageUpload', name: 'profile_photo_path', buttonText: 'Upload Profile Picture' },
        { type: 'text', name: 'name', placeholder: 'Full Name', value: profile ? profile.name : '' },
        { type: 'email', name: 'email', placeholder: 'Email Address', disabled: true, value: profile ? profile.email : '' },
        { type: 'password', name: 'password', placeholder: 'Password', value: '********', disabled: true },
        { type: 'tel', name: 'phone', placeholder: 'Phone Number', value: profile ? profile.phone : '' },
        { type: 'button', buttonText: 'Update' }
    ];

    const initialFormData = fields.reduce((acc, field) => {
        if ('name' in field) {
            acc[field.name] = field.value || '';
        }
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        setFormData(initialFormData);
    }, [profile]);

    const resetFields = fields.filter(field => field.name !== 'email' && field.name !== 'password');
    const validationSchema = generateValidationSchema(resetFields);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { email, password, ...submitData } = formData;
        const submitFormData = new FormData();

        for (const key in submitData) {
            submitFormData.append(key, submitData[key]);
        }

        if (profile) {
            submitFormData.append('parental_lock', profile.parental_lock);
        }

        try {
            await validationSchema.validate(submitData, { abortEarly: false });

            const response = await api.post('/update-customer-profile', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            else {
                console.error('Failed to update profile:', error);
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            { loading && <Spinner loading={true} text={'Updating...'} /> }
            <div className='w-full pl-6 pr-6'>
                <Breadcrumb items={[
                    { name: 'Profile', link: '/customer/settings' },
                    { name: 'Update Profile', active: true }
                ]} />
            </div>
            <div className='mt-20 md:mt-4 mb-4'>
                <div className='flex flex-col lg:flex-row pl-6 pr-6'>
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

export default UpdateProfile