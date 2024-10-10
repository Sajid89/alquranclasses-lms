import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateValidationSchema } from '../../../../utils/ValidationSchema';
import * as Yup from 'yup';

import { DynamicForm, StepComponent } from '../../../../components';
import { PAGE_TEXTS, COURSES, COURSE_LEVELS, TIMEZONES } from '../../../../data/TextConstants';
import SelectShiftsContext from '../../../../contexts/SelectShiftsContext';
import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';
import { setStudentInfo, setSelectedShift } from '../../../../store/studentsSlice';


const AddStudentInfo = () => {
    const fields = [
        { type: 'imageUpload', name: 'profile_image', buttonText: 'Upload Profile Picture' },
        { type: 'text', name: 'student_name', placeholder: 'Student Name' },
        { type: 'number', name: 'age', isRow: true, customMargins: 'mr-1', placeholder: 'Age' },
        { type: 'select', name: 'gender', isRow: true, customMargins: 'ml-1', options: [{id: 1, value: 'Male'}, {id: 2, value: 'Female'}], placeholder: 'Select Gender' },
        { type: 'select', name: 'course_id', options: COURSES, placeholder: 'Choose Course' },
        { type: 'select', name: 'course_level', options: COURSE_LEVELS, isRow: true, customMargins: 'mr-1', placeholder: 'Level' },
        { type: 'select', name: 'teacher_preference', options: [{id:1, value:'Male'}, {id:2, value:'Female'}], isRow: true, customMargins: 'ml-1', placeholder: 'Teacher Preference'},
        { type: 'shift', name: 'shift', placeholder: 'Availability (Max 1 slots)' },
        { type: 'select', name: 'student_timezone', options: TIMEZONES, isRow: true, customMargins: 'mr-1', placeholder: 'Timezone' },
        { type: 'select', name: 'trial_required', options: [{id:1, value:'Yes'}, {id:2, value:'No'}], isRow: true, customMargins: 'ml-1', placeholder: 'Want Trial Class?'},
        { type: 'buttons', name: 'submit', buttonOneText: 'Cancel', buttonTwoText: 'Continue'},
    ];

    // Get the stored form data from the Redux store
    const storedFormData = useSelector(state => state.students.studentInfo);
    const storedSelectedShifts = useSelector(state => state.students.selectedShifts);

    const [selectedShifts, setSelectedShifts] = useState(storedSelectedShifts || []);
    const validationSchema = generateValidationSchema(fields);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const initialFormData = {
        profile_image: null,
        student_name: '',
        age: '',
        gender: 1,
        course_id: COURSES[0].id,
        course_level: COURSE_LEVELS[0].id,
        teacher_preference: 1,
        student_timezone: TIMEZONES[0].value,
        trial_required: 1,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (location.state && location.state.fromSecondStep) {
            setFormData({
                profile_image: storedFormData.profile_photo_url || null,
                student_name: storedFormData.student_name || '',
                age: storedFormData.age || '',
                gender: storedFormData.gender || 1,
                course_id: storedFormData.course_id || COURSES[0].id,
                course_level: storedFormData.course_level || COURSE_LEVELS[0].id,
                teacher_preference: storedFormData.teacher_preference || 1,
                student_timezone: storedFormData.student_timezone || TIMEZONES[0].value,
                trial_required: storedFormData.trial_required || 1,
            });
            setSelectedShifts(storedSelectedShifts || []);
        } else {
            setFormData(initialFormData);
            setSelectedShifts([]);
        }
    }, [location.state, storedFormData, storedSelectedShifts]);

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleCancel = () => {
        navigate('/customer/welcome');
    };
    
    const handleNavigate = () => {
        navigate('/customer/student/add-availability?newStudent=true', { state: { fromSecondStep: true } });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            
            if(selectedShifts.length === 0) {
                toast.error('Please select at least one shift');
                return;
            }

            // Convert course_id from string to number
            const updatedFormData = {
                ...formData,
                course_id: parseInt(formData.course_id, 10),
                course_level: parseInt(formData.course_level, 10),
            };

            // Dispatch the actions to update the state in your Redux store
            dispatch(setStudentInfo(updatedFormData));
            dispatch(setSelectedShift(selectedShifts));

            handleNavigate();
        }   catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error dispatching actions:', error);
            }
        }
    };

    return (
        <div className='flex flex-col items-stretch main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center py-12 sm:py-16 px-4 sm:px-0'>

                <StepComponent 
                    stepNumber={1} 
                    stepTitle={PAGE_TEXTS.ADD_NEW_STUDENT.STUDENT_INFO}
                    stepTexts={[
                        PAGE_TEXTS.ADD_NEW_STUDENT.STUDENT_INFO,
                        PAGE_TEXTS.ADD_NEW_STUDENT.AVAILABILITY
                    ]} 
                    activeStep={0} 
                />

                <SelectShiftsContext.Provider value={{ selectedShifts, setSelectedShifts }}>                    
                    <DynamicForm
                        fields={fields}
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        customClasses="border-1 border-gray-100 p-6"
                    />
                </SelectShiftsContext.Provider>
            </div>
        </div>
    );
}

export default AddStudentInfo;