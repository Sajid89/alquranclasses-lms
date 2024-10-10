import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import avatar from '../../../data/placedolder_avatar.jpg';
import { StudentCourseCard } from '../../../components';
import { Spinner } from '../../../components';

import { setStudentInfo } from '../../../store/studentsSlice';


const StudentProfile = () => {
    const students = useSelector(state => state.students.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studentName } = useParams();

    // If students data is not yet loaded, display the Spinner
    if (!students.length) {
        return <Spinner loading={true} text='Loading student profile...' />;
    }
    
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    
    

    const handleSubscriptionNavigation = (courseId, teacherPreference, shiftId, studentCourseId) => {
        const studentData = {
            student_id: student.id,
            course_id: courseId,
            teacher_preference: teacherPreference,
            shift_id: shiftId,
            student_timezone: student.timezone,
            student_course_id: studentCourseId,
        };
    
        dispatch(setStudentInfo(studentData));

        // Redirect to the subscription page
        navigate(`/customer/student/add-availability?buySubscritionAfterTrial=true&&student=${student.name.toLowerCase()}`);
    };

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full md:w-6/12'>
                    <div className='flex flex-row items-center'>
                        <img 
                            src={ student && student.profile_photo_url ? student.profile_photo_url : avatar } 
                            alt="Profile" 
                            className='rounded-full w-20 border-1 border-gray-500' />
                        <div className='ml-4'>
                            <p className='font-semibold mb-1'>{student.name}</p>
                            <p className='text-xs text-gray-400'>{student.reg_no}</p>
                            <p className='text-xs text-gray-400'>{student.age} years, <span className='capitalize'>{student.gender}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6 mt-4'>
                <div className='w-full'>
                    <div className='w-full mt-4 mb-6 bg-gray-200 h-px'></div>
                    <StudentCourseCard 
                        studentName={student.name} 
                        courseList={student.courses} status={student.status}
                        onNavigateToSubscription={handleSubscriptionNavigation} 
                    />
                </div>
            </div>
        </div>
    )
}

export default StudentProfile