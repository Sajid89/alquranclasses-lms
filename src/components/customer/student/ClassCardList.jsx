import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard';
import { useSelector } from 'react-redux';

const SkeletonLoader = () => (
    <div className="w-full p-4 mb-2 flex items-center justify-between border-1 border-gray-200 animate-pulse">
        <div className="flex items-center">
            <div className="mr-4 bg-gray-200 rounded w-10 h-10"></div>
            <div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
        </div>
        <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
    </div>
);

const ClassCardList = ({ classes = [], today, isLoading }) => {
    const profile = useSelector(state => state.auth.profile);
    const [liveStatuses, setLiveStatuses] = useState([]);
    const previousLiveStatuses = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const updateLiveStatuses = () => {
            const newLiveStatuses = classes.map(classItem => {
                const timeDifference = classItem.class_time_unix - Math.floor(Date.now() / 1000);
                const classDuration = 30 * 60; // Assuming class duration is 30 minutes
                return (timeDifference <= 60 && timeDifference >= -classDuration);
            });

            if (JSON.stringify(newLiveStatuses) !== JSON.stringify(previousLiveStatuses.current)) {
                console.log('Updating live statuses...');
                previousLiveStatuses.current = newLiveStatuses;
            }

            setLiveStatuses(newLiveStatuses);
        };

        updateLiveStatuses(); // Initial update
        const interval = setInterval(updateLiveStatuses, 30000); // Update every 30 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [classes]);

    const handleJoinClassNavigate = (
        userType, classId, classType, studentId, 
        teacherId, studentName, teacherName
    ) => {
        if (userType === 'customer') {
            navigate(`/student/${studentName.replace(/\s+/g, '-')}/class/class-room?classId=${classId}&classType=${classType}&studentId=${studentId}&teacherId=${teacherId}&teacherName=${teacherName}`);
        } else {
            navigate(`/teacher/${teacherName.trim().replace(/\s+/g, '-')}/class/class-room?classId=${classId}&classType=${classType}&studentId=${studentId}&teacherId=${teacherId}&studentName=${studentName}`);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-row flex-wrap">
                {[...Array(1)].map((_, index) => (
                    <SkeletonLoader key={index} />
                ))}
            </div>
        );
    }

    if (!classes || classes.length === 0) {
        return <div className="border-1 border-gray-200 p-4">
            <p>No classes to show</p>
        </div>;
    }

    return (
        <div className="flex flex-row flex-wrap">
            {classes.map((classItem, index) => (
                <ClassCard
                    key={index}
                    courseName={classItem.course_title}
                    classType={classItem.class_type}
                    date={classItem.class_date}
                    time={classItem.class_time}
                    live={liveStatuses[index]}
                    userType={profile.user_type}
                    classId={classItem.id}
                    studentId={classItem.student_id}
                    teacherId={classItem.teacher_id}
                    studentName={classItem.student_name}
                    teacherName={classItem.teacher_name}
                    handleJoinClassNavigate={handleJoinClassNavigate}
                />
            ))}
        </div>
    );
};

export default ClassCardList;