// Eraser.js
import { useCallback, useEffect, useRef } from 'react';
import eraserIcon from '../../../data/icons/eraser_icon.png';

export const useEraser = (canvasRef, thickness, textField, setIsTextBeingEdited) => {
    const textFieldRef = useRef(textField);
    useEffect(() => {
        textFieldRef.current = textField;
    }, [textField]);

    //textFieldRef.current = textField; // Update textFieldRef.current directly

    const eraser = useCallback(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Create eraser icon
        const eraserImg = document.createElement('img');
        eraserImg.src = eraserIcon;
        eraserImg.className = 'eraser-icon';
        eraserImg.style.position = 'absolute';
        eraserImg.style.display = 'none';
        eraserImg.style.width = '25px';
        eraserImg.style.height = '25px';
        eraserImg.style.pointerEvents = 'none';
        document.body.appendChild(eraserImg);

        const handleMouseDown = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            context.clearRect(x, y, thickness * 3, thickness * 3);
            canvas.addEventListener('mousemove', handleMouseMove);
            eraserImg.style.display = 'block';
            canvas.style.cursor = 'none';
        };

        const handleMouseUp = () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            eraserImg.style.display = 'none';
            canvas.style.cursor = 'auto'; 
        };

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            context.clearRect(x, y, thickness * 3, thickness * 3);
            eraserImg.style.left = `${event.clientX - eraserImg.width / 2}px`;
            eraserImg.style.top = `${event.clientY - eraserImg.height / 2}px`;
            
            // Check if the cursor is over the text field
            const currentTextField = textFieldRef.current;
        
            //console.log(currentTextField);
            //console.log(x, y);

            if (currentTextField && x >= currentTextField.x && 
                x <= currentTextField.x + currentTextField.width && 
                y >= currentTextField.y && y <= currentTextField.y + currentTextField.height) 
            {
                //console.log('yesss');
                setIsTextBeingEdited(false); // Hide the text field
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            document.body.removeChild(eraserImg);
        };
    }, [canvasRef, thickness]);

    return eraser;
};