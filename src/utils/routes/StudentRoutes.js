import {
    StudentDashboard, Chat, ClassSchedule, 
    SharedLibrary, Courses, CourseActivities,
    Recordings, ViewRecording, RecordingPlans,
    WhiteBoard
} from '../../pages/customer/student';

import {
    ClassRoom
} from '../../pages';

const StudentRoutes = [
    {
        path: '/dashboard',
        component: StudentDashboard,
    },
    {
        path: '/messaging',
        component: Chat,
    },
    {
        path: '/scheduled-classes',
        component: ClassSchedule,
    },
    {
        path: '/shared-library',
        component: SharedLibrary,
    },
    {
        path: '/course-activity',
        component: Courses,
    },
    {
        path: '/course-activity/:courseName',
        component: CourseActivities,
    },
    {
        path: '/recordings',
        component: Recordings,
    },
    {
        path: '/view-recording',
        component: ViewRecording,
    },
    // {
    //     path: '/recording-plans',
    //     component: RecordingPlans,
    // }
];

const studentOtherRoutes = [
    {
        path: '/class-room',
        component: ClassRoom,
    },
    {
        path: '/white-board',
        component: WhiteBoard,
    }
]

export { StudentRoutes, studentOtherRoutes };