import React from 'react';

const ReasonListSkeletonLoader = () => (
    <div className="border-1 rounded-md p-2 mb-2 flex items-center bg-gray-400 animate-pulse w-3/4">
    <div className="w-5 h-5 mr-2 rounded flex items-center justify-center">
        <div className="bg-gray-400 h-6 w-6"></div>
    </div>
    <div className="bg-gray-400 h-6 w-44"></div>
</div>
);

export default ReasonListSkeletonLoader;