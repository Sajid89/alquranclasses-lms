import { 
    AiFillDashboard, AiFillFile, AiFillMessage, 
    AiFillSetting, AiOutlineUsergroupAdd, AiOutlineArrowLeft,
    AiOutlineClockCircle, AiOutlineRead, AiOutlineShareAlt,
    AiOutlineVideoCamera, AiOutlineTeam, AiOutlineForm,
    AiOutlineFileText, AiOutlineDollar, AiOutlineBarChart, AiOutlineSetting
} from 'react-icons/ai';

import moment from 'moment-timezone';

export const PAGE_TEXTS = {
    SIGNUP: {
        TITLE: 'Most Interesting and Effective Online Quran Learning.',
        TEXT: 'AlQuranClasses is the best platform for online Quran learning. We have unique ways of teaching that empower kids, adults, women, men and new Muslims to learn the Quran Online from the comfort of your home.'
    },
    ADD_NEW_STUDENT: {
        STUDENT_INFO: 'Student Information',
        COURSE_INFO: 'Course Information',
        AVAILABILITY:  'Student Availability',
        TRIAL: 'Trial Information',
    },
};

export const USER_TYPES = {
    CUSTOMER: 'customer',
    STUDENT: 'student',
    TEACHER: 'teacher',
};

export const STUDENT_STATUS = {
    TRIALSCHEDULED: 'trial_scheduled',
    TRIALSUCCESSFUL: 'trial_successful',
    TRAILUNSUCCESSFUL: 'trial_unsuccessful',
    SUBSCRIPTIONACTIVE: 'subscription_active',
    SUBSCRIPTIONCANCELLED: 'subscription_cancelled',
    SUBSCRIPTIONEXPIRED: 'subscription_expired',
    SUBSCRIPTIONPENDINGPAYMENT: 'pending_payment',
    PAYMENTFAILED: 'payment_failed',
};

export const COURSES = [
    {id: 2, value: 'Recitation of Quran'}, 
    {id: 3, value: 'Tajweed of Quran'}, 
    {id: 4, value: 'Hifz Quran'},
];

export const COURSE_LEVELS = [
    {id: 1, value: 'beginner'}, 
    {id: 2, value: 'intermediate'}, 
    {id: 3, value: 'advanced'},
];

const countries =  {
    'US': 'America',
    'CA': 'America',
    'AU': 'Australia',
    'GB': 'Europe',
    'NL': 'Europe',
    'DE': 'Europe',
};

export const TIMEZONES = moment.tz
  .names()
  .filter((zoneName) => {
    const continent = zoneName.split('/')[0];
    return Object.values(countries).includes(continent);
  })
  .map((zoneName) => ({ value: zoneName, label: zoneName }));

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateTimeSlots = (shift, startHour, endHour) => {
    const timeSlots = [];
    for (let i = startHour; i <= endHour; i++) {
        let hour = i;
        let period = 'AM';
        if (i >= 12) {
            hour = i === 12 ? 12 : i - 12;
            period = 'PM';
        }
        const time = `${hour.toString().padStart(2, '0')}:00 ${period}`;
        const id = timeSlots.length + 1;
        timeSlots.push({ id, time });
        const halfHourTime = `${hour.toString().padStart(2, '0')}:30 ${period}`;
        const halfHourId = timeSlots.length + 1;
        timeSlots.push({ id: halfHourId, time: halfHourTime });
    }
    return timeSlots;
};

const morningTimeSlots = generateTimeSlots('Morning', 6, 11);
const afternoonTimeSlots = generateTimeSlots('Afternoon', 12, 17);
const eveningTimeSlots = generateTimeSlots('Evening', 18, 23);

export const TIME_SLOTS = {
    Morning: morningTimeSlots,
    Afternoon: afternoonTimeSlots,
    Evening: eveningTimeSlots,
};

const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Midnight', 'Early Morning'];

export const timeSlotsList = SHIFTS.reduce((acc, time, index) => {
    acc[index + 1] = time;
    return acc;
}, {});

export const teacherList = [
    { id: 1, name: 'Hussein Saeed Aba Alsheikh', picture: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Ali Ahmed', picture: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Sara Khan', picture: 'https://via.placeholder.com/150' },
];

// customer sidebar links
export const sidebarCustomerLinks = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
            },
        ],
    },

    {
        title: 'Pages',
        links: [
            {
                name: 'Transaction & Billing',
                icon: <AiFillFile />,
            },
            {
                name: 'Messages',
                icon: <AiFillMessage />,
            },
            {
                name: 'Settings',
                icon: <AiFillSetting />,
            },
            {
                name: 'Students',
                icon: <AiOutlineUsergroupAdd />,
            },
            {
                name: 'Welcome',
                icon: <AiOutlineArrowLeft />,
            }
        ],
    }
];

// student sidebar links
export const sidebarStudentLinks = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
            },
        ],
    },

    {
        title: 'Pages',
        links: [
            {
                name: 'Scheduled Classes',
                icon: <AiOutlineClockCircle />,
            },
            {
                name: 'Course Activity',
                icon: <AiOutlineRead />,
            },
            {
                name: 'Shared Library',
                icon: <AiOutlineShareAlt />,
            },
            {
                name: 'Messaging',
                icon: <AiFillMessage />,
            },
            // {
            //     name: 'Recordings',
            //     icon: <AiOutlineVideoCamera />,
            // }
        ],
    }
];

// teacher sidebar links
export const sidebarTeacherLinks = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
            },
        ],
    },

    {
        title: 'Pages',
        links: [
            {
                name: 'Scheduled Classes',
                icon: <AiOutlineClockCircle />,
            },
            {
                name: 'Enrolled Students',
                icon: <AiOutlineTeam />,
            },
            {
                name: 'Makeup Requests',
                icon: <AiOutlineForm />,
            },
            {
                name: 'Class Report',
                icon: <AiOutlineFileText />,
            },
            {
                name: 'Payroll',
                icon: <AiOutlineDollar />,
            },
            {
                name: 'Messages',
                icon: <AiFillMessage />,
            },
            {
                name: 'Progress Reports',
                icon: <AiOutlineBarChart />,
            },
            {
                name: 'Settings',
                icon: <AiOutlineSetting />,
            },
        ],
    }
];

export const FRESH_DESK_TYPES = [
    'Question', 'Subscription Cancellation', 
    'Refund Request', 'MakeUp Class Request',
    'Teacher Replacement', 'Student Schedule'
];