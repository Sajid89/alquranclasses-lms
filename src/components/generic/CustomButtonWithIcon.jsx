import React from 'react';

const CustomButtonWithIcon = ({ buttonText, buttonColor, textColor, icon, onClick }) => {
    return (
        <button 
            className={`flex items-center space-x-2 bg-${buttonColor} 
            text-${textColor} p-2 rounded`}
            onClick={onClick}
        >
            <div className='text-xs'>{buttonText}</div>
            {icon}
        </button>
    );
};

export default CustomButtonWithIcon;