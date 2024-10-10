import React, { useState, useEffect } from 'react';
import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DynamicForm } from '../../../components';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const CouponCode = ({ onCouponData }) => {
    const fields = [
        { type: 'text', name: 'coupon_code', placeholder: 'Coupon Code' }
    ];

    const [formData, setFormData] = useState({ coupon_code: '' });
    const [errors, setErrors] = useState({});
    const validationSchema = generateValidationSchema(fields);

    const handleInputChange = async (fieldName, value = '') => {
        setFormData({ ...formData, [fieldName]: value });

        // Yup validation
        try {
            await validationSchema.validateAt(fieldName, { [fieldName]: value });
            setErrors({ ...errors, [fieldName]: '' });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
            setErrors({ ...errors, [fieldName]: error.message });
            }
        }

        if (fieldName === 'coupon_code') {
            if (value.trim() !== '' && value.length >= 5) {
                try {
                    const token = localStorage.getItem('accessToken');
                    const response = await axios.post(
                        API_BASE_URL + '/validate-coupon', 
                        { coupon_code: value },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    toast.success(response.data.message);
                    // Pass the coupon data to the parent component
                    if (response.data.data) {
                        onCouponData(response.data.data);
                    }
                } catch (error) {
                    console.error('Error validating coupon code:', error);
                    if (error.response && error.response.data) {
                        if (error.response.data.errors && error.response.data.errors.coupon_code) {
                            setErrors({ ...errors, coupon_code: error.response.data.errors.coupon_code[0] });
                        } else if (error.response.data.message) {
                            setErrors({ ...errors, coupon_code: error.response.data.message });
                        } else {
                            setErrors({ ...errors, coupon_code: 'An error occurred while validating the coupon code.' });
                        }
                    }
                }
            } else {
                // If the coupon_code field is empty, call the callback with an empty object
                onCouponData({});
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    return (
        <DynamicForm
            fields={fields}
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onBlur={handleInputChange}
            onSubmit={handleSubmit}
            customClasses="pt-0"
        />
    );
};

export default CouponCode;