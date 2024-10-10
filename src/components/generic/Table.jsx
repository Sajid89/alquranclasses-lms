import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import CustomButton from './CustomButton';
import SearchAndDownload from '../customer/SearchAndDownload';
import axios from '../../utils/api';
import { 
    TableSkeletonLoader, AttendanceLogModel, 
    Pagination, RecordingsBanner, PayrollModal,
    ToggleButton
} from '../../components';

import { 
    AiOutlineEye as ViewIcon, 
    AiOutlineDownload as DownloadIcon,
    AiFillFile as FileIcon,
    AiFillVideoCamera as VideoFileIcon,
    AiOutlineDelete as DeleteIcon
} from 'react-icons/ai';
import { re } from 'mathjs';

const Table = ({ 
    headers, data, showDownloadButton, showDropDown, 
    loading, showCourses, pagination, currentPage, 
    totalItems, itemsPerPage, paginate, stduentName, 
    recordings, updateData, toggledId, handleToggle
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Tickets');
    const [selectedCourse, setSelectedCourse] = useState('All Courses');
    const [showModal, setShowModal] = useState(false);
    const [showPayrollModal, setShowPayrollModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [classId, setClassId] = useState(null);
    const [classType, setClassType] = useState(null);

    const navigate = useNavigate();

    function handleSearch(searchTerm) {
        setSearchTerm(searchTerm);
    }

    function handleDownloadAll() {
        // Handle download all
        console.log('Download all');
    }

    const handleDownload = async (Id, type) => {
        // Download the row data
        console.log('Download', Id);

        try {
            let response;
            if (type === 'progress-report') {
                response = await axios.post('download-progress-report', 
                    { id: Id }, 
                    { responseType: 'blob' });
                const filename = response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
            } else {
                response = await axios.post('print-single-invoice', { invoice_id: Id });
            }
            toast.success(response.data.message);
        } catch (error) {
            console.log('Failed to download invoice single', error);
        }
    }

    const handleViewReport = (URL) => {
        window.open(URL, '_blank');
    }

    const handleDelete = (ID) => {
        confirmAlert({
            title: 'Remove Resource',
            message: 'Are you sure you want to remove this file?',
            buttons: [
                {
                    label: 'Yes, delete',
                    onClick: async () => {
                        try {
                            const response = await axios.delete(`/delete-progress-report/${ID}`);
                            toast.success(response.data.message);

                            // Update the prop here to trigger the useEffect in the parent component
                            updateData(prevState => !prevState);
                        } catch (error) {
                            console.error("Failed to fetch payment methods:", error);
                        }
                    }
                },
                {
                    label: 'No, thanks!',
                    onClick: () => {}
                }
            ]
        });
    }

    function handleStatusChange(status) {
        setSelectedStatus(status);
    }

    function handleCourseChange(course) {
        setSelectedCourse(course);
    }

    const handleCancelClass = (classId, type) => {
        confirmAlert({
            title: 'Cancel Class',
            message: 'Are you sure you want to cancel this class?',
            buttons: [
                {
                    label: 'Yes, cancel',
                    onClick: () => {
                        axios.post('/student-cancel-class', 
                            { 
                                class_id: classId,
                                class_type: type
                            }
                        )
                            .then(response => {
                                toast.success('Class cancelled successfully');
                                // Update the prop here to trigger the useEffect in the parent component
                                updateData(prevState => !prevState);
                            })
                            .catch(error => {
                                // Handle the error here
                                console.error('Error cancelling class:', error);
                            });
                    }
                },
                {
                    label: 'No, thanks!',
                    onClick: () => {}
                }
            ]
        });
    }

    const handleTeacherWithdrawRequest = (classId) => {
        confirmAlert({
            title: 'Withdraw Request',
            message: 'Are you sure you want to withdraw this request?',
            buttons: [
                {
                    label: 'Yes, withdraw',
                    onClick: () => {
                        toast.success('Request withdrawn successfully');
                        // axios.post('/teacher-withdraw-request', { class_id: classId })
                        //     .then(response => {
                        //         toast.success('Request withdrawn successfully');
                        //         // Update the prop here to trigger the useEffect in the parent component
                        //         updateData(prevState => !prevState);
                        //     })
                        //     .catch(error => {
                        //         // Handle the error here
                        //         console.error('Error withdrawing request:', error);
                        //     });
                    }
                },
                {
                    label: 'No, thanks!',
                    onClick: () => {}
                }
            ]
        });
    }

    const handleTeacherMakeupRequest = (classId, classType, teacherId, studentId, courseId) => {
        confirmAlert({
            title: 'Request for Makeup',
            message: [
                'Note: Your this class will be marked as declined and we will create a new class for makeup.',
                <br />,
                <br />,
                'Are you sure you want to decline this class and request for a makeup?'
            ],
            buttons: [
                {
                    label: 'Yes, Proceed',
                    onClick: () => {
                        navigate(`/teacher/create-makeup-request/${classId}/${classType}/${teacherId}/${studentId}/${courseId}`);
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {}
                }
            ]
        });
    }

    const handleNavigateTeacherCourseActivity = (row) => {
        navigate(`/teacher/course-activity/${row['student'].includes(' ') ? 
            row['student'].toLowerCase().replace(/ /g, '-') : 
            row['student'].toLowerCase()}/${row['course'].includes(' ') ? 
                row['course'].toLowerCase().replace(/ /g, '-') : 
                row['course'].toLowerCase()}/${row['student_id']}/${row['course_id']}`);
    }

    const handleJoinClassNavigate = (
        userType, classId, classType, studentId, 
        teacherId, studentName, teacherName
    ) => {
        console.log('Join class:', userType, classId, classType, studentId, teacherId, studentName, teacherName);
        if (userType === 'student') {
            navigate(`/student/${studentName.replace(/\s+/g, '-')}/class/class-room?classId=${classId}&classType=${classType}&studentId=${studentId}&teacherId=${teacherId}&teacherName=${teacherName}`);
        } else {
            navigate(`/teacher/${teacherName.trim().replace(/\s+/g, '-')}/class/class-room?classId=${classId}&classType=${classType}&studentId=${studentId}&teacherId=${teacherId}&studentName=${studentName}`);
        }
    }


    const filteredData = data.filter(row => 
        Object.values(row).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) && (selectedStatus === 'All Tickets' || row.status === selectedStatus)
        && (selectedCourse === 'All Courses' || row.course === selectedCourse)
    );

    const handleOpenModal = (id) => {
        setSelectedId(id);
        setShowPayrollModal(true);
    };

    const handleCloseModal = () => {
        setSelectedId(null);
        setShowPayrollModal(false);
    };

    const handleOpenAttendanceModal = (id, type) => {
        setClassId(id);
        setClassType(type);
        setShowModal(true);
    }

    return (
        <div>
            <SearchAndDownload
                onSearch={handleSearch}
                onDownloadAll={handleDownloadAll}
                onStatusChange={handleStatusChange}
                showDownloadButton={showDownloadButton}
                showDropDown={showDropDown}
                showCourses={showCourses}
                onCourseChange={handleCourseChange}
            />

            {loading ? (
                <TableSkeletonLoader headers={headers} />
            ) : (
                <>
                    <RecordingsBanner recordings={recordings} />
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table className="w-full border-1 shadow-sm">
                            <thead className="bg-gray-200 border-b-1">
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index} className="p-2 pl-4 text-sm font-normal 
                                            text-gray-500 uppercase">
                                            {header === 'actionButton' ? '' : header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((row, rowIndex) => (
                                        <tr key={rowIndex} className='border-b border-gray-300'>
                                            {headers.map((header, cellIndex) => (
                                                <td key={cellIndex} className='p-3 px-4'>
                                                    {header === 'status' ? (
                                                        <span className={`py-1 pl-6 pr-3 rounded-full text-xs relative ${
                                                            row[header] === 'Active' || row[header] === 'Paid' || row[header] === 'Closed' 
                                                            || row[header] === 'Scheduled' || row[header] === 'Attended' || row[header] === 'Cleared' 
                                                            || row[header] === 'Accepted' || row[header] === 'trial_successful' ? 'bg-green-200' :
                                                            row[header] === 'Suspended' || row[header] === 'Rejected' ? 'bg-red-200' :
                                                            row[header] === 'Refunded' || row[header] === 'Open' || row[header] === 'Makeup' ? 'bg-blue-200' :
                                                            row[header] === 'Reopen' || row[header] === 'Pending' ? 'bg-purple-200' :
                                                            row[header] === 'Absent' ? 'bg-orange-200' :
                                                            'bg-gray-200'
                                                        }`}>
                                                            <span className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full ${
                                                                row[header] === 'Active' || row[header] === 'Paid' || row[header] === 'Closed' || row[header] === 'Scheduled' 
                                                                || row[header] === 'Attended' || row[header] === 'Accepted' 
                                                                || row[header] === 'trial_successful' ? 'dot-green' :
                                                                row[header] === 'Suspended' || row[header] === 'Rejected' ? 'dot-red' :
                                                                row[header] === 'Refunded' || row[header] === 'Open' || row[header] === 'Makeup' ? 'dot-blue' :
                                                                row[header] === 'Reopen' || row[header] === 'Pending' ? 'dot-purple' :
                                                                row[header] === 'Absent' ? 'dot-orange' :
                                                                'dot-gray'
                                                            }`}></span>
                                                            {typeof row[header] === 'string' && row[header].includes('_') 
                                                                ? row[header].split('_').join(' ')
                                                                : row[header]
                                                            }
                                                        </span>
                                                    ) : header === 'action' ? (
                                                        <CustomButton 
                                                            customClass={"bg-transparent text-green"}
                                                            onClick={() => handleDownload(row.invoice_id)}
                                                        >
                                                            {row[header]}
                                                        </CustomButton>
                                                    ) : header === 'view' ? (
                                                        <Link to={`/customer/help/ticket/${row['ticket no']}`} 
                                                            className="text-green">
                                                            {row[header]}
                                                        </Link>
                                                    ) : header === 'date & time' ? (
                                                        <>
                                                            <span className='font-semibold'>{row['date']}</span>
                                                            <br />
                                                            {row['time']}
                                                        </>
                                                    ) : header === 'date' ? (
                                                        <span className='font-semibold'>{row['date']}</span>
                                                    ) : header === 'previous' ? (
                                                        <>
                                                            <span className=''>{row['previousDate']}</span>
                                                            <br />
                                                            {row['previousTime']}
                                                        </>
                                                    ) : header === 'new' ? (
                                                        <>
                                                            <span className='font-semibold'>{row['newDate']}</span>
                                                            <br />
                                                            {row['newTime']}
                                                        </>
                                                    ) : (
                                                        row[header] === 'Join Class' ?
                                                           <span className='text-green underline cursor-pointer'
                                                                onClick={() => handleJoinClassNavigate(
                                                                    row['userType'], row['class_id'], row['type'], 
                                                                    row['student_id'], row['teacher_id'],
                                                                    row['student'], row['teacher']
                                                                )}
                                                            >
                                                                {row[header]}
                                                            </span>
                                                        :
                                                        row[header] === 'View Details' ?
                                                            <span className='text-green underline cursor-pointer' 
                                                                onClick={() => handleOpenAttendanceModal(row['class_id'], row['type'])}
                                                            >
                                                                {row[header]}
                                                            </span>
                                                        :
                                                        row[header] === 'View' ?
                                                            <ViewIcon className='w-4 h-4 text-green underline cursor-pointer' 
                                                                onClick={() => window.location.href = `/student/${stduentName}/view-recording?URL=${row['URL']}`}
                                                            />
                                                        :
                                                        row[header] === 'Cancel Class' ?
                                                            row['status'] !== 'cancelled' ?
                                                                <span className='text-gray-500 cursor-pointer' 
                                                                    onClick={() => handleCancelClass(row['class_id'], row['type'])}>
                                                                    {row[header]}
                                                                </span>
                                                            : ''
                                                        :
                                                        row[header] === 'Withdraw Request' ?
                                                            <span className='text-red-500 cursor-pointer' 
                                                                onClick={() => handleTeacherWithdrawRequest(row['class_id'])}>
                                                                {row[header]}
                                                            </span>
                                                        :
                                                        row[header] === 'Makeup Request' ?
                                                            row['type'] !== 'trial' ?
                                                                <span className='text-green cursor-pointer' 
                                                                    onClick={() => handleTeacherMakeupRequest(
                                                                        row['class_id'], row['type'], row['teacher_id'], row['student_id'], row['course_id']
                                                                    )}
                                                                >
                                                                    {row[header]}
                                                                </span>
                                                            : ''
                                                        :
                                                        row[header] === 'Manage Attachments' ?
                                                            <Link to={`/teacher/manage-attachments/${row['student_id']}`} 
                                                                className='text-green underline'>
                                                                {row[header]}
                                                            </Link>
                                                        :
                                                        row[header] === 'View Activity' ?
                                                            <span className='text-green underline cursor-pointer' 
                                                                onClick={() => handleNavigateTeacherCourseActivity(row)}>
                                                                {row[header]}
                                                            </span>
                                                        :
                                                        header === 'file' ?
                                                            <div className="flex items-center space-x-2">
                                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-light-green">
                                                                    {row[header].endsWith('.mp4') ? <VideoFileIcon className="w-4 h-4 text-green" /> : <FileIcon className="w-4 h-4 text-green" />}
                                                                </div>
                                                                <div>
                                                                    <div>{ row[header] }</div>
                                                                    <div className="text-sm text-gray-400">
                                                                        { row['size'] }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        : 
                                                        header === 'amount' ?
                                                            <span className='text-green underline cursor-pointer' 
                                                                onClick={() => handleOpenModal(row['id'])}
                                                            >
                                                                {row[header]}
                                                            </span>
                                                        :
                                                        row[header] === 'crud' ?
                                                            <div className='flex'>
                                                                <span className='text-green underline cursor-pointer'  
                                                                    onClick={() => handleDownload(row['id'], row['type'])}>
                                                                    <DownloadIcon className='w-4 h-4' />
                                                                </span>
                                                                <span className='text-green underline cursor-pointer ml-2' 
                                                                    onClick={() => handleViewReport(row['file_url'])}>
                                                                    <ViewIcon className='w-4 h-4' />
                                                                </span>
                                                                <span className='text-green underline cursor-pointer ml-2' 
                                                                    onClick={() => handleDelete(row['id'])}>
                                                                    <DeleteIcon className='w-4 h-4' />
                                                                </span>
                                                            </div>
                                                        :
                                                        row[header] === 'view-attachment' ?
                                                            <div className='flex'>
                                                                <span className='text-green underline cursor-pointer' onClick={() => handleDownload(row['invoice_id'])}>
                                                                    <DownloadIcon className='w-4 h-4' />
                                                                </span>
                                                                <span className='text-green underline cursor-pointer ml-2' onClick={() => handleDownload(row['invoice_id'])}>
                                                                    <ViewIcon className='w-4 h-4' />
                                                                </span>
                                                            </div>
                                                        :
                                                        row[header] === 'toggle-assignment' ?
                                                            <ToggleButton
                                                                key={row['id']}
                                                                id={row['id']}
                                                                isToggled={row.isAssigned} // Check if toggledId matches row.id or if row.isAssigned is true
                                                                onToggle={handleToggle}
                                                            />
                                                        :
                                                        row[header] === 'View Reports' ?
                                                            <Link to={`/teacher/view-student-reports/${row['student_id']}/${row['course_id']}`} 
                                                                className='text-green underline'>
                                                                {row[header]}
                                                            </Link>
                                                        :
                                                        <div className={`${['course','type','assigned','duration'].includes(header) 
                                                            ? 'text-gray-400' : ''}`}>
                                                            {row[header]}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headers.length} className="text-center py-4">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination && (
                        <Pagination 
                            currentPage={currentPage} 
                            totalItems={totalItems} 
                            itemsPerPage={itemsPerPage} 
                            paginate={paginate} 
                        />
                    )}

                    {showModal && (
                        <AttendanceLogModel 
                            isOpen={showModal} 
                            onRequestClose={() => setShowModal(false)}
                            classId={classId}
                            classType={classType}
                        />
                    )}
                    
                    {showPayrollModal && selectedId && (
                        <PayrollModal 
                            isOpen={showPayrollModal} 
                            onRequestClose={handleCloseModal}
                            ID={selectedId}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Table;