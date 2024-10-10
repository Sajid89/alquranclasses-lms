import React from 'react';
import { Link } from 'react-router-dom';

const Table = ({ data }) => {
    return (
        <table className="w-full border-1 shadow-sm">
            <thead className="bg-gray-100 border-b-1">
                <tr>
                    <th className="p-2 pl-4 text-sm font-normal text-gray-500">STUDENT NAME</th>
                    <th className="p-2 pl-0 text-sm font-normal text-gray-500">ATTENDANCE</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className='p-3 px-4 flex items-center'>
                                <img className="rounded-full" src={item.profilePic} alt={item.name} width="50" height="50" />
                                <div className="ml-3">
                                    {item.name}
                                    <p>{item.enrolledCourses} Enrolled Courses</p>
                                </div>
                            </td>
                            <td className='py-3 pr-4'>
                                <div className="w-full bg-gray-300 rounded relative">
                                    <div 
                                        className={`h-2 rounded 
                                        ${item.attendance >= 70 ? 
                                            'bg-green' : item.attendance >= 50 
                                            ? 'bg-yellow-500' : 'bg-red-500'}
                                        `} 
                                        style={{ width: `${item.attendance}%` }}
                                    ></div>
                                    <div className="absolute w-full text-center">
                                        {item.attendance}%
                                    </div>
                                </div>
                            </td>
                            <td className='text-center'>
                                <Link to={`/customer/student-profile/${item.name}`} className="p- text-green underline">
                                    View Profile
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center p-4">No data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default Table;