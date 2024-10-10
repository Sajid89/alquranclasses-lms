import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { toast } from 'react-toastify';

import SelectedSlotsContext from '../../../contexts/SelectedSlotsContext';
import SelectShiftsContext from '../../../contexts/SelectShiftsContext';
import { CurrentTeacherSlots, CustomButton, TimeSlotShift, Spinner } from '../../../components';
import api from '../../../utils/api';

const FullWidthCalendar = styled(CalendarComponent)`max-width: 100%;`;

const CreateMakeupRequest = () => {
    const { classID } = useParams();
    const { classType } = useParams();
    const { teacherID } = useParams();
    const { studentID } = useParams();
    const { courseID } = useParams();

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const initialDayId = currentDate.getDay() == 0 ? 7 : currentDate.getDay();
    console.log('Initial Day ID:', initialDayId);
    const initialDayName = currentDate.toLocaleString('en-US', { weekday: 'short' });

    const [selectedDate, setSelectedDate] = useState(formattedDate);
    const [selectedDayId, setSelectedDayId] = useState(initialDayId);
    const [selectedDayName, setSelectedDayName] = useState(initialDayName);
    const [selectedShifts, setSelectedShifts] = useState([]);
    const [currentTeacherSchedule, setCurrentTeacherSchedule] = useState([]);
    const [availabilitySlotId, setAvailabilitySlotId] = useState(null);
    const [makeupDateTime, setMakeupDateTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [selectedSlots, setSelectedSlots] = useState({
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
    });

    useEffect(() => {
        const fetchTeacherSlots = async () => {
            setLoading(true);
            try {
                const response = await api.post('/teacher-availability', 
                    {
                        teacher_id: parseInt(teacherID),
                        student_id: parseInt(studentID),
                        course_id: parseInt(courseID),
                        shift_id: selectedShifts[0],
                        day_id: selectedDayId,
                    }
                );
                const data = response.data.data.schedule;

                setCurrentTeacherSchedule(data);
            } catch (error) {
                console.error('Failed to fetch teacher slots:', error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedShifts.length > 0) {
            fetchTeacherSlots();
        }
    }, [selectedDayId, selectedShifts]);

    useEffect(() => {
        console.log(currentTeacherSchedule);
    }, [currentTeacherSchedule]);

    useEffect(() => {
        console.log(selectedSlots);
    }, [selectedSlots]);

    useEffect(() => {
        console.log('Selected Shifts:', selectedShifts);
    }, [selectedShifts]);

    useEffect(() => {
        getAvailabilitySlotId(currentTeacherSchedule, selectedSlots);
    }, [currentTeacherSchedule, selectedSlots]);

    useEffect(() => {
        console.log('Availability Slot ID:', availabilitySlotId);
    }, [availabilitySlotId]);

    const handleDateChange = (args) => {
        const date = args.value;
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setSelectedDate(formattedDate);
        setSelectedDayId(date.getDay() === 0 ? 7 : date.getDay());
        setSelectedDayName(date.toLocaleString('en-US', { weekday: 'short' }));

        const dayId = date.getDay() === 0 ? 7 : date.getDay();
        console.log('Selected Day ID:', dayId);
        console.log('Selected Day Name:', date.toLocaleString('en-US', { weekday: 'short' }));
        console.log('Selected Date:', formattedDate);
    };

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/teacher/scheduled-classes');
    };

    // get availability slot id from current teacher schedule
    const getAvailabilitySlotId = (currentTeacherSchedule, selectedSlots) => {
        if (!currentTeacherSchedule || currentTeacherSchedule.length === 0) {
            return null;
        }
    
        for (const schedule of currentTeacherSchedule) {
            const dayName = schedule.day_name;
            const slotTime = selectedSlots[dayName];
    
            if (slotTime && slotTime.length > 0) {
                const time = slotTime[0];
                const formattedTime = new Date(`1970-01-01T${schedule.slot_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
                if (formattedTime === time) {
                    setAvailabilitySlotId(schedule.availability_slot_id);
                    const dateTime = `${selectedDate} ${schedule.slot_time}`;
                    setMakeupDateTime(dateTime);
                }
            }
        }
        return null;
    };

    const handleSubmit = () => {
        const createMakeupRequest = async () => {
            setSubmitLoading(true);
            try {
                const response = await api.post('/teacher-create-makeup-request', 
                    {
                        class_id: parseInt(classID),
                        availability_slot_id: availabilitySlotId,
                        makeup_date_time: makeupDateTime,
                        class_type: classType,
                    }
                );
                const data = response.data.data.schedule;

                setCurrentTeacherSchedule(data);
                toast.success('Makeup request created successfully.');
                navigate('/teacher/scheduled-classes');
            } catch (error) {
                console.error('Failed to fetch teacher slots:', error);
            } finally {
                setSubmitLoading(false);
            }
        };

        if (!availabilitySlotId) {
            toast.error('Please select a slot to create makeup request.');
            return;
        }
        
        createMakeupRequest();
    };

    return (
        submitLoading ? (
            <Spinner loading={true} text='Creating makeup request...' />
        ) : (
            <div className='mt-20 md:mt-0 mb-4'>
                <div className='pl-6 pr-6 mb-4'>
                    <h3 className='font-semibold text-xl mb-2'>
                        Create Makeup Request
                    </h3>
                    <p>
                        From below calendar please select available date and time for makeup class.
                    </p>
                </div>
                <div className='flex flex-col lg:flex-row pl-6 pr-6 h-auto md:h-[400px]'>
                    <div className='w-full lg:w-6/12 h-full'>
                        <FullWidthCalendar 
                            value={selectedDate} 
                            change={handleDateChange}
                            min={currentDate}
                        />

                        <h4 className='font-semibold text-md mt-4 mb-2'>
                            Select Shift
                        </h4>
                        <SelectShiftsContext.Provider value={{ selectedShifts, setSelectedShifts }}>
                            <TimeSlotShift />
                        </SelectShiftsContext.Provider>
                    </div>
                    <div className='hidden lg:block lg:w-1/12'></div>
                    <div className='w-full lg:w-4/12 mt-4 md:mt-0 h-full overflow-y-auto'>
                        <SelectedSlotsContext.Provider value={{ selectedSlots, setSelectedSlots }}>
                            <CurrentTeacherSlots 
                                currentTeacherSchedule={currentTeacherSchedule}
                                day={selectedDayName}
                                loading={loading}
                            />
                        </SelectedSlotsContext.Provider>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row px-6 md:pr-24 mt-8'>
                    <div className='w-full lg:w-6/12 pr-0 md:pr-2 mb-4 md:mb-0'>
                        <CustomButton
                            onClick={handleCancel}
                            customClass='bg-transparent text-green border 
                            green-border w-full'
                        >
                            Cancel
                        </CustomButton>
                    </div>
                    <div className='w-full lg:w-6/12 pr-0 md:pl-2'>
                        <CustomButton
                            onClick={handleSubmit}
                            customClass='bg-green text-white w-full'
                        >
                            Submit Request
                        </CustomButton>
                    </div>
                </div>
            </div>
        )
    )
}

export default CreateMakeupRequest