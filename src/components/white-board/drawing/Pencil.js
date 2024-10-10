import { useEffect } from 'react';
import penIcon from '../../../data/icons/pen-icon.png';

export const usePencil = (canvasRef, color, thickness) => {
    return () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let drawing = false;
        
        // Create eraser icon
        const penImg = document.createElement('img');
        penImg.src = penIcon;
        penImg.className = 'eraser-icon';
        penImg.style.position = 'absolute';
        penImg.style.display = 'none';
        penImg.style.width = '25px';
        penImg.style.height = '25px';
        penImg.style.pointerEvents = 'none';
        document.body.appendChild(penImg);

        const startDrawing = (event) => {
            drawing = true;
            penImg.style.display = 'block';
            canvas.style.cursor = 'none';
            draw(event);
        };

        const stopDrawing = () => {
            drawing = false;
            penImg.style.display = 'none';
            canvas.style.cursor = 'auto'; 
            context.beginPath();
        };

        const draw = (event) => {
            if (!drawing) return;
            context.lineWidth = thickness;
            context.lineCap = 'round';
            context.strokeStyle = color;

            // Calculate the mouse position relative to the canvas
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);

            penImg.style.left = `${event.clientX - penImg.width / 5}px`;
            penImg.style.top = `${event.clientY - penImg.height / 1}px`;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mousemove', draw);
        };
    };
};