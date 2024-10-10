import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { DynamicForm, Spinner } from '../../../components';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';

const Address = ({ details }) => {

    let fields = [
        { type: 'text', name: 'country', placeholder: 'Country' },
        { type: 'text', name: 'city', placeholder: 'City' },
        { type: 'text', name: 'address', placeholder: 'Home Address' },
        { type: 'number', name: 'postalCode', placeholder: 'Postal Code' },
        { type: 'button', buttonText: 'Save Changes' }
    ];

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

        // Create a new object with the updated field name
        const updatedFormData = {
            ...formData,
            postal_code: formData.postalCode,
        };
        delete updatedFormData.postalCode;

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setLoading(true);

            const response = await api.post('/update-teacher-profile', updatedFormData);
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
            {loading && <Spinner loading={loading} text='Updating Address...' />}
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

export default Address