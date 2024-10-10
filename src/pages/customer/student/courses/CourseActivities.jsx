import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Breadcrumb, TicketViewSkeletonLoader, ActivityCard, Pagination } from '../../../../components';
import avatar from '../../../../data/placedolder_avatar.jpg';
import api from '../../../../utils/api';

import { formatDistanceToNow } from 'date-fns';

const CourseActivities = () => {
    const { studentName } = useParams();
    const { courseName } = useParams();
    const students = useSelector(state => state.students.data);
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    const course = student.courses.find(course => course.name.toLowerCase().replace(/ /g, '-') === courseName);
    
    const [loading, setLoading] = useState(true);
    const [courseActivity, setCourseActivity] = useState([]);
    const [totalCourseActivity, setTotalCourseActivity] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchStudentActivities = async () => {
            try {
                const response = await api.post('/student-course-activity-for-student', 
                    {
                        student_id: student.id,
                        course_id: course.id,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                );
                const data = response.data.data;
                const transformedData = data.activities.map(activity => ({
                    id: 1,
                    profilePic: activity.profile_pic ? activity.profile_pic : avatar,
                    name: activity.teacher_name,
                    timestamp: formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }),
                    type: activity.activity_type,
                    course: activity.course_name,
                    activity: {
                        name: activity.activity_type === 'file' ?
                            activity.file_name : activity.description,
                        size: activity.activity_type === 'file' ?
                            activity.file_size : '',
                    }
                }));
                
                setCourseActivity(transformedData);
                setTotalCourseActivity(data.total);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentActivities();
    }, [currentPage, itemsPerPage]);

    return (
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Course Activities
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Course Activity', link: `/student/${studentName.toLowerCase()}/course-activity` },
                        { name: course.name, active: true }
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

export default CourseActivities