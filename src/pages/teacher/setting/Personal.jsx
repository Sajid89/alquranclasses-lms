import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { DynamicForm, Spinner } from '../../../components';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';

const Personal = ({ details }) => {

    let fields = [
        { type: 'text', name: 'name', placeholder: 'Full Name' },
        { type: 'tel', name: 'phone', placeholder: 'Phone number' },
        { type: 'email', name: 'email', placeholder: 'Email Address' },
        { type: 'text', name: 'regularClassRate', isRow: true, customMargins: 'mr-1', placeholder: 'Regular Class Rate' },
        { type: 'text', name: 'trialClassRate', isRow: true, customMargins: 'ml-1', placeholder: 'Trial Class Rate' },
        { type: 'text', name: 'coordinator', placeholder: 'Teacher Coordinator' },
        { type: 'button', buttonText: 'Save Changes' }
    ];

    if (details.length > 0) {
        fields = fields.map(field => 
            field.type !== 'button' && field.name !== 'name' && field.name !== 'phone'
                ? { ...field, disabled: true } 
                : field
        );
    }
    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState(details.length > 0 ? details[0] : {});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Define the fields to exclude
        const fieldsToExclude = ['regularClassRate', 'trialClassRate', 'coordinator'];
        
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

            const response = await api.post('/update-teacher-profile', filteredFormData);
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
            {loading && <Spinner loading={loading} text='Updating Person Info...' />}
            <DynamicForm
                fields={fields}
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                customClasses='pt-4'
            />
        </>
    );
}

export default Personal