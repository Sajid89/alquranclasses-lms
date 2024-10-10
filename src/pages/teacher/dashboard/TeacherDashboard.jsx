import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    ScheduleTabs, TicketViewSkeletonLoader, 
    Pagination, ClassAttendance
} from '../../../components';
import { USER_TYPES } from '../../../data/TextConstants';

import { AiOutlineUser, AiFillBook, AiOutlineClockCircle } from 'react-icons/ai';
import avatar from '../../../data/placedolder_avatar.jpg';
import api from '../../../utils/api';

const TeacherDashboard = () => {
    const teacher = useSelector(state => state.auth.profile);
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [scheduleData, setScheduleData] = useState({ today: [], upcoming: [] });
    const [totalClasses, setTotalClasses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [classesApiLoading, setClassesApiLoading] = useState(true);

    // Get current page for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsPerPage] = useState(8);

    // Get current notifications
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    // Change page
    const paginate = async (pageNumber) => {
        setLoading(true);
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.post('/get-notifications', { 
                    page: currentPage, limit: notificationsPerPage 
                });
                const data = response.data.data.notifications;
                setTotalNotifications(response.data.data.total);

                const notifications = data.map((item, index) => {
                    let icon;
                    if (item.type === 'trial_class' || item.type === 'regular_class') {
                        icon = <AiOutlineClockCircle />;
                    } else {
                        icon = <AiFillBook />;
                    }

                    return {
                        id: index + 1,
                        icon: icon,
                        type: item.type,
                        message: item.message,
                        create_at: item.create_at,
                    };
                });

                setNotifications(notifications);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [currentPage, notificationsPerPage]);

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const response = await api.post('/get-all-class-schedules', 
                    {teacher_id: teacher.id}
                );
                const { today, upcoming } = response.data.data;

                const transform = (schedule) => ({
                    date: schedule.date.split(' ')[0],
                    month: schedule.date.split(' ')[1],
                    courseName: schedule.course_title,
                    time: schedule.class_time,
                    profilePic: schedule.teacher_profile_picture || avatar,
                    studentName: schedule.student_name,
                });

                setScheduleData({
                    today: today.map(transform),
                    upcoming: upcoming.map(transform),
                });

                setTotalClasses(today.length);
            } catch (error) {
                console.error('Failed to fetch schedule data:', error);
            } finally {
                setClassesApiLoading(false);
            }
        };

        fetchScheduleData();
    }, [teacher]);
    //     'today': [
    //         {
    //             date: '07',
    //             month: 'June',
    //             courseName: 'Tajweed of the Quran',
    //             time: '10:00 AM - 11:00 AM',
    //             profilePic: avatar,
    //             studentName: 'John Doe',
    //         },
    //         {
    //             date: '07',
    //             month: 'June',
    //             courseName: 'Tajweed of the Quran',
    //             time: '11:00 AM - 11:30 AM',
    //             profilePic: avatar,
    //             studentName: 'John Doe',
    //         },
    //     ],
    //     'upcoming': [
    //         {
    //             date: '12',
    //             month: 'July',
    //             courseName: 'Tajweed of the Quran',
    //             time: '10:00 AM - 11:00 AM',
    //             profilePic: avatar,
    //             studentName: 'John Doe',
    //         },
    //         {
    //             date: '12',
    //             month: 'July',
    //             courseName: 'Tajweed of the Quran',
    //             time: '11:00 AM - 11:30 AM',
    //             profilePic: avatar,
    //             studentName: 'John Doe',
    //         },
    //         {
    //             date: '12',
    //             month: 'July',
    //             courseName: 'Tajweed of the Quran',
    //             time: '12:00 AM - 12:30 AM',
    //             profilePic: avatar,
    //             studentName: 'John Doe',
    //         },
    //     ],
    // };

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Dashboard
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full lg:w-8/12'>
                    <h3 className='font-semibold w-full mb-3'>Timeline</h3>
                    {loading ? (
                        <TicketViewSkeletonLoader />
                    ) : (
                        <div className='shadow-md rounded border-gray-200 border-t-1'>
                            {notifications.length === 0 ? (
                                <div className='p-3 text-center text-gray-500'>
                                    No notifications available
                                </div>
                            ) : (
                                <>
                                    {notifications.map((notification, index) => (
                                        <div key={index} className={`flex items-center p-3 ${index === 0 ? 'bg-light-green' : ''}`}>
                                            <div className={`mr-3 text-center px-2 py-2 rounded-full ${index === 0 ? 'bg-light-dark-green' : 'bg-light-green'}`}>
                                                {React.cloneElement(notification.icon, { className: 'text-green', size: '1.5em' })}
                                            </div>
                                            <div className='mr-3'>
                                                <p>{notification.message}</p>
                                                <div className='text-gray-500 text-xs my-0.5'>
                                                    {notification.create_at}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='pb-3 pr-4'>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalItems={totalNotifications}
                                            itemsPerPage={notificationsPerPage}
                                            paginate={paginate}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className='mt-8'>
                        <ClassAttendance teacherId={teacher.id} user={USER_TYPES.TEACHER} />
                    </div>
                </div>
                <div className='w-full md:w-4/12 md:ml-6 mt-8 md:mt-0'>
                    <h3 className='font-semibold mb-3'>Class Schedule</h3>
                    <ScheduleTabs data={scheduleData} loading={classesApiLoading} />
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
