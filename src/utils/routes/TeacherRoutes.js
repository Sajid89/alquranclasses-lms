import {
    Dashboard, ClassSchedule, MakeupRequests,
    ClassesReport, ProgressReport, ViewStudentReports, AssignReport,
    EnrolledStudents, CourseActivity, Payroll, BankDetails, 
    ProfileSetting, Chat, ManageAttachments, CreateMakeupRequest
} from '../../pages/teacher';

import {
    ClassRoom
} from '../../pages';

const TeacherRoutes = [
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/scheduled-classes',
        component: ClassSchedule,
    },
    {
        path: '/makeup-requests',
        component: MakeupRequests,
    },
    {
        path: '/class-report',
        component: ClassesReport,
    },
    {
        path: '/progress-reports',
        component: ProgressReport,
    },
    {
        path: '/view-student-reports/:studentID/:courseID',
        component: ViewStudentReports,
    },
    {
        path: '/assign-report',
        component: AssignReport,
    },
    {
        path: '/enrolled-students',
        component: EnrolledStudents,
    },
    {
        path: '/course-activity/:studentName/:courseName/:studentID/:courseID',
        component: CourseActivity,
    },
    {
        path: '/payroll',
        component: Payroll,
    },
    {
        path: '/bank-details',
        component: BankDetails,
    },
    {
        path: 'settings',
        component: ProfileSetting,
    },
    {
        path: '/messages',
        component: Chat,
    },
    {
        path: '/manage-attachments/:studentID',
        component: ManageAttachments,
    },
    {
        path: '/create-makeup-request/:classID/:classType/:teacherID/:studentID/:courseID',
        component: CreateMakeupRequest,
    },
];

const TeacherOtherRoutes = [
    {
        path: '/class-room',
        component: ClassRoom,
    },
];

export { TeacherRoutes, TeacherOtherRoutes };
