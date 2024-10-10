import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import echo from '../../utils/echo';
import api from '../../utils/api';

const ScreenShare = ({ 
    client, isScreenSharing, 
    onScreenShareStart, onScreenShareStop,
    userType, teacherId, studentId 
}) => {
    const screenTrackRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const userId = userType === 'teacher' ? teacherId : studentId;

    useEffect(() => {
        const startScreenShare = async () => {
            if (!isScreenSharing) return;

            try {
                // Track configuration
                const trackConfig = {
                    encoderConfig: '1080p_2',
                    withAudio: false
                };
        
                // Create the screen track
                const screenTrack = await AgoraRTC.createScreenVideoTrack(trackConfig);
                screenTrackRef.current = screenTrack;
                await client.publish(screenTrack);

                // Broadcast a message indicating screen share started
                await api.post('/screen-share/start', { user_id: userId });

                // Call the callback to notify parent component
                onScreenShareStart();
                
                // Attach the screen track to the video element
                if (videoRef.current) {
                    screenTrack.play(videoRef.current);
                }

                // Listen for the track-ended event
                screenTrack.on('track-ended', () => {
                    console.log('Screen track ended, stopping screen share');
                    stopScreenShare();
                });
            } catch (error) {
                if (error.message && error.message.includes('NotAllowedError')) {
                    onScreenShareStop();
                    console.log('Screen sharing was cancelled by the user or permission was denied');
                } else {
                    console.error('Failed to start screen sharing', error);
                }
            }
        };

        const stopScreenShare = async () => {
            if (screenTrackRef.current) {
                // Unpublish the screen track
                await client.unpublish(screenTrackRef.current);
        
                // Stop and close the screen track
                screenTrackRef.current.stop();
                screenTrackRef.current.close();
                screenTrackRef.current = null;
        
                // Broadcast a message indicating screen share stopped
                await api.post('/screen-share/stop', { user_id: userId });
        
                // Notify parent component
                onScreenShareStop();

                // Clear the canvas
                clearCanvas();
        
                console.log('Screen sharing stopped');
            }
        };

        console.log('Screen sharing:', isScreenSharing);
        if (isScreenSharing) {
            startScreenShare();
        } else {
            stopScreenShare();
        }

        return () => {
            stopScreenShare();
        };

    }, [isScreenSharing]);

    useEffect(() => {
        const updateCanvasDimensions = () => {
            if (canvasRef.current && videoRef.current) {
                const canvas = canvasRef.current;
                canvas.width = videoRef.current.clientWidth;
                canvas.height = videoRef.current.clientHeight;
                console.log('Updated canvas dimensions:', canvas.width, canvas.height);
            }
        };

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            setContext(ctx);
            console.log('Canvas context initialized:', ctx);
            updateCanvasDimensions();
        } else {
            console.error('Canvas reference is null');
        }

        window.addEventListener('resize', updateCanvasDimensions);
        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
        };
    }, []);

    const getMousePos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10 // Adjust the y-coordinate to align with the top tip of the mouse pointer
        };
    };

    const handleMouseDown = (event) => {
        setIsDrawing(true);
        const pos = getMousePos(canvasRef.current, event);
        context.moveTo(pos.x, pos.y);
        console.log('Mouse down at:', pos.x, pos.y);
        broadcastDrawingEvent('mousedown', pos);
    };

    const handleMouseUp = (event) => {
        setIsDrawing(false);
        if (context) {
            context.beginPath();
        }
        const pos = getMousePos(canvasRef.current, event);
        console.log('Mouse up at:', pos.x, pos.y);
        broadcastDrawingEvent('mouseup', pos);
    };

    const handleMouseMove = (event) => {
        if (!isDrawing || !context) return;

        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'red';

        const pos = getMousePos(canvasRef.current, event);
        context.lineTo(pos.x, pos.y);
        context.stroke();
        context.beginPath();
        context.moveTo(pos.x, pos.y);

        console.log('Drawing at:', pos.x, pos.y);
        
        // broadcast the drawing event
        broadcastDrawingEvent('mousemove', pos);
    };

    const broadcastDrawingEvent = (type, pos) => {
        api.post('/drawing/start', {
            type,
            pos,
            user_id: userId
        });
    };

    const clearCanvas = () => {
        if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            console.log('Canvas cleared');
        } else {
            console.error('Context is null, cannot clear canvas');
        }
    };

    useEffect(() => {
        console.log('Listening for drawing events');
        const channel = echo.channel('drawing-share');
        const listener = (data) => {
            if (data.user_id !== userId) {
                handleRemoteDrawingEvent(data);
            }
        };

        channel.listen('.DrawingShareEvent', listener);

        return () => {
            channel.stopListening('.DrawingShareEvent', listener);
        };
    }, [userId]);

    const handleRemoteDrawingEvent = (data) => {
        const { type, pos } = data;

        if (type === 'mousedown') {
            context.moveTo(pos.x, pos.y);
        } else if (type === 'mouseup') {
            context.beginPath();
        } else if (type === 'mousemove') {
            context.lineWidth = 5;
            context.lineCap = 'round';
            context.strokeStyle = 'red';
            context.lineTo(pos.x, pos.y);
            context.stroke();
            context.beginPath();
            context.moveTo(pos.x, pos.y);
        }

        console.log(`Remote drawing event: ${type} at (${pos.x}, ${pos.y})`);
    };

    return (
        <div className='relative w-full md:w-9/12 h-auto md:h-auto mb-4 
            md:mb-0 rounded-md'>
            <video ref={videoRef} className='w-full rounded-md' autoPlay />
            <canvas 
                ref={canvasRef} 
                className='absolute top-0 left-0 w-full h-full' 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
            <button onClick={clearCanvas} className='absolute top-0 right-0 m-2 p-2 bg-white rounded'>Clear</button>
        </div>
    );
};

export default ScreenShare;