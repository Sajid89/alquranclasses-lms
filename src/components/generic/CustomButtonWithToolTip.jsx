import React, { useState, useContext, useRef } from 'react';
import { UploadFileContext } from '../../contexts/UploadFileContext';

const CustomButtonWithToolTip = ({ customClass, onClick, zeroPadding, children, toolName, toolOptions }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { onFileChange } = useContext(UploadFileContext);
    const inputId = `upload-input-${toolName}`;
    
    // for file upload
    const fileInputRef = useRef();

    const handleClick = () => {
        onClick();

        if (toolName === 'Upload') {
            fileInputRef.current.click();
        } else {
            setShowOptions(prevShowOptions => !prevShowOptions);
        }
    };

    return (
        <div className="relative flex flex-col items-center space-y-4 py-1">
            {!showOptions ? (
                <div 
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {showTooltip && (
                        <div className="absolute left-6 text-white p-1 
                        rounded-sm text-xs bg-gray-800"
                        >
                            {toolName}
                        </div>
                    )}
                    <button 
                        className={`text-2xl ${customClass}`} 
                        onClick={() => {
                            handleClick();
                        }}
                        style={{ padding: zeroPadding ? '0' : '' }}
                    >
                        {children}
                    </button>
                    {toolName === 'Upload' && (
                        <label htmlFor={inputId}>
                            <input 
                                type="file" 
                                id={inputId} 
                                onChange={onFileChange} 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                            />
                        </label>
                    )}
                </div>
            ): (
                <button 
                    className={`text-2xl ${customClass}`} 
                    onClick={() => {
                        handleClick();
                    }}
                    style={{ padding: zeroPadding ? '0' : '' }}
                >
                    {children}
                </button>
            )}
            {showOptions && (
                <div className="absolute top-[-50%] left-1/8 z-10 transform 
                    bg-white shadow-md rounded-md">
                    {toolOptions}
                </div>
            )}
        </div>
    );
};

export default CustomButtonWithToolTip;