import React from 'react';

const CustomButton = ({ children, onClick, customClass, zeroPadding }) => {
    return (
        <button 
            className={` 
            ${customClass ? customClass 
                : 'mt-4 shadow bg-dark-green hover:bg-green text-white'} 
                focus:shadow-outline focus:outline-none  
                ${zeroPadding ? 'p-0' : 'py-2 px-8'} rounded`}
            type='submit'
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default CustomButton;