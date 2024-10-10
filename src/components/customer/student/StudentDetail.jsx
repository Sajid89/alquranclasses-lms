import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setStudentInfo } from '../../../store/studentsSlice';

import { FiEdit2 } from 'react-icons/fi';
import courseIcon from '../../../data/icons/std_course.png';
import teacherIcon from '../../../data/icons/std_teacher.png';
import enrolledPlanIcon from '../../../data/icons/std_plan.png';

const StudentDetail = ({ student }) => {
    const course_id = parseInt(useParams().courseId, 10);
    const student_id =  student.id;
    const teacher_preference = student.teacher_preference;
    const student_timezone = student.student_timezone;
    const teacher_id = student.teacher_id;
    const course_level = student.course_level;
    const dispatch = useDispatch();

    return (
        <div>
            <div className="border-1 border-gray-200 p-4">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2">Course</h2>
                <div className="flex items-center mt-4">
                    <img src={courseIcon} alt="Course Icon" className="mr-4 w-8" />
                    <div>
                        <p className="font-medium">{ student.course }</p>
                        <p className="text-sm text-gray-600">Our Quran tutor will teach you a set of rules for the correct pronunciation of Quranic Alphabets.</p>
                    </div>
                </div>
            </div>

            <div className="border-1 border-gray-200 p-4 mt-3">
                <div className='border-b border-gray-200 pb-2 flex justify-between items-center'>
                    <h2 className="text-lg font-semibold">Assigned Teacher</h2>
                    <div className="flex items-center">
                        {student.plan && (
                            <>
                                <FiEdit2 className="mr-2" />
                                <Link to='/customer/student/change-teacher'
                                    onClick={() => dispatch(setStudentInfo(
                                        { 
                                            student_id, course_id, teacher_preference, 
                                            student_timezone, teacher_id, course_level 
                                        }
                                    ))}>
                                    Change
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <img src={teacherIcon} alt="Course Icon" className="mr-4 w-8" />
                    <div>
                        <p className="font-medium">{ student.teacher }</p>
                    </div>
                </div>
            </div>

            <div className="border-1 border-gray-200 p-4 mt-3">
                <div className='border-b border-gray-200 pb-2 flex justify-between items-center'>
                    <h2 className="text-lg font-semibold">Active Enrollment Plan</h2>
                    <div className="flex items-center">
                        {student.plan && (
                            <>
                                <FiEdit2 className="mr-2" />
                                <Link to='/customer/student/add-availability?changePlan=true' 
                                    onClick={() => dispatch(setStudentInfo({ student_id, course_id }))}>
                                    Change
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    {student.plan && (
                        <>
                            <img src={enrolledPlanIcon} alt="Course Icon" className="mr-4 w-8" />
                            <div>
                                <p className="font-medium">{ student.plan }</p>
                                {/* <p className="text-sm text-gray-600">{student.plan}</p> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;