import React from 'react';

const StudentProfileSkeletonLoader = () => {
    return (
        <>
            <div className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
                <div className="border-1 border-gray-200 p-4 rounded-md
                    flex flex-col items-center h-36">
                    <div className="w-16 h-16 rounded-full mb-4 bg-gray-300 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 w-3/4 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="p-2 w-1/2 md:w-1/3 lg:w-1/4">
                <div className="border-1 border-gray-200 p-4 rounded-md
                    flex flex-col items-center h-36">
                    <div className="w-16 h-16 rounded-full mb-4 bg-gray-300 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 w-3/4 rounded animate-pulse"></div>
                </div>
            </div>
        </>
    );
}

export default StudentProfileSkeletonLoader;