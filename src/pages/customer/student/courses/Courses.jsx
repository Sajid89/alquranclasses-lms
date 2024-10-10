import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StudentCourseCard, Spinner } from '../../../../components';


const Courses = () => {
    const students = useSelector(state => state.students.data);
    const { studentName } = useParams();
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full flex flex-col items-center text-center'>
                    <p className='font-semibold mb-4'>
                        Please select a course of which you want to see the activity log.
                    </p>
                    <StudentCourseCard 
                        studentName={student.name} courseList={student.courses} 
                        status={student.status}
                        student={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default Courses