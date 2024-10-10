import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { DynamicForm, Breadcrumb, Spinner } from '../../components';
import api from '../../utils/api';

import { generateValidationSchema } from '../../utils/ValidationSchema';
import * as Yup from 'yup';


const SetParentalLock = () => {
    const profile = useSelector(state => state.auth.profile);
    const fields = [
        { type: 'number', name: 'parental_lock_pin', placeholder: '4 Digit Pin', value: profile ? profile.parental_lock_pin : '' },
        { type: 'button', buttonText: 'Update' }
    ];
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: profile ? profile.name : '',
        phone: profile ? profile.phone : '',
        parental_lock: 1
    });

    useEffect(() => {
        setFormData(formData);
    }, [profile]);

    const validationSchema = generateValidationSchema(fields);
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

            const response = await api.post('/update-customer-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);
            navigate('/customer/settings');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            else {
                console.log('Error updating parental lock:', error);
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            {  loading && <Spinner loading={true} text={'Updating...'} /> }
            <div className='w-full pl-6 pr-6'>
                <Breadcrumb items={[
                    { name: 'Profile', link: '/customer/settings' },
                    { name: 'Update Parental Lock', active: true }
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

export default SetParentalLock