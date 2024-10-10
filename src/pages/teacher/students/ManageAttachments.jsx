import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Breadcrumb, TableComponent } from '../../../components';
import avatar from '../../../data/placedolder_avatar.jpg';
import api from '../../../utils/api';
import { USER_TYPES } from '../../../data/TextConstants';

import { 
    AiOutlineEye as ViewIcon
} from 'react-icons/ai';
import { to } from 'mathjs';

const ManageAttachments = () => {
    const [toggledId, setToggledId] = useState(0);
    const [lastToggledId, setLastToggledId] = useState(null);
    const { studentID } = useParams();
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updateClasses, setUpdateClasses] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);

    const tableHeaders = [
        'file', 'course', 'assign', 'actionButton'
    ];

    useEffect(() => {
        setLoading(true);
        api.post('/get-teacher-library-files', {
            page: currentPage,
            limit: itemsPerPage
        })
        .then(response => {
            const transformedData = response.data.data.files.map(file => ({
                id: file.id,
                file: file.file,
                size: `${(file.size / 1024).toFixed(2)} MB`,
                course: file.course,
                assign: 'toggle-assignment',
                isAssigned: file.is_assigned,
                actionButton: (
                    <div className="flex text-green space-x-2">
                        <ViewIcon className="w-6 h-6 cursor-pointer" onClick={() => window.open(file.file_url, '_blank')} />
                    </div>
                )
            }));
           
            setData(transformedData);
            setTotalItems(response.data.data.total);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        })
        .finally(() => setLoading(false));
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleToggle = (id) => {
        if (assignLoading) return;

        if (toggledId === id) {
            setLastToggledId(id);
            setToggledId(null);
        } else {
            setToggledId(id);
        }
    };

    useEffect(() => {
        const assignFile = async () => {
            setAssignLoading(true);
            try {
                const response = await api.post('/assign-library-file-student', {
                    student_id: studentID,
                    file_id: toggledId
                });
                toast.success(response.data.message);
                // Update the data state
                setData(prevData => prevData.map(file => 
                    file.id === toggledId ? { ...file, isAssigned: true } : file
                ));
            } catch (error) {
                console.log(error);
            } finally {
                setAssignLoading(false);
            }
        };

        const unassignFile = async () => {
            setAssignLoading(true);
            try {
                const response = await api.post('/unassign-library-file-student', {
                    student_id: studentID,
                    file_id: lastToggledId
                });
                toast.success(response.data.message);
                // Update the data state
                setData(prevData => prevData.map(file => 
                    file.id === lastToggledId ? { ...file, isAssigned: false } : file
                ));
            } catch (error) {
                console.log(error);
            } finally {
                setAssignLoading(false);
            }
        };

        if (toggledId) {
            assignFile();
            console.log('Assigning file:', toggledId );
        } else if (toggledId === null && lastToggledId !== null) {
            unassignFile();
            console.log('Unassigning file:', lastToggledId );
        }
    }, [toggledId]);

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6 mb-8'>
                <h3 className='font-semibold text-xl mb-4'>
                    All Attachments
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Enrolled Students', link: `/teacher/enrolled-students` },
                        { name: 'View All Attachments', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={data} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={totalItems} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateClasses}
                        toggledId={toggledId} 
                        handleToggle={handleToggle}
                    />
                </div>
            </div>
        </div>
    );
}

export default ManageAttachments