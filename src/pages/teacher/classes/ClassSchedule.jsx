import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, Tabs } from '../../../components';
import api from '../../../utils/api';

const ClassSchedule = () => {
    const [upcomingClassesSchedule, setUpcomingClassesSchedule] = useState([]);
    const [totalUpcomingClasses, setTotalUpcomingClasses] = useState(0);
    const [pastClassesSchedule, setPastClassesSchedule] = useState([]);
    const [totalPreviousClasses, setTotalPreviousClasses] = useState(0);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateClasses, setUpdateClasses] = useState(false);

    const tableHeaders = [
        'date & time', 'student', 'course', 'status', 'actionButton'
    ];

    useEffect(() => {
        setLoading(true);
        const bodyParameters = {
            page: currentPage,
            limit: itemsPerPage
        };

        const fetchData = () => {
            Promise.all([
                api.post('/teacher-upcoming-classes', bodyParameters),
                api.post('/teacher-previous-classes', bodyParameters)
            ])
            .then(([upcomingResponse, previousResponse]) => {
                const upcomingResponseData = upcomingResponse.data.data;
                setTotalUpcomingClasses(upcomingResponseData.total_upcoming_count);
                const previousResponseData = previousResponse.data.data;
                setTotalPreviousClasses(previousResponseData.total_previous_classes);

                const upcomingClassesData = [
                    ...upcomingResponseData.upcoming_weekly_classes.map(classData => {
                        const timeDifference = classData.class_time_unix - classData.current_time_unix;
                        const classDuration = 30 * 60;

                        return {
                            class_id: classData.class_id,
                            student_id: classData.student_id,
                            teacher_id: classData.teacher_id,
                            date: classData.date,
                            time: classData.class_time,
                            student: classData.student_name,
                            teacher: classData.teacher_name,
                            course_id: 2,
                            course: classData.course_title,
                            status: classData.status.charAt(0).toUpperCase() + classData.status.slice(1),
                            type: 'regular',
                            actionButton: (timeDifference <= 60 && timeDifference >= -classDuration) ? 'Join Class' : 'Makeup Request',
                            userType: 'teacher'
                        };
                    }),
                    ...upcomingResponseData.upcoming_trial_classes.map(classData => {
                        const timeDifference = classData.class_time_unix - classData.current_time_unix;
                        const classDuration = 30 * 60;

                        return {
                            class_id: classData.class_id,
                            student_id: classData.student_id,
                            teacher_id: classData.teacher_id,
                            date: classData.date,
                            time: classData.class_time,
                            student: classData.student_name,
                            teacher: classData.teacher_name,
                            course: classData.course_title,
                            status: classData.status,
                            type: 'trial',
                            actionButton: (timeDifference <= 60 && timeDifference >= -classDuration) ? 'Join Class' : 'Makeup Request',
                            userType: 'teacher'
                        };
                    })
                ];

                const pastClassesData = [
                    ...previousResponseData.previous_weekly_classes.map(classData => ({
                        class_id: classData.class_id,
                        date: classData.date,
                        time: classData.class_time,
                        student: classData.student_name,
                        student_id: classData.student_id,
                        teacher: classData.teacher_name,
                        course: classData.course_title,
                        status: classData.status,
                        type: 'regular',
                        actionButton: 'View Details'
                    })),
                    ...previousResponseData.previous_trial_classes.map(classData => ({
                        class_id: classData.class_id,
                        date: classData.date,
                        time: classData.class_time,
                        student: classData.student_name,
                        student_id: classData.student_id,
                        teacher: classData.teacher_name,
                        course: classData.course_title,
                        status: classData.status,
                        type: 'trial',
                        actionButton: 'View Details'
                    }))
                ];

                setUpcomingClassesSchedule(upcomingClassesData);
                setPastClassesSchedule(pastClassesData);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            })
            .finally(() => {
                setLoading(false);
            });
        };

        fetchData();

        // Set up interval to update class data every minute
        const intervalId = setInterval(fetchData, 60000); // 60000 ms = 1 minute

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [currentPage, itemsPerPage, updateClasses]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Scheduled Classes
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    {/* <h3 className='font-semibold mb-3'>Transaction & Billings</h3> */}
                    <Tabs 
                        tabs={[
                            { label: 'Upcoming Classes', content: <TableComponent 
                                headers={tableHeaders} 
                                data={upcomingClassesSchedule} 
                                loading={loading} 
                                showCourses={true} 
                                pagination={true} 
                                currentPage={currentPage} 
                                totalItems={totalUpcomingClasses} 
                                itemsPerPage={itemsPerPage} 
                                paginate={paginate}
                                updateData={setUpdateClasses}
                            /> },
                            { label: 'Previous Classes', content: <TableComponent 
                                headers={tableHeaders} 
                                data={pastClassesSchedule} 
                                loading={loading} 
                                showCourses={true} 
                                pagination={true} 
                                currentPage={currentPage} 
                                totalItems={totalPreviousClasses} 
                                itemsPerPage={itemsPerPage} 
                                paginate={paginate}
                            /> }
                        ]}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default ClassSchedule