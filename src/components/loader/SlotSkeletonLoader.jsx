import React from 'react';

const SlotSkeletonLoader = ({ displayMultiple = false, displayLength = 0 }) => {
    const loaders = displayMultiple ? Array.from({ length: displayLength }) : [null];

    return (
        <>
            {loaders.map((_, index) => (
                <div
                    key={index}
                    className='w-24 border-1 mt-2 mb-2 bg-gray-200 p-1 mx-2 
                        flex items-center justify-center text-xs'
                >
                    <div className="h-3 bg-gray-400 rounded"></div>
                </div>
            ))}
        </>
    );
};

export default SlotSkeletonLoader;