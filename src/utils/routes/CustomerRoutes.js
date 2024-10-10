import { 
    Dashboard, AddStudentInfo, AddCourseInfo, AddAvailability, StudentAdded,
    TransactionAndBillings, AddPaymendMethod, CancelSubscription, StudentProfile,
    StudentDetails, CustomerSupport, CreateTicket, ViewTicket, Chat, ChangeTeacher,
    ChangeTeacherSchedule, Profile, UpdateProfile, VerifyPhone, SetParentalLock
} from '../../pages/customer';

const CustomerRoutes = [
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/transaction-billing',
        component: TransactionAndBillings,
    },
    {
        path: '/add-payment-method',
        component: AddPaymendMethod,
    },
    {
        path: '/student-profile/:studentName',
        component: StudentProfile,
    },
    {
        path: '/student-details/:studentName/:courseId',
        component: StudentDetails,
    },
    {
        path: '/cancel-subscription',
        component: CancelSubscription,
    },
    {
        path: '/messages',
        component: Chat,
    },
    {
        path: '/settings',
        component: Profile,
    },
    {
        path: '/settings/edit-profile',
        component: UpdateProfile,
    },
    {
        path: '/settings/phone-verify',
        component: VerifyPhone,
    },
    {
        path: '/settings/parental-lock',
        component: SetParentalLock,
    }
];

const CustomerOtherRoutes = [
    {
        path: 'add-student',
        component: AddStudentInfo,
    },
    {
        path: '/:studentName/add-course',
        component: AddCourseInfo,
    },
    {
        path: 'add-availability',
        component: AddAvailability,
    },
    {
        path: 'added',
        component: StudentAdded
    },
    {
        path: 'customer-support',
        component: CustomerSupport
    },
    {
        path: 'ticket/:ticketNo',
        component: ViewTicket
    },
    {
        path: 'create-ticket',
        component: CreateTicket
    },
    {
        path: 'change-teacher',
        component: ChangeTeacher,
    },
    {
        path: 'change-teacher/schedule',
        component: ChangeTeacherSchedule,
    }
];


export { CustomerRoutes, CustomerOtherRoutes };
