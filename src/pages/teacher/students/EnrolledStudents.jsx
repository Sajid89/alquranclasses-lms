import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, Tabs } from '../../../components';
import api from '../../../utils/api';

const EnrolledStudents = () => {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [totalEnrolledStudents, setTotalEnrolledStudents] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateClasses, setUpdateClasses] = useState(false);

    const tableHeaders = [
        'student', 'course', 'attachments', 'activity'
    ];

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const response = await api.post('/get-teacher-active-students', 
                    {
                        page: currentPage,
                        limit: itemsPerPage
                    }
                );
                const data = response.data.data;
                const transformedData = data.students.map(student => ({
                    student_id: student.student_id,
                    course_id: student.course_id,
                    student: student.student_name,
                    course: student.course_title,
                    attachments: 'Manage Attachments',
                    activity: 'View Activity'
                }));


                setEnrolledStudents(transformedData);
                setTotalEnrolledStudents(data.count);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();

    }, [currentPage, itemsPerPage, updateClasses]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='mt-20 md:mt-0 mb-8'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Enrolled Students
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={enrolledStudents} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={totalEnrolledStudents} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateClasses}
                    />
                </div>
            </div>
        </div>
    );
}

export default EnrolledStudents