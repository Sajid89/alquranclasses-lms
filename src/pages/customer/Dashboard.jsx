import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Joyride, { STATUS } from 'react-joyride';

import { Card, Table, ScheduleTabs } from '../../components';
import { FaUserGraduate, FaBook, FaClock } from 'react-icons/fa';
import avatar from '../../data/placedolder_avatar.jpg';
import api from '../../utils/api';

const Dashboard = () => {
    const students = useSelector(state => state.students.data);
    const studentsLoading = useSelector(state => state.students.loading);
    const [scheduleData, setScheduleData] = useState({ today: [], upcoming: [] });
    const [totalClasses, setTotalClasses] = useState(0);
    const [runTour, setRunTour] = useState(false);
    const [classesApiLoading, setClassesApiLoading] = useState(true);

    const [hasTourFinished, setHasTourFinished] = useState(
        () => JSON.parse(localStorage.getItem('hasTourFinished')) || false
    );

    const steps = [
        {
            target: '.sidebar-item-5',
            content: 'Click here to add a new student.',
        },
        {
            target: '.sidebar-item-4',
            content: 'Click here to view all students.',
        },
        {
            target: '.sidebar-item-3',
            content: 'Click here to view/update your profile settings.',
        }
    ];

    useEffect(() => {
        if (!studentsLoading && students.length === 0 && !hasTourFinished) {
            setRunTour(true);
        }
    }, [students, hasTourFinished, studentsLoading]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            setHasTourFinished(true);
            localStorage.setItem('hasTourFinished', 'true');
        }
    };

    // Transform the data to fit the table component
    const transformedStudents = students.map(student => ({
        name: student.name,
        profilePic: student.profile_photo_url || avatar,
        enrolledCourses: student.subscription_plans,
        attendance: student.attendance,
    }));

    // Calculate the total number of students and plans
    const totalStudents = students.length;
    const totalPlans = students.reduce((total, student) => total + student.subscription_plans, 0);
    

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const response = await api.post('/get-all-class-schedules');
                const { today, upcoming } = response.data.data;

                const transform = (schedule) => ({
                    date: schedule.date.split(' ')[0],
                    month: schedule.date.split(' ')[1],
                    courseName: schedule.course_title,
                    time: schedule.class_time,
                    profilePic: schedule.teacher_profile_picture || avatar,
                    studentName: schedule.teacher_name,
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
    }, []);

    const cards = [
        { icon: <FaUserGraduate />, text: 'Students', number: totalStudents },
        { icon: <FaBook />, text: 'Active Plans', number: totalPlans },
        { icon: <FaClock />, text: 'Today’s Classes', number: totalClasses },
    ];

    return (
        <div>
            <Joyride
                steps={steps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
            />

            <div className='mt-20 md:mt-4 mb-4'>
                <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                    <div className='w-full lg:w-8/12'>
                        <h3 className='font-semibold w-full mb-3'>Overview</h3>
                        <div className='flex'>
                            {cards.map((card, index) => (
                                <Card
                                    key={index}
                                    style={{ 
                                        width: '200px', 
                                        marginRight: index !== cards.length - 1 ? '1rem' : '0' 
                                    }}
                                    icon={card.icon}
                                    text={card.text}
                                    number={card.number}
                                />
                            ))}
                        </div>

                        <div className='mb-4'>
                            <h3 className='font-semibold w-full mt-4 mb-3'>Student Performance</h3>
                            <Table data={transformedStudents} />
                        </div>
                    </div>
                    <div className='w-full lg:w-4/12 md:ml-6'>
                        <h3 className='font-semibold mb-3'>Class Schedule</h3>
                        <ScheduleTabs data={scheduleData} loading={classesApiLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard