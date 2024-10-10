import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import SelectedSlotsContext from '../../contexts/SelectedSlotsContext';
import { SlotSkeletonLoader } from '../../components';

const CurrentTeacherSlots = ({ currentTeacherSchedule, day, loading }) => {
    console.log(currentTeacherSchedule);
    const { selectedSlots, setSelectedSlots } = useContext(SelectedSlotsContext);
    //const [loading, setLoading] = useState(false);

    const handleSlotClick = (day, slotTime) => {
        setSelectedSlots(prevState => {
            if (prevState[day] && prevState[day].length >= 1 && !prevState[day].includes(slotTime)) {
                return prevState;
            }

            return {
                ...prevState,
                [day]: prevState[day]
                ? prevState[day].includes(slotTime)
                    ? prevState[day].filter(time => time !== slotTime)
                    : [...prevState[day], slotTime]
                : [slotTime],
            };
        });
    };

    return (
        <>
            {!loading ? (
                currentTeacherSchedule
                    //.filter(slot => slot.day_name === day)
                    .map((slot, slotIndex) => (
                        <div 
                            key={slotIndex} 
                            className={`w-full h-10 border-1 mb-2 ${
                            !slot.is_free && !slot.is_selected ? 
                                'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' :
                                selectedSlots[day] && selectedSlots[day].includes(slot.slot_label) ? 
                                    'bg-green border-green text-white cursor-pointer' : 
                                    selectedSlots[day] && selectedSlots[day].length >= 1 ? 
                                        'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' : 
                                        'border-gray-200 bg-light-green text-green cursor-pointer'
                                } flex items-center justify-center text-xs`
                            }
                            onClick={() => {
                                handleSlotClick(day, slot.slot_label);
                            }}
                        >
                            {slot.slot_label} - {moment(slot.slot_label, 'hh:mm A').add(30, 'minutes').format('hh:mm A')}
                        </div>
                ))
            ) : (
                <SlotSkeletonLoader 
                    displayMultiple={true} 
                    displayLength={8}
                />
            )}
        </>
    );
};

export default CurrentTeacherSlots;
