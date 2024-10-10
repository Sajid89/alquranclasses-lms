import React, { useContext, useState, useEffect, useMemo  } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import { DynamicForm } from '../../../components';

import TeacherContext from '../../../contexts/TeacherContext';
import SelectedSlotsContext from '../../../contexts/SelectedSlotsContext';

import { teacherList } from '../../../data/TextConstants';
import Spinner from '../../../components';

const ChangeTeacherSchedule = () => {
    const [selectedSlots, setSelectedSlots] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    useEffect(() => {
        console.log(selectedSlots);
    }, [selectedSlots]);
    
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        if (selectedTeacher === null && teacherList.length > 0) {
            setSelectedTeacher(teacherList[0]);
        }
    }, [selectedTeacher, teacherList]);

    const providerValue = useMemo(() => ({ selectedTeacher, setSelectedTeacher }), [selectedTeacher]);

    const [loading, setLoading] = useState(false);

    const fields1 = [
        { type: 'teacher-list', name: 'teacher', placeholder: 'Our best available teachers'},
        { type: 'weekly-slots', name: 'slots', placeholder: 'Choose Slots from below' },
    ];

    const fields2 = [
        { type: 'button', buttonText: 'Confirm' },
    ];

    const validationSchema = generateValidationSchema(fields1);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        toast.success('Teacher changed successfully!');
        setTimeout(() => {
            navigate('/customer/dashboard');
        }, 2000);
        //setLoading(true);
    };

    return (
        <div className='flex flex-col items-stretch main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center py-12 sm:py-16 
                px-16 mx-auto mt-16 md:mt-0'>
                <div className='flex flex-col md:flex-row w-full'>
                    <div className='w-full md:w-8/12 md:mr-12'>
                        <TeacherContext.Provider value={providerValue}>
                            <SelectedSlotsContext.Provider value={{ selectedSlots, setSelectedSlots }}>
                                <DynamicForm
                                    fields={fields1}
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    onSubmit={handleSubmit}
                                    isMaxWidth={true}
                                    customClasses="pt-3"
                                />
                            </SelectedSlotsContext.Provider>
                        </TeacherContext.Provider>
                    </div>

                    <div className='w-full md:w-4/12'>
                        <div className='shadow-md rounded-md pb-3'>
                            <div className='p-3'>
                                <h2 className='font-semibold uppercase'>Package Summary</h2>
                            </div>

                            <div className='border-t border-b border-gray-300 p-3'>
                                {selectedTeacher && 
                                    <div className='rounded-md items-center space-x-4 inline-flex'>
                                        <img src={selectedTeacher.picture} alt={selectedTeacher.name} className='w-8 h-8 rounded-full' />
                                        <span className='flex-wrap'>{selectedTeacher.name}</span>
                                    </div>
                                }
                            </div>

                            <div className='border-b border-gray-300'>
                                <div className='flex flex-wrap p-3'>
                                    {Object.entries(selectedSlots).map(([day, times], index) => 
                                        times.length > 0 && times.map((time, timeIndex) => (
                                            <span key={`${day}-${timeIndex}`} className='bg-light-green rounded-full py-1 px-2 m-1'>
                                                {time}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className='border-b border-gray-300 p-3'>
                                <p className='mb-2 flex justify-between'>Selected Course: <span>Tajweed of Holy Quran</span></p>
                                <p className='mb-2 flex justify-between'>Selected Plan: <span>Standard</span></p>
                                <p className='mb-2 flex justify-between'>Class Per Week: <span>02</span></p>
                                <p className='flex justify-between'>Price per Class: <span>$35 /month</span></p>
                            </div>

                            <div className='border-b border-gray-300 p-3'>
                                <Link to="#" className="text-green font-semibold text-xs text-center 
                                    block underline mb-3">Have a discount code?</Link>
                                <p style={{ display: 'flex', justifyContent: 'space-between' }}>Calculated Price <span>$100.00</span></p>
                            </div>

                            <div className='p-3'>
                                <p className="flex justify-between font-semibold">Total <span>$200.00</span></p>
                            </div>
                            
                            <div className='px-3'>
                                <DynamicForm
                                    fields={fields2}
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    onSubmit={handleSubmit}
                                    customClasses="pt-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Spinner loading={loading} text="Adding student..." /> */}
            </div>
        </div>
    );
}

export default ChangeTeacherSchedule;