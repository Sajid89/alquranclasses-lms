import React from 'react';

const TableSkeletonLoader = ({ headers }) => {
    return (
        <table className="w-full border-1 shadow-sm">
            <thead className="bg-gray-200 border-b-1">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="p-2 pl-4 text-sm font-normal 
                            text-gray-500 uppercase">
                            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array(5).fill().map((_, rowIndex) => (
                    <tr key={rowIndex} className='border-b border-gray-300'>
                        {headers.map((_, cellIndex) => (
                            <td key={cellIndex} className='p-3 px-4'>
                                <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TableSkeletonLoader;