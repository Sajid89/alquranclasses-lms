export const useText = (canvasRef, color, thickness, textInput, setTextField) => {
    return () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let drawing = false;
        let x, y, width, height; // Define these variables outside of the startDrawing function

        const startDrawing = (event) => {
            //if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
            //context.fillStyle = color;
            //context.font = `${thickness * 3}px Arial`;
            //context.fillText(textInput.current.value, x, y);

            // Calculate the width and height of the text
            const metrics = context.measureText('gM');
            height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            width = metrics.width;

            // Update the textField state
            setTextField({ x, y, width, height, text: textInput.current.value });
        };

        const stopDrawing = () => {
            drawing = false;
        };

        // Removed the mousedown event listener
        canvas.addEventListener('mousemove', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        return () => {
            canvas.removeEventListener('mousemove', startDrawing);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        };
    };
};