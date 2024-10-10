import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import { Breadcrumb, TicketViewSkeletonLoader, 
    ActivityCard, Pagination } from '../../../components';
import avatar from '../../../data/placedolder_avatar.jpg';
import api from '../../../utils/api';

const CourseActivity = () => {
    const { studentName } = useParams();
    const { courseName } = useParams();
    const { studentID } = useParams();
    const { courseID } = useParams();
    
    const [loading, setLoading] = useState(true);
    const [courseActivity, setCourseActivity] = useState([]);
    const [totalCourseActivity, setTotalCourseActivity] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchStudentActivities = async () => {
            try {
                const response = await api.post('/student-activities', 
                    {
                        student_id: studentID,
                        course_id: courseID,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                );
                const data = response.data.data;
                const transformedData = data.students.map(activity => ({
                    id: 1,
                    profilePic: avatar,
                    name: 'You',
                    timestamp: formatDistanceToNow(new Date(activity.created_at_teacher_timezone), { addSuffix: true }),
                    type: activity.activity_type,
                    course: activity.course_title,
                    activity: {
                        name: activity.activity_type === 'file' ?
                            activity.file_name : activity.description,
                        size: activity.activity_type === 'file' ?
                            activity.file_size : '',
                    }
                }));
                
                setCourseActivity(transformedData);
                setTotalCourseActivity(data.count);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentActivities();
    }, [currentPage, itemsPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        // fetch activities for a course
    }, []);

    return (
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    {`${studentName.charAt(0).toUpperCase()}${studentName.slice(1).toLowerCase()}'s`} Activities
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Enrolled Students', link: `/teacher/enrolled-students` },
                        { name: 'Courses Activities', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row mt-6 pl-6 pr-6'>
                <div className='w-full'>
                    {loading ? (
                        <TicketViewSkeletonLoader />
                    ) : (
                        courseActivity.length === 0 ? (
                            <div className="text-center text-gray-500 mt-4">
                                No course activities available.
                            </div>
                        ) : (
                            courseActivity.map(activity => (
                                <ActivityCard activity={activity} key={activity.id} />
                            ))
                        )
                    )}

                    {totalCourseActivity > itemsPerPage && (
                        <Pagination 
                            currentPage={currentPage} 
                            totalItems={totalCourseActivity} 
                            itemsPerPage={itemsPerPage} 
                            paginate={paginate} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseActivity