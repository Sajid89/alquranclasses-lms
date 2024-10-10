import React, { useState } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { COURSES } from '../../data/TextConstants';

const SearchAndDownload = ({ 
    onSearch, onDownloadAll, onStatusChange,
    showDownloadButton, showDropDown, showCourses,
    onCourseChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        onStatusChange(event.target.value);
    };

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
        onCourseChange(event.target.value);
    };

    return (
        <div className="flex items-center bg-gray-100 p-4 w-full mb-4 rounded-md">
            <div className="relative flex-grow">
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border pl-8 w-full py-2 rounded-md focus:outline-none 
                        focus:border-gray-600 transition duration-300 ease-in-out
                        border-gray-300"
                />
            </div>
            {showDownloadButton && (
                <button onClick={onDownloadAll} className="bg-white border ml-4 py-2 px-4 rounded-md flex items-center">
                    <FiDownload className="mr-2" />
                    Download all
                </button>
            )} 

            {showDropDown && (
                <div className="relative flex items-center">
                    <select 
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="appearance-none border border-gray-300 
                            rounded-md py-2 pl-3 pr-8 ml-4 w-full focus-visible:outline-none
                            focus-visible:border-gray-600 transition duration-300 ease-in-out">
                        <option>All Tickets</option>
                        <option>Open</option>
                        <option>Closed</option>
                        <option>Reopen</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <IoIosArrowDown />
                    </div>
                </div>
            )}

            {showCourses && (
                <div className="relative flex items-center">
                    <select 
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        className="appearance-none border border-gray-300 
                            rounded-md py-2 pl-3 pr-8 ml-4 w-full focus-visible:outline-none
                            focus-visible:border-gray-600 transition duration-300 ease-in-out">
                        <option>All Courses</option>
                        {COURSES.map((course, index) => (
                            <option key={index}>{course['value']}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <IoIosArrowDown />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchAndDownload;