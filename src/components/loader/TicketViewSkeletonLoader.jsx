import React from 'react';

const TicketViewSkeletonLoader = () => (
    <div className="flex mt-24 md:mt-8 mx-6 md:mx-16 mb-4 items-center space-x-4 animate-pulse">
        <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

export default TicketViewSkeletonLoader;