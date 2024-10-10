import { useEffect } from 'react';

export const useReset = (tool, canvasRef, textField, setIsTextBeingEdited, setTextField, imagesRef) => {
    const reset = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Clear the images array
        imagesRef.current = [];

        if (textField) {
            setIsTextBeingEdited(false);
            //setTextField(prevState => ({ ...prevState, text: '' }));
        }
    };

    useEffect(() => {
        if (tool !== 'reset' && tool !== 'Upload') {
            return;
        }

        return () => {
            reset();
        };
    }, [tool]);

    return reset;
};