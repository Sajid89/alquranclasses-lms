import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon1 from '../../../data/icons/std_course_1.png';
import Icon2 from '../../../data/icons/std_course_2.png';
import Icon3 from '../../../data/icons/std_course_3.png';
import { FaPlus } from 'react-icons/fa';

import { CustomButton } from '../../../components';
import { STUDENT_STATUS } from '../../../data/TextConstants';

const StudentCourseCard = ({ 
    studentName, courseList, status, 
    student, onNavigateToSubscription 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isCustomerUrl = location.pathname.includes('customer');

    const colors = [
        {
            bg: '#fbf6e6',
            color: '#DAAD0C'
        }, 
        {
            bg: '#fce5ec',
            color: '#E30447',
        }, 
        {
            bg: '#fcf1e5',
            color: '#E37304'
        }
    ];
    const icons = [Icon1, Icon2, Icon3];

    const handleNavigateToSubscription = (
        courseId, teacherPreference, shiftId, studentCourseId
    ) => {
        if (onNavigateToSubscription) {
            onNavigateToSubscription(courseId, teacherPreference, shiftId, studentCourseId);
        }
    }

    return (
        <div className='flex flex-col sm:flex-row justify-left'>
            {courseList.slice(0, 3).map((course, index) => (
                <div key={index} className='relative border border-gray-300 p-4 mr-0 mb-4 sm:mr-4 flex flex-col items-center justify-center w-full sm:w-64 height-auto sm:h-40'>
                    <Link 
                        to={student ? 
                            `/student/${studentName.toLowerCase()}/course-activity/${course.name.toLowerCase().replace(/ /g, '-')}` : 
                            `/customer/student-details/${studentName.toLowerCase()}/${course.id}`}  
                    >
                        <div className='flex flex-col items-center'>
                            <img src={icons[index]} width={32} />
                            <p className='text-center mt-4'>{course.name}</p>
                        </div>
                    </Link>
                    <div className='flex mt-3 items-center'>
                        <p className='p-2 capitalize text-xs rounded-sm' 
                            style={{backgroundColor: colors[index].bg, color: colors[index].color}}>
                            {course.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </p>
                        {course.status === STUDENT_STATUS.TRIALSUCCESSFUL && isCustomerUrl &&
                            <CustomButton 
                                customClass="bg-green text-white text-xs p-2 ml-2 rounded-sm"
                                zeroPadding={true}
                                onClick={() => handleNavigateToSubscription(
                                    course.id, course.teacher_preference, 
                                    course.shift_id, course.student_course_id
                                )}
                            >
                                Subscribe
                            </CustomButton>
                        }
                    </div>
                </div>
            ))}
            {courseList.length < 3 && !student && (
                <div className='border border-gray-300 p-4 mb-4 flex flex-col items-center justify-center w-full sm:w-64'>
                    <Link to={`/customer/student/${studentName.toLowerCase()}/add-course`}>
                        <div className='flex flex-col items-center justify-center'>
                            <FaPlus size={24} />
                            <p className='text-center mt-4'>Add Course</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default StudentCourseCard;