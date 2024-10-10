import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DAYS } from '../data/TextConstants';
import SelectedSlotsContext from '../contexts/SelectedSlotsContext';
import { SlotSkeletonLoader } from '../components';

const WeeklySlotsComponent = ({ teacher }) => {
    const studentData = useSelector(state => state.students);
    const { selectedSlots, setSelectedSlots } = useContext(SelectedSlotsContext);
    
    useEffect(() => {
        if (teacher) {
            const initialSelectedSlots = {};

            teacher.schedule.forEach(slot => {
                if (slot.is_selected) {
                    if (!initialSelectedSlots[slot.day_name]) {
                        initialSelectedSlots[slot.day_name] = [];
                    }

                    initialSelectedSlots[slot.day_name].push(slot.slot_label);
                }
            });

            setSelectedSlots(initialSelectedSlots);
        }
    }, [teacher, setSelectedSlots]);

    const handleSlotClick = (day, slotTime) => {
        setSelectedSlots(prevState => {
            // If trial is required, only allow one slot across all days
            if (studentData.studentInfo.trial_required == 1) {
                // If the selected slot is already selected, deselect it and enable all other slots
                if (prevState[day] && prevState[day].includes(slotTime)) {
                    return {
                        ...prevState,
                        [day]: prevState[day].filter(time => time !== slotTime)
                    };
                }

                // If no slot is selected, disable all other slots
                const newSlots = {...prevState};
                for (let dayKey in newSlots) {
                    newSlots[dayKey] = [];
                }

                // Select the new slot
                newSlots[day] = [slotTime];
                return newSlots;
            }

            // If trial is not required, allow up to two slots per day
            if (prevState[day] && prevState[day].length >= 2 && !prevState[day].includes(slotTime)) {
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
            <div className='grid grid-cols-7'>
                {DAYS.map((day, dayIndex) => (
                    <div key={dayIndex}>
                        <div className='flex justify-center'>
                            <div 
                                className='w-1 border-gray-300 p-1 my-4 mx-2 
                                    font-semibold flex items-center 
                                    justify-center text-xs'
                            >
                                {day}
                            </div>
                        </div>

                        <div className='w-full border-b-2 border-gray-200'></div>

                        <div className='flex flex-col items-center mt-3'>
                            {teacher ? (
                                teacher.schedule
                                    .filter(slot => slot.day_name === day)
                                    .map((slot, slotIndex) => (
                                        <div 
                                            key={slotIndex} 
                                            className={`w-24 border-1 mt-2 mb-2 ${
                                            !slot.is_free && !slot.is_selected ? 
                                                'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' :
                                                selectedSlots[day] && selectedSlots[day].includes(slot.slot_label) ? 
                                                    'bg-green border-green text-white cursor-pointer' : 
                                                    studentData.studentInfo.trial_required == 1 && Object.values(selectedSlots).flat().length >= 1 ? 
                                                        'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' : 
                                                        selectedSlots[day] && selectedSlots[day].length >= 2 ? 
                                                        'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' : 
                                                        'border-gray-200 bg-light-green text-green cursor-pointer'
                                                } p-1 mx-2 flex items-center justify-center text-xs`
                                            }
                                            onClick={() => {
                                                // If trial is required and a slot is already selected, only allow the click if it's on the selected slot
                                                if (studentData.studentInfo.trial_required == 1 && Object.values(selectedSlots).flat().length >= 1) {
                                                    if (selectedSlots[day] && selectedSlots[day].includes(slot.slot_label)) {
                                                    handleSlotClick(day, slot.slot_label);
                                                    }
                                                } else {
                                                    handleSlotClick(day, slot.slot_label);
                                                }
                                            }}
                                        >
                                            {slot.slot_label}
                                        </div>
                                ))
                            ) : (
                                <SlotSkeletonLoader />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-start mt-8'>
                <div className='flex items-center'>
                    <div className='w-4 h-4 bg-green mr-2'></div>
                    <div>Selected</div>
                </div>
                <div className='flex items-center ml-4'>
                    <div className='w-4 h-4 bg-light-green mr-2'></div>
                    <div>Available</div>
                </div>
                <div className='flex items-center ml-4'>
                    <div className='w-4 h-4 bg-light-yellow mr-2'></div>
                    <div>Reserved</div>
                </div>
                <div className='flex items-center ml-4'>
                    <div className='w-4 h-4 bg-gray-200 mr-2'></div>
                    <div>Booked</div>
                </div>
            </div>
        </>
    );
};

export default WeeklySlotsComponent;