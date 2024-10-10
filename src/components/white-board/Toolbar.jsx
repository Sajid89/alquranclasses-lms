import React, { useState, useEffect, useRef } from 'react';
import { 
    AiFillDelete, AiOutlineFileText, 
    AiOutlineBorder, AiOutlineReload,
    AiOutlineUpload, AiOutlineEdit
} from 'react-icons/ai';
import { BiEraser } from 'react-icons/bi';
import { CustomButtonWithToolTip, ToolOptions } from '../../components';

const Toolbar = ({ onToolChange, onThicknessChange, onColorChange, onInputSizeChange }) => {
    const toolbarRef = useRef();
    const [showOptions, setShowOptions] = useState(false);
    const [currentTool, setCurrentTool] = useState(null);
    const [thickness, setThickness] = useState(3);
    const [color, setColor] = useState('black');

    const handleThicknessChange = (newThickness) => {
        setThickness(newThickness);
        onThicknessChange(newThickness);

        if (currentTool === 'text') {
            onInputSizeChange(newThickness);
        }
    };

    const handleColorChange = (newColor) => {
        setColor(newColor);
        onColorChange(newColor);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col items-center w-8 bg-white shadow pt-2 
            pb-1 mr-4 rounded-full">
            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('pencil');
                    onToolChange('pencil');
                    setShowOptions(prevShowOptions => !prevShowOptions);
                }}
                zeroPadding={true}
                toolName="Pen"
                toolOptions={
                    showOptions && currentTool === 'pencil' && (
                        <ToolOptions 
                            onThicknessChange={handleThicknessChange}
                            onColorChange={handleColorChange}
                            thickness={thickness}
                            color={color}
                        />
                    )
                }
            >
                <AiOutlineEdit size={20} />
            </CustomButtonWithToolTip>

            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('rectangle');
                    onToolChange('rectangle');
                    setShowOptions(prevShowOptions => !prevShowOptions);
                }}
                zeroPadding={true}
                toolName="Rectangle"
                toolOptions={
                    showOptions && currentTool === 'rectangle' && (
                        <ToolOptions 
                            onThicknessChange={handleThicknessChange}
                            onColorChange={handleColorChange}
                            thickness={thickness}
                            color={color}
                        />
                    )
                }
            >
                <AiOutlineBorder size={20} />
            </CustomButtonWithToolTip>

            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('text');
                    onToolChange('text');
                    setShowOptions(prevShowOptions => !prevShowOptions);
                }}
                zeroPadding={true}
                toolName="Text"
                toolOptions={
                    showOptions && currentTool === 'text' && (
                        <ToolOptions 
                            onThicknessChange={handleThicknessChange}
                            onColorChange={handleColorChange}
                            thickness={thickness}
                            color={color}
                        />
                    )
                }
            >
                <AiOutlineFileText size={20} />
            </CustomButtonWithToolTip>

            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('eraser');
                    onToolChange('eraser');
                    setShowOptions(false);
                }}
                zeroPadding={true}
                toolName="Eraser"
            >
                <BiEraser size={20} />
            </CustomButtonWithToolTip>

            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('reset');
                    onToolChange('reset');
                    setShowOptions(false);
                }}
                zeroPadding={true}
                toolName="Reset"
            >
                <AiOutlineReload size={16} />
            </CustomButtonWithToolTip>

            <CustomButtonWithToolTip 
                customClass={'bg-transparent text-gray-600'}
                onClick={() => {
                    setCurrentTool('upload');
                    onToolChange('upload');
                    setShowOptions(false);
                }}
                zeroPadding={true}
                toolName="Upload"
            >
                <AiOutlineUpload size={20} />
            </CustomButtonWithToolTip>
        </div>
    );
};

export default Toolbar;