import React from 'react';

const Card = ({ icon, text, number, style }) => {
    return (
        <div className='bg-white shadow-md rounded-md mb-4 p-4 pb-3 w-full sm:w-auto card' 
            style={style}>
            <div className='flex flex-col sm:flex-row text-center sm:text-left items-center'>
                <div className='rounded-sm bg-green p-3'>
                    {React.cloneElement(icon, { color: "white", size: "1em" })}
                </div>
                <div className='mt-2 sm:mt-0 sm:ml-4'>
                    <p className='text-gray-600'>{text}</p>
                    <p className='text-green text-2xl font-semibold'>{number}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;