import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Breadcrumb, TableComponent } from '../../../components';
import avatar from '../../../data/placedolder_avatar.jpg';
import api from '../../../utils/api';
import { USER_TYPES } from '../../../data/TextConstants';

const ViewStudentReports = () => {
    const { studentID, courseID } = useParams();
    const[reportDetails, setReportDetails] = useState([]);
    const [totalReports, setTotalReports] = useState(0);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateData, setUpdateData] = useState(false);

    const tableHeaders = [
        'file', 'student', 'course', 'date', 'actionButton'
    ];

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            setLoading(true);
            try {
                const response = await api.post('/get-student-progress-reports', {
                    student_id: studentID,
                    page: currentPage,
                    limit: itemsPerPage
                });

                if (response.data.data) {
                    const data = response.data.data;
                    console.log('data:', data);
                    
                    const formattedReportDetails = data.reports.map(report => ({
                        type: 'progress-report',
                        id: report.id,
                        student_id: report.student_id,
                        course_id: report.course_id,
                        student: report.student_name,
                        course: report.course_name,
                        date: report.created_at,
                        file: report.file,
                        size: report.file_size,
                        file_url: report.file_url,
                        actionButton: 'crud'
                    }));

                    console.log('formattedReportDetails:', formattedReportDetails);

                    setReportDetails(formattedReportDetails);
                    setTotalReports(data.count);
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch student progress reports:", error);
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, [updateData]);

    const total = reportDetails.length;
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6 mb-8'>
                <h3 className='font-semibold text-xl mb-4'>
                    All Reports
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Progress Reports', link: `/teacher/progress-reports` },
                        { name: 'View All Reports', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={reportDetails} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={total} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateData}
                    />
                </div>
            </div>
        </div>
    );
}

export default ViewStudentReports