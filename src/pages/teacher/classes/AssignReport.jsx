import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Breadcrumb, DynamicForm } from '../../../components';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';

import { COURSES } from '../../../data/TextConstants';
import assignReport from '../../../data/images/assign_report.png';

const AssignReport = () => {
    const [students, setStudents] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [formData, setFormData] = useState({
        student_id: students.length > 0 ? students[0].id : null,
        course_id: filteredCourses.length > 0 ? filteredCourses[0].id : null
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/get-teacher-students');
                const data = response.data.data;
                const transformedData = data.map(student => ({
                    id: student.id,
                    value: student.name
                }));

                setStudents(transformedData);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            }
        };

        fetchStudents();

    }, []);

    let fields = [
        { type: 'select', name: 'student_id', placeholder: 'Student', options: students, onChange: (value) => fetchCoursesForStudent(value) },
        { type: 'select', name: 'course_id', placeholder: 'Course', options: filteredCourses },
        { type: 'fileUpload', name: 'document', placeholder: 'Attach Report', buttonText: 'Upload File' },
        { type: 'button', buttonText: 'Submit' }
    ];

    const validationSchema = generateValidationSchema(fields);
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (formData.student_id) {
            fetchCoursesForStudent(formData.student_id);
        }
    }, [formData.student_id]);

    useEffect(() => {
        if (students.length > 0) {
            fetchCoursesForStudent(students[0].id);
        }
    }, [students]);

    const fetchCoursesForStudent = async (studentId) => {
        try {
            setFilteredCourses([]);
            const response = await api.post('/student-active-courses', 
                { student_id: studentId });
            const data = response.data.data;
            const transformedData = data.map(course => ({
                id: course.id,
                value: course.course_title
            }));
            setFilteredCourses(transformedData);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            console.log(formData);
            const response = await api.post('/upload-progress-report', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success(response.data.message);
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error while uploading progress report', error);
            }
        }
    };

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6 mb-8'>
                <h3 className='font-semibold text-xl mb-4'>
                    Assign Reports
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Progress Reports', link: `/teacher/progress-reports` },
                        { name: 'Assign Report', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-1/2'>
                    <DynamicForm
                        fields={fields}
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        customClasses='pt-4'
                    />
                </div>
                <div className='w-1/2'>
                    <img src={assignReport} alt='Assign Report' className='w-full' />
                </div>
            </div>
        </div>
    );
}

export default AssignReport