import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setStudentInfo, setSelectedShift } from '../../../../store/studentsSlice';

import { setWantTrial } from '../../../../store/features/trialClassSlice';
import { generateValidationSchema } from '../../../../utils/ValidationSchema';
import * as Yup from 'yup';

import SelectShiftsContext from '../../../../contexts/SelectShiftsContext';
import { StudentContext } from '../../../../contexts/StudentContext';
import { toast } from 'react-toastify';

import { DynamicForm, StepComponent } from '../../../../components';
import { PAGE_TEXTS, COURSES, COURSE_LEVELS } from '../../../../data/TextConstants';

const AddCourseInfo = () => {
    const fields = [
        { type: 'select', name: 'course_id', options: COURSES, placeholder: 'Choose Course' },
        { type: 'select', name: 'course_level', options: COURSE_LEVELS, placeholder: 'Level' },
        { type: 'select', name: 'teacher_preference', options: [{id:1, value:'Male'}, {id:2, value:'Female'}], placeholder: 'Teacher Preference'},
        { type: 'shift', name: 'shift', placeholder: 'Availability (Max 1 slots)' },
        { type: 'select', name: 'trial_required', options: [{id:1, value:'Yes'}, {id:2, value:'No'}], customMargins: 'ml-1', placeholder: 'Want Trial Class?'},
        { type: 'buttons', buttonOneText: 'Cancel', buttonTwoText: 'Confirm'},
    ];

    // Get the stored form data from the Redux store
    const students = useSelector(state => state.students.data);
    const { studentName } = useParams();
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    const courses = student.courses;
    const storedFormData = useSelector(state => state.students.studentInfo);
    const storedSelectedShifts = useSelector(state => state.students.selectedShifts);

    const [selectedShifts, setSelectedShifts] = useState(storedSelectedShifts || []);
    const validationSchema = generateValidationSchema(fields);
    const dispatch = useDispatch();

    let { setStudentName } = useContext(StudentContext);

    useEffect(() => {
        setStudentName(studentName);
    }, [studentName]);

    const [formData, setFormData] = useState({
        student_id: student.id,
        course_id: storedFormData.course_id || COURSES[0].id,
        course_level: storedFormData.course_level || COURSE_LEVELS[0].id,
        teacher_preference: storedFormData.teacher_preference || 1,
        student_timezone: student.timezone,
        trial_required: storedFormData.trial_required || 1,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const navigate = useNavigate();
    
    const handleNavigate = () => {
        navigate('/customer/student/add-availability?newStudent=false');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            
            if (courses.some(course => course.id === formData.course_id)) {
                toast.error('You are already enrolled in this course!');
                return;
            }

            if(selectedShifts.length === 0) {
                toast.error('Please select at least one shift!');
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
                    stepNumber={2} 
                    stepTitle={PAGE_TEXTS.ADD_NEW_STUDENT.COURSE_INFO}
                    stepTexts={[
                        PAGE_TEXTS.ADD_NEW_STUDENT.COURSE_INFO, 
                        PAGE_TEXTS.ADD_NEW_STUDENT.AVAILABILITY
                    ]} 
                    activeStep={1} 
                />

                <SelectShiftsContext.Provider value={{ selectedShifts, setSelectedShifts }}>                    
                    <DynamicForm
                        fields={fields}
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        customClasses="border-1 border-gray-100 p-6"
                    />
                </SelectShiftsContext.Provider>
            </div>
        </div>
    );
}

export default AddCourseInfo;