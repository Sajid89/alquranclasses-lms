import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { DynamicForm, Spinner } from '../../../components';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';

const Password = () => {

    let fields = [
        { type: 'password', name: 'current_password', placeholder: 'Current Password', disabled: true },
        { type: 'password', name: 'password', placeholder: 'New Password' },
        { type: 'password', name: 'confirm_password', placeholder: 'Confirm New Password' },
        { type: 'button', buttonText: 'Save Changes' }
    ];

    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Define the fields to exclude
        const fieldsToExclude = ['current_password'];
        
        // Create a new object excluding the specified fields
        const filteredFormData = Object.keys(formData)
            .filter(key => !fieldsToExclude.includes(key))
            .reduce((obj, key) => {
                obj[key] = formData[key];
                return obj;
            }, {});

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setLoading(true);

            const response = await api.post('/update-teacher-password', filteredFormData);
            toast.success(response.data.message);
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
            {loading && <Spinner loading={loading} text='Updating Password...' />}
            <DynamicForm
                fields={fields}
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                customClasses='pt-6'
            />
        </>
    );
}

export default Password