import React from 'react';

const ToolOptions = ({ onThicknessChange, onColorChange, thickness, color, hideSlider }) => {
    return (
        <div className="p-2">
            {!hideSlider && 
                <input 
                    type="range" 
                    id="thickness" 
                    min="1" 
                    max="10" 
                    value={thickness}
                    onChange={(e) => onThicknessChange(e.target.value)}
                />
            }
            
            <div className="flex justify-around mt-2">
                <div 
                    className={`w-5 h-5 rounded-sm bg-black cursor-pointer ${color === 'black' ? 'border-2 border-yellow-500' : ''}`} 
                    onClick={() => onColorChange('black')}
                />
                <div 
                    className={`w-5 h-5 rounded-sm bg-red-500 cursor-pointer ${color === 'red' ? 'border-2 border-yellow-500' : ''}`} 
                    onClick={() => onColorChange('red')}
                />
                <div 
                    className={`w-5 h-5 rounded-sm bg-green-500 cursor-pointer ${color === 'green' ? 'border-2 border-yellow-500' : ''}`} 
                    onClick={() => onColorChange('green')}
                />
                <div 
                    className={`w-5 h-5 rounded-sm bg-blue-500 cursor-pointer ${color === 'blue' ? 'border-2 border-yellow-500' : ''}`} 
                    onClick={() => onColorChange('blue')}
                />
            </div>
        </div>
    );
};

export default ToolOptions;