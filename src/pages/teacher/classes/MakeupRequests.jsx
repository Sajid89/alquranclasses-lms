import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, Tabs } from '../../../components';
import api from '../../../utils/api';

const ClassSchedule = () => {
    const [makeupRequests, setmakeupRequests] = useState([]);
    const [totalMakeupRequests, setTotalMakeupRequests] = useState(0);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateData, setUpdateData] = useState(false);

    const tableHeaders = [
        'student', 'course', 'previous', 'new', 'status', 'actionButton'
    ];

    useEffect(() => {
        const fetchTeacherRequests = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/teacher-makeup-requests?page=${currentPage}&limit=${itemsPerPage}`);
                const data = response.data.data;

                setTotalMakeupRequests(data.total);
                setmakeupRequests(data.requests);
            } catch (error) {
                console.error('Failed to fetch teacher makeup requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherRequests();
    }, [updateData]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='mt-20 md:mt-0 mb-8'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Makeup Requests
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={makeupRequests} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={totalMakeupRequests} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateData}
                    />
                </div>
            </div>
        </div>
    );
}

export default ClassSchedule