import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, Tabs } from '../../../../components';
import api from '../../../../utils/api';

const Recordings = () => {
    const { studentName } = useParams();
    const students = useSelector(state => state.students.data);
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    
    const [upcomingClassesSchedule, setUpcomingClassesSchedule] = useState([]);
    const [pastClassesSchedule, setPastClassesSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Change this to the number of items you want per page

    const tableHeaders = [
        'date & time', 'file', 'course', 'duration', 'actionButton'
    ];

    const upcomingClassesData = [
        {
            date: '2021-09-01',
            time: '10:00 AM',
            file: 'RecitationOfQuran.mp4',
            size: '1.5 MB',
            course: 'Recitation of Quran',
            duration: '00:34:22',
            actionButton: 'View',
            URL: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ'
        },
        {
            date: '2021-09-02',
            time: '11:00 AM',
            file: 'RecitationOfQuran.mp4',
            size: '1.5 MB',
            course: 'Tajweed of Quran',
            duration: '00:34:22',
            actionButton: 'View',
            URL: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ'
        },
        {
            date: '2021-09-03',
            time: '12:00 PM',
            file: 'RecitationOfQuran.mp4',
            size: '1.5 MB',
            teacher: 'John Doe',
            course: 'Hifz Quran',
            duration: '00:34:22',
            actionButton: 'View',
            URL: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ'
        }
    ];

    useEffect(() => {
        // Fetch classes schedule
    }, []);

    const totalUpcomingClasses = upcomingClassesData.length;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                Recordings
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    {/* <h3 className='font-semibold mb-3'>Transaction & Billings</h3> */}
                    <TableComponent 
                        headers={tableHeaders} 
                        data={upcomingClassesData} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={totalUpcomingClasses} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        stduentName={studentName}
                        recordings={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default Recordings