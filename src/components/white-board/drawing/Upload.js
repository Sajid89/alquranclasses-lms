import { useEffect, useContext, useRef } from 'react';
import { UploadFileContext } from '../../../contexts/UploadFileContext';

export const useFileUpload = (canvasRef) => {
    const { fileData, onFileChange } = useContext(UploadFileContext);
    const imagesRef = useRef([]);

    useEffect(() => {
        if (fileData && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Create a separate canvas for the image
            let imageCanvas = document.createElement('canvas');
            const imageContext = imageCanvas.getContext('2d');

            let imgWidth = canvas.width;
            let imgHeight = canvas.height;
            let dragging = false;
            let startX, startY, startWidth, startHeight;

            let draggingImage = false;
            let imageX = 0, imageY = 0;

            let image = new Image();
            image.onload = () => {
                imgWidth = image.naturalWidth;
                imgHeight = image.naturalHeight;

                // If the image is larger than the canvas, scale it down
                if (imgWidth > canvas.width/2 || imgHeight > canvas.height/2) {
                    const scale = Math.min((canvas.width/2) / imgWidth, (canvas.height/2) / imgHeight);
                    imgWidth *= scale;
                    imgHeight *= scale;
                }

                // Resize the image canvas to match the image size
                imageCanvas.width = imgWidth;
                imageCanvas.height = imgHeight;

                // Draw the image on the image canvas
                imageContext.drawImage(image, 0, 0, imgWidth, imgHeight);

                // Draw the image canvas on the main canvas
                context.drawImage(imageCanvas, imageX, imageY);

                // Add the new image to the images array
                imagesRef.current.push({ image: imageCanvas, x: imageX, y: imageY, width: imgWidth, height: imgHeight });
            };
            image.src = fileData;

            const redrawImages = () => {
                context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

                // Redraw all images
                for (const { image, x, y, width, height } of imagesRef.current) {
                    context.drawImage(image, x, y, width, height);
                }
            };

            const onMouseDown = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const handleSize = 10;

                // Check if the mouse is over the resize handle of any image
                for (const img of imagesRef.current) {
                    if (x > img.x + img.width - handleSize && y > img.y + img.height - handleSize) {
                        dragging = true;
                        startX = x;
                        startY = y;
                        startWidth = img.width;
                        startHeight = img.height;

                        // Set the currently dragged image
                        imageCanvas = img.image;
                        imgWidth = img.width;
                        imgHeight = img.height;
                        imageX = img.x;
                        imageY = img.y;
                        image = img.image;
                        return;
                    }
                }

                // Check if the mouse is over any image
                for (const img of imagesRef.current) {
                    if (x > img.x && x < img.x + img.width && y > img.y && y < img.y + img.height) {
                        draggingImage = true;
                        startX = x - img.x;
                        startY = y - img.y;

                        // Set the currently dragged image
                        imageCanvas = img.image;
                        imgWidth = img.width;
                        imgHeight = img.height;
                        imageX = img.x;
                        imageY = img.y;
                        image = img.image;
                        return;
                    }
                }
            };

            const onMouseMove = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (dragging) {
                    imgWidth = startWidth + (x - startX);
                    imgHeight = startHeight + (y - startY);

                    // Update the width and height of the currently resized image
                    const imageIndex = imagesRef.current.findIndex(img => img.image === imageCanvas);
                    if (imageIndex !== -1) {
                        imagesRef.current[imageIndex].width = imgWidth;
                        imagesRef.current[imageIndex].height = imgHeight;
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
                    redrawImages();
                    context.drawImage(image, imageX, imageY, imgWidth, imgHeight);

                    // Draw border
                    context.strokeStyle = 'gray';
                    context.lineWidth = 1;
                    context.strokeRect(imageX, imageY, imgWidth, imgHeight);

                    // Draw resize handles
                    context.fillStyle = 'gray';
                    context.fillRect(imageX + imgWidth - 10, imageY + imgHeight - 10, 10, 10); // Bottom-right handle
                    
                    // Draw the currently dragged image
                    context.drawImage(image, imageX, imageY, imgWidth, imgHeight);
                } else if (draggingImage) {
                    imageX = x - startX;
                    imageY = y - startY;

                    // Update the position of the currently dragged image
                    const imageIndex = imagesRef.current.findIndex(img => img.image === imageCanvas);
                    if (imageIndex !== -1) {
                        imagesRef.current[imageIndex].x = imageX;
                        imagesRef.current[imageIndex].y = imageY;
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
                    redrawImages();
                    context.drawImage(image, imageX, imageY, imgWidth, imgHeight);

                    // Draw border
                    context.strokeStyle = 'gray';
                    context.lineWidth = 1;
                    context.strokeRect(imageX, imageY, imgWidth, imgHeight);

                    // Draw resize handles
                    context.fillStyle = 'gray';
                    context.fillRect(imageX + imgWidth - 10, imageY + imgHeight - 10, 10, 10); // Bottom-right handle
                    
                    // Draw the currently dragged image
                    context.drawImage(image, imageX, imageY, imgWidth, imgHeight);
                }
            };

            const onMouseUp = () => {
                dragging = false;
                draggingImage = false;
            };

            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);

            return () => {
                canvas.removeEventListener('mousedown', onMouseDown);
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('mouseup', onMouseUp);
            };
        }
    }, [fileData, canvasRef]);

    return { onFileChange, imagesRef };
};