import React, { useContext } from 'react';
import TeacherContext from '../contexts/TeacherContext';

const TeacherCard = ({ picture, name, currentTeacher, className }) => {
    const { selectedTeacher, setSelectedTeacher } = useContext(TeacherContext);

    const handleRadioClick = () => {
        setSelectedTeacher({ name, picture });
    };

    return (
        <div className={`relative border-1 border-gray-200 bg-white p-3 rounded-md
            items-center space-x-4 inline-flex ${className}
            ${selectedTeacher && selectedTeacher.name === name ? 'border-1.5 green-border bg-light-green' : 'border-gray-200 bg-white'}`}>
            {currentTeacher && 
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green text-white px-2 py-1 rounded">
                    <span className='text-xs'>Current Teacher</span>
                </div>
            }
            <img src={picture} alt={name} className='w-8 h-8 rounded-full' />
            <span className='w-30 flex-wrap'>{name}</span>
            <div className='ml-auto'>
                {selectedTeacher && selectedTeacher.name !== name && 
                    <input type='radio' name='teacher' onClick={handleRadioClick} />}
                {selectedTeacher && selectedTeacher.name === name && 
                    <span className='ml-2 bg-green rounded-full p-2 text-white text-sm w-6 h-6 flex items-center justify-center'>✓</span>}
            </div>
        </div>
    );
};

export default TeacherCard;