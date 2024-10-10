import { useEffect } from 'react';

export const useRectangle = (canvasRef, color, thickness) => {
    return () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let drawing = false;
        let startX = 0;
        let startY = 0;
        let imageData = null;

        const startDrawing = (event) => {
            drawing = true;
            const rect = canvas.getBoundingClientRect();
            startX = event.clientX - rect.left;
            startY = event.clientY - rect.top;
            imageData = context.getImageData(0, 0, canvas.width, canvas.height); // Store the image data
        };

        const stopDrawing = () => {
            drawing = false;
            context.beginPath();
        };

        const draw = (event) => {
            if (!drawing) return;
            context.lineWidth = thickness;
            context.strokeStyle = color;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.putImageData(imageData, 0, 0); // Restore the image data
            context.beginPath();
            context.rect(startX, startY, x - startX, y - startY);
            context.stroke();
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