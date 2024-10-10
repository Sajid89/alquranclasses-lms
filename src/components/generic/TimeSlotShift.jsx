import React, { useContext } from 'react';
import { timeSlotsList } from '../../data/TextConstants';
import SelectShiftsContext from '../../contexts/SelectShiftsContext';

const TimeSlotShift = () => {
    const { selectedShifts, setSelectedShifts } = useContext(SelectShiftsContext);

    const handleShiftClick = (shift, index) => {
        if (selectedShifts.includes(index)) {
            setSelectedShifts(selectedShifts.filter((selectedShift) => selectedShift !== index));
        } else {
            if (selectedShifts.length < 1) {
                setSelectedShifts([...selectedShifts, index]);
            }
        }
    };

    return (
        <div className='grid grid-cols-3 gap-1'>
            {Object.entries(timeSlotsList).map(([index, shift], i) => (
                <div 
                    key={index} 
                    className={`border-1 ${selectedShifts.includes(parseInt(index)) ? 
                        'bg-green border-green text-white' : 
                        'border-gray-300'} p-2 cursor-pointer 
                        flex items-center justify-center text-xs 
                        ${selectedShifts.length >= 1 && !selectedShifts.includes(parseInt(index)) ? 
                            'opacity-50 cursor-not-allowed' : ''} 
                        ${i >= 3 ? 'mt-1' : ''}`
                    } 
                    onClick={() => handleShiftClick(shift, parseInt(index))}
                >
                    {shift}
                </div>
            ))}
        </div>
    );
};

export default TimeSlotShift;