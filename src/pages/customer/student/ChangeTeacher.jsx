import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { toast } from 'react-toastify';

import { ChangeTeacherComponent }  from '../../../components';
import SelectShiftsContext from '../../../contexts/SelectShiftsContext';
import { generateValidationSchema } from '../../../utils/ValidationSchema';
import api from '../../../utils/api';

import { useSelector, useDispatch } from 'react-redux';
import { setSelectedShift, clearSelectedShift, 
    setSelectedReason, clearSelectedReason 
} from '../../../store/studentsSlice';

const ChangeTeacher = () => {
    // Get the stored form data from the Redux store
    const storedSelectedReason = useSelector(state => state.students.selectedReason);
    const storedSelectedShifts = useSelector(state => state.students.selectedShifts);

    const [list, setList] = useState([]);
    const [checkedItems, setCheckedItems] = useState(storedSelectedReason || []);
    const [selectedShifts, setSelectedShifts] = useState(storedSelectedShifts || []);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubscribedPlans = async () => {
            try {
                const response = await api.get('change-teacher-reasons');
                const data = response.data.data;
                setList(data);
            } catch (error) {
                console.error('Failed to fetch change teacher reason list:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribedPlans();
    }, []);
    
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/customer/student/add-availability?changeTeacher=true');
    };


    const handleButton1Click = (event) => {
        event.preventDefault();

        // clear the selected reasons and shifts
        dispatch(clearSelectedReason([]));
        dispatch(clearSelectedShift([]));

        navigate('/customer/dashboard');
    };
    
    const handleCheckedItemsChange = (selectedReasonId) => {
        setCheckedItems([selectedReasonId]);
    };

    const handleButton2Click = (event) => {
        event.preventDefault();

        const fields = [
            { name: 'change-teacher-reason' },
            { name: 'time-slot-shift' }
        ];

        const validationSchema = generateValidationSchema(fields);
        const data = {
            'change-teacher-reason': checkedItems,
            'time-slot-shift': selectedShifts,
        };

        try {
            validationSchema.validateSync(data);

            // Dispatch the actions to update the state in your Redux store
            dispatch(setSelectedShift(selectedShifts));
            dispatch(setSelectedReason(checkedItems));

            handleNavigate();
        } catch (error) {
            toast.error(error.errors[0]);
            //console.error(error.errors);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full  flex items-center justify-center'>
                    <SelectShiftsContext.Provider value={{ selectedShifts, setSelectedShifts }}> 
                        <ChangeTeacherComponent
                            title={'Change Teacher'}
                            text={'Why do you want to change your current teacher, give us a reason.'}
                            text2={'Tell us about your preferred shift for a new teacher'}
                            list={list}
                            buttonText1={'Cancel'}
                            buttonText2={'Proceed'}
                            onButton1Click={handleButton1Click}
                            onButton2Click={handleButton2Click}
                            onCheckedItemsChange={handleCheckedItemsChange}
                            loading={loading}
                        />
                    </SelectShiftsContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default ChangeTeacher;