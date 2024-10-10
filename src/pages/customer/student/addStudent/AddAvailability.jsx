import React, { useContext, useState, useEffect, useMemo  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearStudentInfo, clearSelectedShift } from '../../../../store/studentsSlice';
import { setProfile } from '../../../../store/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { generateValidationSchema } from '../../../../utils/ValidationSchema';
import { DynamicForm, StepComponent } from '../../../../components';
import { PAGE_TEXTS, COURSES, COURSE_LEVELS } from '../../../../data/TextConstants';

import TeacherContext from '../../../../contexts/TeacherContext';
import SelectedSlotsContext from '../../../../contexts/SelectedSlotsContext';

import { Spinner, CouponCode } from '../../../../components';
import api from '../../../../utils/api';
import avatar from '../../../../data/placedolder_avatar.jpg';
import { API_BASE_URL, STRIPE_PACKAGES } from '../../../../config';
import { toast } from 'react-toastify';

const AddAvailability = () => {
    const profile = useSelector(state => state.auth.profile);
    const studentData = useSelector(state => state.students);
    const [teacherList, setTeacherList] = useState([]);
    const [apiLoading, setApiLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [foundTeacher, setFoundTeacher] = useState(null);
    const [availabilitySlots, setAvailabilitySlots] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [stripePackage, setStripePackage] = useState({});
    const [originalPrice, setOriginalPrice] = useState(0);
    const [price, setPrice] = useState(0);
    
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let buySubscritionAfterTrial = params.get('buySubscritionAfterTrial');
    let changePlan = params.get('changePlan');
    let changeTeacher = params.get('changeTeacher');
    
    const [oldSelectedSlots, setOldSelectedSlots] = useState({
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
    });

    const [selectedSlots, setSelectedSlots] = useState({
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
    });

    const [loading, setLoading] = useState(false);

    let courseSelected = '';
    if (studentData.studentInfo.course_id) {
        const course = COURSES.find(course => course.id === studentData.studentInfo.course_id);
        if (course) {
            courseSelected = course.value;
        }
    }

    const [showCouponCode, setShowCouponCode] = useState(false);

    const fields1 = [
        { type: 'teacher-list', name: 'teacher', placeholder: 'Our Best Available Teachers'},
        { type: 'weekly-slots', name: 'slots', placeholder: 'Choose Slots From Below' },
    ];

    const fields2 = [
        { type: 'button', buttonText: 'Confirm' },
    ];

    const dispatch = useDispatch();

    // get updated profile from redux-store
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/customer-profile');
                dispatch(setProfile(response.data.data));
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
            }
        };

        fetchProfile();
    }, [dispatch]);

    // Fetch teachers based on the student's course, teacher preference, shift and timezone
    useEffect(() => {
        const fetchTeachers = async () => {
            if (Object.keys(studentData.studentInfo).length !== 0) {
                try {
                    let params = {};
                    if (buySubscritionAfterTrial) {
                        params = {
                            student_id: studentData.studentInfo.student_id,
                            course_id: studentData.studentInfo.course_id,
                            teacher_preference: studentData.studentInfo.teacher_preference == 1 ? 'male' : 'female',
                            shift_id: studentData.studentInfo.shift_id,
                            student_timezone: studentData.studentInfo.student_timezone,
                        }
                    } else {
                        params = {
                            student_id: studentData.studentInfo.student_id ? studentData.studentInfo.student_id : null,
                            course_id: studentData.studentInfo.course_id,
                            teacher_preference: studentData.studentInfo.teacher_preference == 1 ? 'male' : 'female',
                            shift_id: studentData.selectedShifts[0],
                            student_timezone: studentData.studentInfo.student_timezone,
                        }
                    }

                    if (changePlan)
                    {
                        delete params.teacher_preference;
                        delete params.shift_id;
                        delete params.student_timezone;
                        params.change_plan = true;
                    }

                    if (changeTeacher)
                    {
                        params.change_teacher = true;
                        params.teacher_id = studentData.studentInfo.teacher_id;
                    }

                    const response = await api.post('teacher-list', params);
    
                    if (response.data) {
                        setTeacherList(response.data.data);
                        setApiLoading(false);

                        if (changePlan) {
                            const initialOldSelectedSlots = {
                                Mon: [],
                                Tue: [],
                                Wed: [],
                                Thu: [],
                                Fri: [],
                                Sat: [],
                                Sun: [],
                            };

                            response.data.data[0].schedule.forEach(slot => {
                                if (slot.is_selected) {
                                    initialOldSelectedSlots[slot.day_name].push(slot.slot_label);
                                }
                            });

                            setOldSelectedSlots(initialOldSelectedSlots);
                        }
                    }
                } catch (error) {
                    console.log('Error fetching teachers:', error);
                }
            }
        };

        fetchTeachers();
    }, [studentData]);

    // Set the first teacher as the selected teacher
    useEffect(() => {
        if (selectedTeacher === null && teacherList.length > 0) {
            setSelectedTeacher(teacherList[0]);
        }
    }, [selectedTeacher, teacherList]);

    // Set the selected teacher in the context
    const providerValue = useMemo(() => ({ selectedTeacher, setSelectedTeacher }), [selectedTeacher]);

    // Find the teacher from the list based on the selected teacher
    useEffect(() => {
        if (selectedTeacher) {
            const teacher = teacherList.find(teacher => teacher.name === selectedTeacher.name);
            setFoundTeacher(teacher);
        }
    }, [selectedTeacher, teacherList]);

    // Get the availability slots based on the selected slots
    useEffect(() => {
        if (foundTeacher) {
            const availabilitySlotIds = Object.entries(selectedSlots).flatMap(([day, slots]) => {
                return slots.flatMap((selectedSlot) => {
                    return foundTeacher.schedule
                    .filter(
                        (scheduleSlot) =>
                        scheduleSlot.day_name === day &&
                        scheduleSlot.slot_label === selectedSlot
                    )
                    .map((scheduleSlot) => scheduleSlot.availability_slot_id);
                });
            });

            setAvailabilitySlots(availabilitySlotIds);

            if (availabilitySlotIds.length > 0 && studentData.studentInfo.trial_required != 1) {
                STRIPE_PACKAGES.forEach((plan) => {
                    if (plan.classes === availabilitySlotIds.length) {
                        setStripePackage(plan);
                        setOriginalPrice(plan.price);
                        setPrice(plan.price);
                    }
                });
            } else {
                setStripePackage({});
                setPrice(0);
            }
        }

    }, [selectedSlots, foundTeacher]);

    // Calculate the price based on the coupon code
    const handleCouponData = (data) => {
        console.log(data);
        setCouponCode(data.coupon_code);

        if (data.type === 'percentage') {
            let calculatedPrice = price - (price * data.value / 100);
            setPrice(calculatedPrice); 
        } else if (data.type === 'fixed') {
            let calculatedPrice = price - data.value;
            setPrice(calculatedPrice);
        }
    };

    const validationSchema = generateValidationSchema(fields1);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const navigate = useNavigate();

    const handleNavigate = (value) => {
        if(value === 'add-card')
        {
            navigate('/customer/add-payment-method');
        }
        else {
            navigate('/customer/welcome');
        }
    };

    // compare selectedSlots with olSelctedSlots
    // to check user changed slots or not for change plan
    const arraysAreEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    const areSlotsSame = (selectedSlots, oldSelectedSlots) => {
        for (let day in selectedSlots) {
            if (!arraysAreEqual(selectedSlots[day], oldSelectedSlots[day])) {
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (availabilitySlots.length === 0) {
            toast.error('Please select at least one slot');
            return;
        }

        if (profile.stripe_id === null && studentData.studentInfo.trial_required != 1) {
            localStorage.setItem('redirect', '/customer/student/add-availability');
            handleNavigate('add-card');
            return;
        }

        if (areSlotsSame(selectedSlots, oldSelectedSlots)) {
            toast.error('Choose at least one different slot to change your current plan.');
            return;
        }
        
        try {
            setLoading(true);

            // call change-teacher api so it will:
            // remove upcoming classes, update student's teacher
            // and create history for this change
            if (changeTeacher) {
                try {
                    const response = await api.post('change-teacher', 
                    { 
                        change_teacher_reason_id: studentData.selectedReason[0],
                        student_id: studentData.studentInfo.student_id,
                        course_id: studentData.studentInfo.course_id,
                        shift_id: studentData.selectedShifts[0],
                        teacher_id: foundTeacher.id,
                    });
                } catch (error) {
                    setLoading(false);
                    console.log('Error adding student:', error);
                    return;
                }
            }

            // Buy new subscription plan after trial successfull
            let endpoint = '';
            let toastMessage = '';
            let params = {};
            
            if (buySubscritionAfterTrial) {
                endpoint = 'create-subscription';
                toastMessage = `You have successfully subscribed to our ${stripePackage.name} plan.`;
                params = {
                    user_id: profile.id,
                    student_id: studentData.studentInfo.student_id,
                    plan_id: stripePackage.id,
                    coupon_code: couponCode,
                    student_course_id: studentData.studentInfo.student_course_id,
                    availability_slot_ids: availabilitySlots,
                    stripe_plan: stripePackage.name,
                    teacher_id: foundTeacher.id,
                }
            }
            else {
                // add new student
                endpoint = 'add-student';
                toastMessage = 'Student has been successfully.';
                params = {
                    profile_image: studentData.studentInfo.profile_image,
                    name: studentData.studentInfo.student_name,
                    age: studentData.studentInfo.age,
                    gender: studentData.studentInfo.gender == 1 ? 'male' : 'female',
                    timezone: studentData.studentInfo.student_timezone,
                    course_id: studentData.studentInfo.course_id,
                    course_level: studentData.studentInfo.course_level ? COURSE_LEVELS.find(level => level.id === studentData.studentInfo.course_level).value : '',
                    teacher_id: foundTeacher.id,
                    teacher_preference: studentData.studentInfo.teacher_preference == 1 ? 'male' : 'female',
                    availability_slot_ids: availabilitySlots,
                    shift_id: studentData.selectedShifts[0],
                    stripe_plan_id: stripePackage.id,
                    stripe_plan: stripePackage.name,
                    coupon_code: couponCode,
                    is_trial_required: studentData.studentInfo.trial_required == 1 ? 1 : 0,
                }
            }

            // enroll in new course/change teacher
            if (!buySubscritionAfterTrial && studentData.studentInfo.student_id) {
                toastMessage = 'Enrolled in new course successfully.';
                delete params.profile_image;
                delete params.name;
                delete params.age;
                delete params.gender;
                delete params.timezone;

                params.student_id = studentData.studentInfo.student_id;

                if (changeTeacher) {
                    params.change_teacher = true;
                    toastMessage = 'Teacher successfully changed and subscribed.';
                }
            } 
            
            // upgrade/downgrade subscription plan
            if (changePlan) {
                toastMessage = 'Subscription updated successfully. Welcome to your new plan!';
                const students = studentData.data;
                const student = students.find(student => student.id === studentData.studentInfo.student_id);
                const course = student.courses.find(course => course.id === studentData.studentInfo.course_id);
                
                endpoint = 'update-student-course-subscription';
                params = {
                    student_id: studentData.studentInfo.student_id,
                    subscription_id: course.subscription_id,
                    course_id: course.id,
                    availability_slot_ids: params.availability_slot_ids,
                    new_plan_id: stripePackage && stripePackage.id != course.stripe_plan_id ? stripePackage.id : null,
                };
            }

            console.log('params:', params);
            const response = await api.post(endpoint, params, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setLoading(false);
            toast.success(toastMessage);
            
            // empty redux store studentInfo
            dispatch(clearStudentInfo({}));
            dispatch(clearSelectedShift([]));
            
            handleNavigate();
        } catch (error) {
            setLoading(false);
            console.log('Error adding student:', error);
        }
    };

    return (
        <div className='flex flex-col items-stretch main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center py-12 sm:py-16 
                px-16 mx-auto mt-16 md:mt-0'>
                <StepComponent 
                    stepNumber={2} 
                    stepTitle={PAGE_TEXTS.ADD_NEW_STUDENT.AVAILABILITY}
                    stepTexts={[
                        PAGE_TEXTS.ADD_NEW_STUDENT.STUDENT_INFO,
                        PAGE_TEXTS.ADD_NEW_STUDENT.AVAILABILITY
                    ]} 
                    activeStep={1} 
                />

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
                                    teacherList={teacherList}
                                    apiLoading={apiLoading}
                                    foundTeacher={foundTeacher}
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
                                        <img src={selectedTeacher.profile_photo_path || avatar} alt={selectedTeacher.name} className='w-8 h-8 rounded-full' />
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
                                <p className='mb-2 flex justify-between'>Selected Course: <span>{courseSelected}</span></p>
                                <p className='mb-2 flex justify-between'>
                                    Selected Plan: 
                                    <span>{ stripePackage ? stripePackage.name : '' }</span>
                                </p>
                                <p className='mb-2 flex justify-between'>
                                    Class Per Week: 
                                    <span>{ stripePackage ? stripePackage.classes : '' }</span>
                                </p>
                                <p className='flex justify-between'>
                                    Price per Class: 
                                    <span>${originalPrice} /month</span>
                                </p>
                            </div>

                            <div className='border-b border-gray-300 p-3'>
                                {availabilitySlots.length !== 0 && studentData.studentInfo.trial_required !== 1 
                                || changePlan && (
                                    <Link 
                                        to="#" 
                                        className="text-green font-semibold text-xs text-center block underline mb-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowCouponCode(true);
                                        }}
                                    >
                                        Have a discount code?
                                    </Link>
                                )}
                                {showCouponCode && availabilitySlots.length !== 0 && studentData.studentInfo.trial_required !== 1 && <CouponCode onCouponData={handleCouponData} />}
                                <p style={{ display: 'flex', justifyContent: 'space-between' }}>Calculated Price <span>${price}.00</span></p>
                            </div>

                            <div className='p-3'>
                                <p className="flex justify-between font-semibold">Total <span>${price}.00</span></p>
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

                <Spinner loading={loading} text="Please wait..." />
            </div>
        </div>
    );
}

export default AddAvailability;