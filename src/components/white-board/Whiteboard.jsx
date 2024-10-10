import React, { useState, useEffect, useRef, useContext } from 'react';
import { usePencil } from './drawing/Pencil';
import { useRectangle } from './drawing/Rectangle';
import { useText } from './drawing/Text';
import { useEraser } from './drawing/Eraser';
import { useReset } from './drawing/Reset';
import { useFileUpload } from './drawing/Upload';
import { UploadFileContext } from '../../contexts/UploadFileContext';

const Whiteboard = ({ tool, thickness, color, inputSize }) => {
    const canvasRef    = useRef(null);
    const textInputRef = useRef(null);
    const [textField, setTextField] = useState(null);
    const [isTextBeingEdited, setIsTextBeingEdited] = useState(false);
    const { fileData } = useContext(UploadFileContext);

    const pencil = usePencil(canvasRef, color, thickness);
    const rectangle = useRectangle(canvasRef, color, thickness);
    const text = useText(canvasRef, color, thickness, textInputRef, setTextField);
    const eraser = useEraser(canvasRef, thickness, textField, setIsTextBeingEdited);

    
    const { onFileChange, imagesRef } = useFileUpload(canvasRef);
    const reset = useReset(tool, canvasRef, textField, setIsTextBeingEdited, setTextField, imagesRef);

    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    

    // Initialization
    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            // Set the size of the canvas drawing surface
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        return () => {
            // Cleanup function to clear canvas reference and stop any ongoing operations
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvasRef.current = null;
            }
        };
    }, []);

    // Drawing
    useEffect(() => {
        let cleanup = null;

        if (tool === 'pencil') {
            cleanup = pencil();
        } else if (tool === 'rectangle') {
            cleanup = rectangle();
        } else if (tool === 'text') {
            cleanup = text();
            setIsTextBeingEdited(true);
        } else if (tool === 'eraser') {
            cleanup = eraser();
        } else if (tool === 'reset') {
            cleanup = reset();
        }

        // ... add more tools here ...

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [tool, color, thickness]);

    const handleDragStart = (event) => {
        event.dataTransfer.setDragImage(new Image(), 0, 0);
        setDragOffset({ x: event.clientX - inputPosition.x, y: event.clientY - inputPosition.y });
    };
    
    const handleDrag = (event) => {
        if (event.clientX === 0 && event.clientY === 0) {
            return; // Ignore the drag event that's fired at the end of the drag
        }
        setInputPosition({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });
    };

    const handleTextChange = (event) => {
        setTextField(prevState => ({ ...prevState, text: event.target.value }));
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    return (
        <div className='relative w-full h-full bg-white rounded-md'>
            <textarea 
                ref={textInputRef} 
                style={{ 
                    position: 'absolute', 
                    left: `${inputPosition.x}px`, 
                    top: `${inputPosition.y}px`, 
                    color: color,
                    fontSize: `${inputSize * 3}px`,
                    lineHeight: `${inputSize * 3}px`,
                    border: '1px solid gray',
                    display: (tool === 'text' || isTextBeingEdited) ? 'block' : 'none',
                    overflow: 'hidden',
                    resize: 'none',
                    width: '200px',
                }}
                draggable
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onChange={handleTextChange}
                value={textField ? textField.text : ''}
            />

            <canvas 
                ref={canvasRef} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    // border: '1px solid black',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' 
                }} 
            />
        </div>
    );
};

export default Whiteboard;