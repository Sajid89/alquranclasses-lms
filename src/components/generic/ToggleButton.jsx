import React from 'react';

const ToggleButton = ({ id, isToggled, onToggle }) => {
    const handleToggle = () => {
        onToggle(id);
    };

    return (
        <div
            className={`cursor-pointer w-11 h-6 flex items-center rounded-full 
                p-1 border ${isToggled ? 'green-border' : 'border-gray-400'}`}
            onClick={handleToggle}
        >
            <div
                className={`w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out 
                    ${isToggled ? 'translate-x-5 bg-green' : 'translate-x-0 bg-gray-400'}`}
            >
            </div>
        </div>
    );
};

export default ToggleButton;