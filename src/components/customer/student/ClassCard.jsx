// ClassCard.jsx
import React from 'react';
import courseIcon from '../../../data/icons/std_course.png';
import courseIconWhite from '../../../data/icons/std_course_white.png';
import CustomButton from '../../../components/generic/CustomButton';

const ClassCard = ({ 
    courseName, classType, date, time, live,
    userType, classId, studentId, 
    teacherId, studentName, teacherName,
    handleJoinClassNavigate
 }) => {
    const handleClick = () => {
        console.log('Join Now');
    };

    return (
        <div className={`w-full p-4 mb-2 flex items-center justify-between ${live ? 'bg-green text-white rounded-md' : 'border-1 border-gray-200'}`}>
            <div className="flex items-center">
                <img src={live ? courseIconWhite : courseIcon} alt="Course Icon" className="mr-4" />
                <div>
                    <p className="font-medium">{courseName}</p>
                    <p className={`${live ? 'text-gray-300' : 'text-gray-600'}`}>{classType}</p>
                </div>
            </div>
            <div className="text-right">
                {live ? 
                    <CustomButton 
                        onClick={() => handleJoinClassNavigate(userType, classId, classType, studentId, teacherId, studentName, teacherName)} 
                        customClass="bg-white text-green">
                        Join Now 
                    </CustomButton>  : (
                    <>
                        <p>{date}</p>
                        <p>{time}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClassCard;