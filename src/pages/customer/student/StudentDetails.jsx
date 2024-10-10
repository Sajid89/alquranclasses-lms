import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Tabs, ClassSchedule,  ClassAttendance, StudentDetail, Breadcrumb } from '../../../components';
import { Spinner } from '../../../components';
import { COURSE_LEVELS, USER_TYPES } from '../../../data/TextConstants';

const StudentDetails = () => {
    const [activeTab, setActiveTab] = useState('Class Schedule');
    const students = useSelector(state => state.students.data);
    const { studentName } = useParams();
    const courseId = parseInt(useParams().courseId, 10);

    // If students data is not yet loaded, display the Spinner
    if (!students.length) {
        return <Spinner loading={true} text='Loading student profile...' />;
    }
    
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    const course = student.courses.find(course => course.id === courseId);
    const teacher = student.teachers.find(teacher => teacher.course_id === course.id);

    const studentDetail = {
        id: student.id,
        teacher: teacher.name,
        course: course.name,
        course_level: COURSE_LEVELS.find(level => 
            level.value.toLowerCase().charAt(0).toUpperCase() + level.value.toLowerCase().slice(1) === 
            course.level.toLowerCase().charAt(0).toUpperCase() + course.level.toLowerCase().slice(1)
        ).id,
        plan: course.stripe_plan,
        teacher_preference: teacher.gender === 'male' ? 1 : 0,
        student_timezone: student.timezone,
        teacher_id: teacher.id
    }

    return (
        <div>
            <div className='w-full pl-6 pr-6'>
                <Breadcrumb items={[
                    { name: student.name, link: '/customer/student-profile/'+student.name.toLowerCase() },
                    { name: activeTab, active: true }
                ]} />
            </div>
            <div className='mt-20 md:mt-6 mb-4'>
                <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                    <div className='w-full'>
                        <Tabs 
                            tabs={[
                                { label: 'Class Schedule', content: <ClassSchedule /> },
                                { label: 'Class Attendance', content: <ClassAttendance studentId={student.id} courseId={courseId} user={USER_TYPES.STUDENT} /> } ,
                                { label: 'Details', content: <StudentDetail student={studentDetail} /> }
                            ]}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDetails