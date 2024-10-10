import React, { useState } from 'react';
import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { DynamicForm, Spinner } from '../../../components';
import { COURSES, FRESH_DESK_TYPES } from '../../../data/TextConstants';
import { useSelector } from 'react-redux';
import api from '../../../utils/api';

const AddStudentInfo = () => {
    const types = FRESH_DESK_TYPES;
    const storedStudents = useSelector(state => state.students.data);
    const students = storedStudents.map(student => student.name);
    const [apiLoading, setApiLoading] = useState(false);
    const [images, setImages] = useState([]);

    const fields = [
        { type: 'text', name: 'subject',  isRow: true, customMargins: 'mr-1', placeholder: 'Type Subject' },
        { type: 'select-2', name: 'type', isRow: true, customMargins: 'ml-1', options: types, placeholder: 'Choose An Option' },
        { type: 'select-2', name: 'student_name', isRow: true, customMargins: 'mr-1', options: students, placeholder: 'Choose Student' },
        { type: 'select', name: 'course_name', options: COURSES, isRow: true, customMargins: 'ml-1', placeholder: 'Choose Course' },
        { type: 'textarea', name: 'description', placeholder: 'Write your issue here' },
        { type: 'multipleImageUpload', name: 'attachments', buttonText: 'Upload Attachments'},
        { type: 'button', name: 'submit', buttonText: 'Submit'},
    ];

    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState({
        type: types[0],
        student_name: students[0],
        course_name: COURSES[0].value,
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setApiLoading(true);
            const response = await api.post('/create-ticket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Ticket Created Successfully');

            setFormData({
                ...formData,
                subject: '',
                description: '',
            });

            setImages([]);
            setErrors({});
        }  catch (error) {
            setApiLoading(false);
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            else {
                console.log('Error creating ticket:', error);
            }
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className='mt-12 md:mt-0 mb-4'>
            <div className='w-full flex-grow bg-white flex flex-col 
                rounded-bl-10xl py-12 sm:py-8 
                px-6 md:px-16'>
                <h1 className='text-2xl font-semibold mb-2'>Create Ticket</h1>
                <p className='text-sm text-gray-500 mb-4'>
                    Please fill in the form below to create a ticket.
                </p>

                <DynamicForm
                    fields={fields}
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    images={images} 
                    setImages={setImages}
                    isMaxWidth={true}
                    customClasses="border-1 border-gray-100 p-6"
                />
            </div>

            <Spinner loading={apiLoading} text="Please wait..." />
        </div>
    );
}

export default AddStudentInfo;