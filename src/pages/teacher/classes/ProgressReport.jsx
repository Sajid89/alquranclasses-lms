import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, CustomButton } from '../../../components';
import api from '../../../utils/api';

const ProgressReport = () => {
    const [progressReports, setProgressReports] = useState([]);
    const [totalProgressReports, setTotalProgressReports] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateClasses, setUpdateClasses] = useState(false);

    const tableHeaders = [
        'student', 'course', 'actionButton'
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
                    actionButton: 'View Reports',
                }));


                setProgressReports(transformedData);
                setTotalProgressReports(data.count);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();

    }, [currentPage, itemsPerPage, updateClasses]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const navigate = useNavigate();

    return (
        <div className='mt-20 md:mt-0 mb-8'>
            <div className='flex flex-row justify-between pl-6 pr-6 w-full'>
                <h3 className='font-semibold text-xl mb-4'>
                    Progress Reports
                </h3>
                <CustomButton 
                    customClass="bg-green text-white text-xs mb-4"
                    onClick={() => navigate('/teacher/assign-report')}
                >
                    Assign Report
                </CustomButton>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={progressReports} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={totalProgressReports} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateClasses}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProgressReport