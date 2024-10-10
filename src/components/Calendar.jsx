import React, { useState } from 'react';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { FiClock } from 'react-icons/fi';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (args) => {
        setSelectedDate(args.value);
    };

    const currentDate = new Date();

    return (
        <div className="flex">
            <div className="w-2/5 text-green text-xs">
                <h2>Trial booking</h2>
                <div className="flex items-center text-gray-500 mt-2">
                    <FiClock size={16} />
                    <p className="ml-2">30 minutes</p>
                </div>
            </div>
            <div className="w-3/5">
                <CalendarComponent 
                    value={selectedDate} 
                    change={handleDateChange}
                    min={currentDate}
                />
            </div>
        </div>
    );
};

export default Calendar;