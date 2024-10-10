import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { Breadcrumb, Tabs, DynamicForm, Spinner } from '../../../components';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';

const BankDetails = () => {
    const [bankDetails, setBankDetails ] = useState({});
    const [attachments, setAttachments] = useState({ front: '', back: '' });
    const [recordCreated, setRecordCreated] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            setLoading(true);
            try {
                const response = await api.get('/get-payment-method');
                if (response.data.data) {
                    const bankDetail = response.data.data;
                    const formattedBankDetails = {
                        bank_name: bankDetail.bank_name,
                        account_title: bankDetail.account_title,
                        account_number: bankDetail.account_number,
                        iban: bankDetail.iban,
                        id_card_no: bankDetail.id_card_no,
                        dob: bankDetail.dob,
                        is_approved: bankDetail.is_approved,
                        is_locked: bankDetail.is_locked
                    };
                    setBankDetails(formattedBankDetails);
    
                    setAttachments({
                        front: bankDetail.id_card_front_img || '',
                        back: bankDetail.id_card_back_img || ''
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch payment methods:", error);
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, [recordCreated]);

    let fields = [
        { type: 'text', name: 'bank_name', placeholder: 'Bank Name' },
        { type: 'text', name: 'account_title', placeholder: 'Account Title' },
        { type: 'number', name: 'account_number', placeholder: 'Account Number' },
        { type: 'text', name: 'iban', placeholder: 'IBAN' },
        { type: 'number', name: 'id_card_no', placeholder: 'National ID Card' },
        { type: 'teacherImagesUpload', name: 'attachments', uploadButtonText1: 'Upload Front Side', uploadButtonText2: 'Upload Back Side' },
        { type: 'datePicker', name: 'dob', placeholder: 'Date Of Birth' },
        { type: 'button', buttonText: 'Submit' }
    ];

    if (Object.keys(bankDetails).length > 0 && bankDetails.is_locked) {
        fields = fields.filter(field => field.type !== 'teacherImagesUpload' && field.type !== 'button');
        fields = fields.map(field => 
            field.type !== 'button' 
                ? { ...field, disabled: true } 
                : field
        );
    }
    
    const fieldsWithoutAttachments = fields.filter(field => field.name !== 'attachments');
    const validationSchema = generateValidationSchema(fieldsWithoutAttachments);

    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        if (Object.keys(bankDetails).length > 0) {
            setFormData(bankDetails);
        }
    }, [bankDetails]);

    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            let response;

            if (Object.keys(bankDetails).length > 0 && !bankDetails.is_locked) {
                response = await api.post('/update-payment-method', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await api.post('/create-payment-method', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            setRecordCreated(prev => prev + 1);
            toast.success(response.data.message);
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error("Submission error:", error);
            }
        } 
    };

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Bank Details
                </h3>
                <div>
                    <Breadcrumb items={[
                        { name: 'Payrolls', link: `/teacher/payroll` },
                        { name: 'Bank Details', active: true }
                    ]} />
                </div>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6 mt-4 md:mt-8'>
                <div className='w-full'>
                    {/* <h3 className='font-semibold mb-3'>Transaction & Billings</h3> */}
                    <Tabs 
                        tabs={[
                            { label: 'Bank Details', 
                                content:  <DynamicForm
                                    fields={fields}
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    onSubmit={handleSubmit}
                                    customClasses='pt-0'
                                />
                            },
                            { label: 'Attachments', 
                                content:  <div className='flex flex-wrap'>
                                    <img className='h-48 mb-2 md:mb-0 mr-2 border border-gray-200' src={attachments.front} alt='ID Card Front' />
                                    <img className='h-48 border border-gray-200' src={attachments.back} alt='ID Card Back' />
                                </div>
                            }
                        ]}
                        bankDetails={ Object.keys(bankDetails).length > 0 ? true : false}
                        isApproved={bankDetails.is_approved}
                    />
                    
                </div>
            </div>

            <Spinner loading={loading} text="Please wait..." />
        </div>
    );
}

export default BankDetails