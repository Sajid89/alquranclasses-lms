import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { Tabs, ClassCardList } from '../../../components';
import { Spinner } from '../../../components';
import api from '../../../utils/api';

const ClassSchedule = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const [selectedDate, setSelectedDate] = useState(formattedDate);
    const [classes, setClasses] = useState({ live: [], upcoming: [], previous: [] });
    const students = useSelector(state => state.students.data);
    const { studentName } = useParams();
    const courseId = parseInt(useParams().courseId, 10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClassSchedules = async () => {
            setIsLoading(true);
            try {
                const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
                const response = await api.post('get-student-course-class-schedules', {
                    student_id: student.id,
                    course_id: courseId,
                    date: selectedDate
                });
                console.log('Class schedules:', response.data.data);
                setClasses(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch class schedules:', error.message);
                setIsLoading(false);
            }
        };

        if (students.length) {
            fetchClassSchedules();
        }
    }, [selectedDate]);

    // If students data is not yet loaded, display the Spinner
    if (!students.length) {
        return <Spinner loading={true} text='Loading student profile...' />;
    }

    const handleDateChange = (args) => {
        const date = args.value;
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setSelectedDate(formattedDate);
    };

    return (
        <div className='flex flex-col lg:flex-row'>
            <div className='w-full lg:w-4/12'>
                <CalendarComponent 
                    value={selectedDate} 
                    change={handleDateChange}
                    //min={currentDate}
                />
            </div>
            <div className='w-full lg:w-8/12 mt-4 md:mt-0'>
                <Tabs 
                    tabs={[
                        { label: 'Today', content: <ClassCardList classes={classes.today} isLoading={isLoading} today={true} />, bgColor: true },
                        { label: 'Upcoming', content: <ClassCardList classes={classes.upcoming} isLoading={isLoading} />, bgColor: true },
                        { label: 'Previous', content: <ClassCardList classes={classes.previous} isLoading={isLoading} />, bgColor: true }
                    ]}
                />
            </div>
        </div>
    )
}

export default ClassSchedule