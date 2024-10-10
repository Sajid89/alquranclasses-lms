import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Pie } from '../../../components';
import api from '../../../utils/api';
import { USER_TYPES } from '../../../data/TextConstants';

const ClassAttendance = ({ teacherId, studentId, courseId, user }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [monthlyAttendance, setMonthlyAttendance] = useState({});

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth > 0 ? prevMonth - 1 : 11));
    };

    const handleNextMonth = () => {
        setCurrentMonth((nextMonth) => (nextMonth < 11 ? nextMonth + 1 : 0));
    };

    useEffect(() => {
        const fetchData = async () => {
            let params = {
                month: `${new Date().getFullYear()}-${('0' + (currentMonth + 1)).slice(-2)}`
            }
            let apiURL;

            if (studentId) {
                apiURL = 'get-student-course-attendance';
                params = {
                    ...params,
                    student_id: studentId,
                    course_id: courseId,
                }
            } else {
                apiURL = 'teacher-class-report';
                params = {
                    ...params,
                    teacher_id: teacherId
                } 
            }

            try {
                const response = await api.post(apiURL, params);
                setMonthlyAttendance(response.data.data);
                //console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch attendance data:', error);
            }
        };

        fetchData();
    }, [currentMonth, teacherId]);

    return (
        <div className='w-full'>
            <div className='flex items-center justify-center mb-4'>
                <button className='bg-gray-300 rounded-full p-1.5' onClick={handlePrevMonth}>
                    <FaChevronLeft size={10} />
                </button>
                <p className='mx-2'>{monthNames[currentMonth]}</p>
                <button className='bg-gray-300 rounded-full p-1.5' onClick={handleNextMonth}>
                    <FaChevronRight size={10} />
                </button>
            </div>
            
            <div className='w-full p-4 mb-2 flex items-center justify-between border-1 border-gray-200'>
                <div className="text-left">
                    <p className="font-semibold text-green">Total Number of Classes in {monthNames[currentMonth]}</p>
                    <p className='text-gray-600 text-xs'>
                        {user.charAt(0).toUpperCase() + user.slice(1)}’s Monthly Report
                    </p>
                </div>
                <div className="text-right">
                    <p className='text-lg font-semibold'>
                        { monthlyAttendance.totalClasses ? monthlyAttendance.totalClasses : 0 }
                    </p>
                </div>
            </div>

            <Pie attendanceData={monthlyAttendance} />
        </div>
    )
}

export default ClassAttendance