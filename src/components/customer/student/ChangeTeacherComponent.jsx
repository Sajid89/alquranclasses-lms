import React, { useState, useEffect } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { CustomButton, TimeSlotShift, ReasonListSkeletonLoader } from '../../../components';
import { useSelector } from 'react-redux';

const ChangeTeacherComponent = ({ 
    title, text, list, text2, buttonText1, buttonText2,
    onButton1Click, onButton2Click, onCheckedItemsChange, loading
}) => {
    
    const selectedReason = useSelector(state => state.students.selectedReason);
    const [checkedItems, setCheckedItems] = useState(selectedReason || []);

    const handleCheckChange = index => {
        // Get the ID of the selected reason
        const selectedReasonId = list[index].id;

        // Set checkedItems to an array containing only the selected item's ID
        setCheckedItems(selectedReasonId);
        onCheckedItemsChange(selectedReasonId);
    };
    
    return (
        <div className='lg:w-6/12'>
            <h3 className='font-semibold text-lg w-full mb-2'>{title}</h3>
            <p className='mb-6'>{text}</p>

            {loading ? (
                <ReasonListSkeletonLoader />
            ) : (
                <>
                    {list.map((item, index) => (
                        <div 
                            key={index} 
                            className={`border-1 rounded-md p-2 mb-2 flex items-center ${checkedItems == item.id ? 'bg-green text-white' : 'border-gray-200'}`}
                        >
                            <div 
                                className={`w-5 h-5 mr-2 border rounded flex items-center justify-center cursor-pointer ${checkedItems == item.id ? 'border-white bg-green' : 'bg-white'}`} 
                                onClick={() => handleCheckChange(index)}
                            >
                                {checkedItems == item.id && <AiOutlineCheck className="text-white" />}
                            </div>
                            <span>{item.reason}</span>
                        </div>
                    ))}
                </>
            )}

            <p className='mt-6 mb-6'>{text2}</p>

            <TimeSlotShift />

            <form className='flex justify-between mt-2'>
                <CustomButton 
                    customClass='mt-4 shadow bg-transparent text-green green-border border-1' 
                    onClick={onButton1Click}
                >
                    {buttonText1}
                </CustomButton>
                <CustomButton 
                    customClass='mt-4 shadow bg-green text-white' 
                    onClick={onButton2Click}
                >
                    {buttonText2}
                </CustomButton>
            </form>
        </div>
    );
};

export default ChangeTeacherComponent;