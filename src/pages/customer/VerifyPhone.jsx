import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { DynamicForm, Breadcrumb } from '../../components';
import api from '../../utils/api';

import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';


const VerifyPhone = () => {
    const profile = useSelector(state => state.auth.profile);
    const fields = [
        { type: 'hidden', name: 'to', placeholder: 'Phone number', value: profile ? profile.phone : '' },
        { type: 'number', name: 'code', placeholder: 'Verification Code', value: ''},
        { type: 'button', buttonText: 'Update' }
    ];

    const initialFormData = fields.reduce((acc, field) => {
        if ('name' in field) {
            acc[field.name] = field.value || '';
        }
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);
    const validationSchema = generateValidationSchema(fields);
    const [errors, setErrors] = useState({});
    const navigation = useNavigate();

    useEffect(() => {
        setFormData(initialFormData);
    }, [profile]);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });


            const response = await api.post('/check-phone-verification', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);

            setTimeout(() => {
                navigation('/customer/settings');
            } , 2000);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.log('Error in phone verify ', error);
            }
        }
    };
    
    return (
        <>
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

export default VerifyPhone