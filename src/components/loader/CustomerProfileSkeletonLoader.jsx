import React from 'react';

const CustomerProfileSkeletonLoader = () => (
    <div className="w-full md:w-6/12">
        <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-400 rounded w-6/6"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                <div className="h-4 bg-gray-400 rounded w-4/6"></div>
                <div className="h-4 bg-gray-400 rounded w-3/6"></div>
            </div>
        </div>
    </div>
);

export default CustomerProfileSkeletonLoader;