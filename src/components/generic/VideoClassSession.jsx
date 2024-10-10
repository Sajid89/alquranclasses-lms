import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { i } from 'mathjs';

import { ScreenShare } from '../../components';
import echo from '../../utils/echo';

const VideoClassSession = ({ 
    isWhiteboardOpen, isScreenShareOn, onScreenShareStop, isTeacherVideoOn, isTeacherAudioOn, 
    isStudentVideoOn, isStudentAudioOn, isRemoteScreenShareOn, setIsRemoteScreenShareOn,
    token, userType, classId, teacherId, studentId, teacherName, studentName,
    selectedSpeaker, selectedMic, selectedCamera,
    onTeacherJoin, onStudentJoin
}) => {
    const clientRef = useRef(null);
    const localVideoTrackRef = useRef(null);
    const localAudioTrackRef = useRef(null);

    const [personsInMeeting, setPersonsInMeeting] = useState(0);
    const [hasStudentJoined, setHasStudentJoined] = useState(false);
    const [hasTeacherJoined, setHasTeacherJoined] = useState(false);

    const [isVideoOn, setIsVideoOn] = useState(userType === 'teacher' ? isTeacherVideoOn : isStudentVideoOn);
    const [isAudioOn, setIsAudioOn] = useState(userType === 'teacher' ? isTeacherAudioOn : isStudentAudioOn);

    const [isRemoteTeacherVideoAvailable, setIsRemoteTeacherVideoAvailable] = useState(false);
    const [isRemoteStudentVideoAvailable, setIsRemoteStudentVideoAvailable] = useState(false);

    //const [isRemoteScreenShareOn, setIsRemoteScreenShareOn] = useState(false);
    const [speakingUser, setSpeakingUser] = useState(null);

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    // Initialize Agora client
    const initAgora = async () => {
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;

        client.on('user-published', async (user, mediaType) => {
            try {
                await client.subscribe(user, mediaType);
            
                let localIsRemoteScreenShareOn = false;
                console.log('Start screen share promise');
                
                const checkScreenShareStatus = (retries = 3, delay = 1000) => {
                    return new Promise((resolve) => {
                        // Set up the event listener once
                        const handleScreenShareStatus = (e) => {
                            if (e.status === 'started') {
                                localIsRemoteScreenShareOn = true;
                                setIsRemoteScreenShareOn(true);
                                console.log('Remote screen sharing started');
                                resolve();
                            } else if (e.status === 'stopped') {
                                localIsRemoteScreenShareOn = false;
                                setIsRemoteScreenShareOn(false);
                                console.log('Remote screen sharing stopped');
                                resolve();
                            }
                        };
                
                        echo.channel('screen-share').listen('.ScreenShareStatus', handleScreenShareStatus);
                
                        const attempt = (remainingRetries) => {
                            if (remainingRetries <= 0) {
                                console.log('No screen share event received, proceeding...');
                                resolve();
                                return;
                            }
                
                            setTimeout(() => {
                                console.log(`Retrying... (${remainingRetries} retries left)`);
                                attempt(remainingRetries - 1);
                            }, delay);
                        };
                
                        attempt(retries);
                    });
                };
                
                await checkScreenShareStatus();
                console.log('Screen share promise resolved');

                if (mediaType === 'video') {
                    console.log('Subscribing to remote video track');
                    const remoteVideoContainerId = localIsRemoteScreenShareOn ? 'remote-screen-share' : (userType === 'teacher' ? 'remote-student-video' : 'remote-teacher-video');
                    const remoteVideoContainer = document.getElementById(remoteVideoContainerId);

                    const remoteVideoTrack = user.videoTrack;
                    //const isScreenShare = remoteVideoTrack.trackMediaType === 'screen';

                    // if (isScreenShare) {
                    //     localIsRemoteScreenShareOn = true;
                    //     setIsRemoteScreenShareOn(true);
                    //     console.log('Remote screen sharing started');
                    //} else 
                    if (remoteVideoContainer) {
                        remoteVideoTrack.play(remoteVideoContainer);
                        if (userType === 'student' && !localIsRemoteScreenShareOn) {
                            setIsRemoteTeacherVideoAvailable(true);
                        } else if (userType === 'teacher' && !localIsRemoteScreenShareOn) {
                            setIsRemoteStudentVideoAvailable(true);
                        }

                        console.log('Subscribed to remote video track and playing it');
                    } else {
                        console.error('Remote video container not found');
                    }
                }

                if (mediaType === 'audio') {
                    await client.subscribe(user, mediaType);
                    const remoteAudioTrack = user.audioTrack;
                    remoteAudioTrack.play();
                    console.log('Subscribed to remote audio track and playing it');
                }
            } catch (error) {
                console.error('Failed to subscribe for remote video/audio track', error);
            }
        });

        client.on('user-joined', (user) => {
            setPersonsInMeeting(prevCount => prevCount + 1);
            if (user.uid == teacherId) {
                console.log('Teacher has joined the class');
                setHasTeacherJoined(true);
                onTeacherJoin(true);
            } 
            else if (user.uid == studentId) {
                console.log('Student has joined the class');
                setHasStudentJoined(true);
                onStudentJoin(true);
            }
        });

        client.on('user-left', (user) => {
            setPersonsInMeeting(prevCount => prevCount - 1);
            if (user.uid == teacherId) {
                console.log('Teacher has left the class');
                setHasTeacherJoined(false);
                onTeacherJoin(false);
            }
            else if (user.uid == studentId) {
                console.log('Student has left the class');
                setHasStudentJoined(false);
                onStudentJoin(false);
            }

            localStorage.removeItem('classJoined');
            console.log('User has left the class');
        });

        client.on('user-unpublished', (user, mediaType) => {
            if (mediaType === 'video') {
                const remoteVideoContainerId = userType === userType === 'teacher' ? 'remote-student-video' : 'remote-teacher-video';
                const remoteVideoContainer = document.getElementById(remoteVideoContainerId);
                const remoteVideoTrack = user.videoTrack;
                const isRemoteScreenShare = remoteVideoTrack.getType() === 'screen';

                if (isRemoteScreenShare) {
                    setIsRemoteScreenShareOn(false);
                    console.log('Remote screen sharing stopped');
                } else if (remoteVideoContainer) {
                    remoteVideoContainer.innerHTML = '';

                    if (userType === 'student') {
                        setIsRemoteTeacherVideoAvailable(false);
                    } else if (userType === 'teacher') {
                        setIsRemoteStudentVideoAvailable(false);
                    }
                } else {
                    console.error('Remote video container not found');
                }
            }

            if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack;
                if (remoteAudioTrack) {
                    remoteAudioTrack.stop();
                    console.log('Remote audio track stopped');
                }
            }
        });

        const channelName = classId;
        const uid = userType === 'teacher' ? teacherId : studentId;
        const appId = process.env.REACT_APP_AGORA_APP_ID;

        if (!appId) {
            console.error('Agora App ID is not set');
            return;
        }

        try {
            await client.join(appId, channelName, token, parseInt(uid));
            
            if (isVideoOn) {
                localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack({ cameraId: selectedCamera });
                const localVideoContainerId = userType === 'teacher' ? 'teacher-video' : 'student-video';
                const localVideoContainer = document.getElementById(localVideoContainerId);
                if (localVideoContainer) {
                    localVideoTrackRef.current.play(localVideoContainer);
                }
                await client.publish([localVideoTrackRef.current]);
            }
            
            if (isAudioOn) {
                localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMic });
                await client.publish([localAudioTrackRef.current]);
            }

            console.log('Successfully joined and published tracks.');
        } catch (error) {
            console.error('Failed to join Agora session:', error);
        }
    };

    // Publish or unpublish video track
    const publishOrUnpublishVideo = async (publish, videoContainerId) => {
        if (publish) {
            if (!localVideoTrackRef.current) {
                localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack({ cameraId: selectedCamera });
            }
            const localVideoContainer = document.getElementById(videoContainerId);
            if (localVideoContainer) {
                localVideoTrackRef.current.play(localVideoContainer);
                await clientRef.current.publish([localVideoTrackRef.current]);
                console.log('Video track published');
            } else {
                console.error('Local video container not found');
            }
        } else {
            if (localVideoTrackRef.current) {
                await clientRef.current.unpublish([localVideoTrackRef.current]);
                localVideoTrackRef.current.stop();
                localVideoTrackRef.current.close();
                localVideoTrackRef.current = null;
                console.log('Video track unpublished and stopped');
            }
        }
    };

    // Publish or unpublish audio track
    const publishOrUnpublishAudio = async (publish) => {
        if (publish) {
            if (!localAudioTrackRef.current) {
                localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMic });
            }
            await clientRef.current.publish([localAudioTrackRef.current]);
            console.log('Audio track published');

            // Enable audio volume indicator
            clientRef.current.enableAudioVolumeIndicator();

            clientRef.current.on('volume-indicator', volumes => {
                const threshold = 10; // Define a threshold for volume level
                const speakingUsers = volumes.filter(user => user.level > threshold);
                if (speakingUsers.length > 0) {
                    const maxVolumeUser = speakingUsers.reduce((prev, current) => (prev.level > current.level) ? prev : current);
                    setSpeakingUser(maxVolumeUser.uid);
                } else {
                    setSpeakingUser(null); // No user is speaking
                }
            });

            // Set the selected speaker
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                audioElement.setSinkId(selectedSpeaker);
            }
        } else {
            if (localAudioTrackRef.current) {
                await clientRef.current.unpublish([localAudioTrackRef.current]);
                localAudioTrackRef.current.stop();
                localAudioTrackRef.current.close();
                localAudioTrackRef.current = null;
                console.log('Audio track unpublished and stopped');
            }
        }
    };

    useEffect(() => {
        if (token) {
            initAgora();
        }

        return () => {
            localVideoTrackRef.current?.stop();
            localVideoTrackRef.current?.close();
            localAudioTrackRef.current?.stop();
            localAudioTrackRef.current?.close();
            clientRef.current?.leave();
        };
    }, [token, userType, classId, selectedSpeaker, selectedMic, selectedCamera]);

    useEffect(() => {
        setIsVideoOn(userType === 'teacher' ? isTeacherVideoOn : isStudentVideoOn);
    }, [isTeacherVideoOn, isStudentVideoOn]);

    useEffect(() => {
        const videoContainerId = userType === 'teacher' ? 'teacher-video' : 'student-video';
        publishOrUnpublishVideo(isVideoOn, videoContainerId);
    }, [isVideoOn]);

    useEffect(() => {
        setIsAudioOn(userType === 'teacher' ? isTeacherAudioOn : isStudentAudioOn);
    }, [isTeacherAudioOn, isStudentAudioOn]);

    useEffect(() => {
        publishOrUnpublishAudio(isAudioOn);
    }, [isAudioOn, speakingUser]);

    const handleScreenShareStart = () => {
        //console.log('Screen sharing has started');
    };

    const handleScreenShareStop = () => {
        onScreenShareStop();
        //console.log('Screen sharing has stopped');
    };

    useEffect(() => {
        console.log('Remote screen share:', isRemoteScreenShareOn);
    }, [isRemoteScreenShareOn]);

    return (
        <>
            {isScreenShareOn && (
                <ScreenShare
                    client={clientRef.current}
                    isScreenSharing={isScreenShareOn}
                    onScreenShareStart={handleScreenShareStart}
                    onScreenShareStop={handleScreenShareStop}
                    userType={userType}
                    teacherId={teacherId}
                    studentId={studentId}
                />
            )}

            <div className='w-full md:w-9/12 h-auto md:h-auto mb-4 md:mb-0
                rounded-md p-3'
                id='remote-screen-share'
                style={{ display: !isScreenShareOn && isRemoteScreenShareOn ? 'block' : 'none' }}
            ></div>
        
            <div className={`w-full ${isWhiteboardOpen || isScreenShareOn || isRemoteScreenShareOn ? 'md:w-3/12 flex flex-col md:ml-4' : 
                personsInMeeting < 1 ? 'w-full grid grid-cols-1' : 'w-full grid grid-cols-2'} gap-4 justify-around`}>
                
                {/* Teacher */}
                <div className={`${userType === 'student' && !hasTeacherJoined ? 'hidden' : 'block'}
                    ${isScreenShareOn || isRemoteScreenShareOn ? 'h-36 md:h-28 lg:h-48 mb-0' : isWhiteboardOpen ? 'h-40 md:h-44 lg:h-52 mb-0' : 'h-96 md:h-96 mb-4'} 
                    flex items-center justify-center bg-secondary-dark-bg text-xl md:1xl lg:text-2xl text-white rounded-md relative
                    ${speakingUser == teacherId ? 'border-2 border-blue-400' : ''}
                `}>
                    <div id="teacher-video" 
                        className={`${isTeacherVideoOn && userType === 'teacher' ? 
                            'block' : 'hidden'} w-full h-full`}>
                    </div>
                    <div id="remote-teacher-video" 
                        className={`${userType === 'student' && isRemoteTeacherVideoAvailable ? 'block' : 'hidden'} 
                            w-full h-full`}>
                    </div>
                    <div 
                        className={`text-center bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center
                            ${isTeacherVideoOn && userType === 'teacher' 
                            || (userType === 'student' && isRemoteTeacherVideoAvailable) ? 
                            'hidden' : 'block'}`}>
                        <span className='capitalize text-5xl'>{teacherName.charAt(0)}</span>
                    </div>

                    <div className='absolute bottom-0 left-0 p-4'>
                        <p className='text-sm'>{capitalizeWords(teacherName)}</p>
                    </div>
                </div>

                {/* Student */}
                <div className={`${userType === 'teacher' && !hasStudentJoined ? 'hidden' : 'block'}
                    ${isScreenShareOn || isRemoteScreenShareOn ? 'h-36 md:h-28 lg:h-48 mb-0' : isWhiteboardOpen ? 'h-40 md:h-44 lg:h-52 mb-0' : 'h-96 md:h-96 mb-4'} 
                    flex items-center justify-center bg-secondary-dark-bg text-xl md:1xl lg:text-2xl text-white rounded-md relative
                    ${speakingUser == studentId ? 'border-2 border-blue-400' : ''}
                `}>
                    <div id="student-video" 
                        className={`${isStudentVideoOn && userType === 'student' ? 
                            'block' : 'hidden'} w-full h-full rounded-md`}>
                    </div>
                    <div id="remote-student-video" 
                        className={`${userType === 'teacher' && isRemoteStudentVideoAvailable ? 'block' : 'hidden'} 
                            w-full h-full`}>
                    </div>
                    <div 
                        className={`text-center bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center
                            ${isStudentVideoOn && userType === 'student' 
                            || (userType === 'teacher' && isRemoteStudentVideoAvailable) ? 
                            'hidden' : 'block'}`}>
                        <span className='capitalize text-5xl'>{studentName.charAt(0)}</span>
                    </div>
                    <div className='absolute bottom-0 left-0 p-4'>
                        <p className='text-sm'>{capitalizeWords(studentName)}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoClassSession;
