import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TableComponent, Tabs } from '../../../../components';
import api from '../../../../utils/api';
import { 
    AiOutlineEye as ViewIcon, 
    AiOutlineDownload as DownloadIcon,
    AiFillFile as FileIcon
} from 'react-icons/ai';

const SharedLibrary = () => {
    const { studentName } = useParams();
    const students = useSelector(state => state.students.data);
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Change this to the number of items you want per page

    const tableHeaders = [
        'file', 'course', 'assigned', 'actionButton'
    ];

    useEffect(() => {
        setLoading(true);
        api.post('/get-student-library-files', {
            student_id: student.id,
            page: currentPage,
            limit: itemsPerPage
        })
        .then(response => {
            const transformedData = response.data.data.files.map(file => ({
                file: file.file,
                size: `${(file.size / 1024).toFixed(2)} MB`,
                course: file.course,
                assigned: file.assigned_at,
                actionButton: (
                    <div className="flex text-green space-x-2">
                        <ViewIcon className="w-6 h-6 cursor-pointer" onClick={() => window.open(file.file_url, '_blank')} />
                    </div>
                )
            }));
            console.log(transformedData);
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

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Shared Library
                </h3>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    {/* <h3 className='font-semibold mb-3'>Transaction & Billings</h3> */}
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
                    />
                </div>
            </div>
        </div>
    );
}

export default SharedLibrary