import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { useFastboard, Fastboard } from "@netless/fastboard-react";
import { createRoot } from "react-dom/client";

import { AiOutlineAudio, AiOutlineVideoCamera } from 'react-icons/ai';
import { FaMicrophoneSlash, FaVideoSlash } from 'react-icons/fa';
import { MdPresentToAll, MdBorderColor, MdSettings, MdCallEnd } from 'react-icons/md';

import { CustomButton, Toolbar, Whiteboard, 
    VideoClassSession, SettingsPopup } from '../components';
import { UploadFileContext } from '../contexts/UploadFileContext';
import { 
    fetchAgoraTokens, 
    fetchCreateAttendanceOnJoin,
    fetchCreateAttendanceOnLeave
} from '../services/agoraService';

import echo from '../utils/echo';
import api from '../utils/api';

function ClassRoom() {
    const { TeacherName, StudentName } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const classID = searchParams.get('classId');
    const classType = searchParams.get('classType');
    const studentID = searchParams.get('studentId');
    const teacherID = searchParams.get('teacherId');
    
    const userType = location.pathname.includes('/teacher/') ? 'teacher' : 'student';
    const studentName = userType === 'teacher' ? searchParams.get('studentName') : StudentName;
    const teacherName = userType === 'teacher' ? TeacherName : searchParams.get('teacherName');

    const [currentTime, setCurrentTime] = useState('');

    // Agora audio and video states
    const [isTeacherVideoOn, setTeacherVideoOn] = useState(false);
    const [isTeacherAudioOn, setTeacherAudioOn] = useState(false);
    const [isStudentAudioOn, setStudentAudioOn] = useState(false);
    const [isStudentVideoOn, setStudentVideoOn] = useState(false);
    
    const [isWhiteboardOpen, setWhiteboardOpen] = useState(null);
    
    const [isScreenShareOn, setScreenShareOn] = useState(false);
    const [isSettingOpen, setSettingOpen] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(isSettingOpen);
    const [selectedSpeaker, setSelectedSpeaker] = useState('');
    const [selectedMic, setSelectedMic] = useState('');
    const [selectedCamera, setSelectedCamera] = useState('');
    const [isRemoteScreenShareOn, setIsRemoteScreenShareOn] = useState(false);

    const [hasTeacherJoined, setHasTeacherJoined] = useState(false);
    const [hasStudentJoined, setHasStudentJoined] = useState(false);

    const handleTeacherJoin = (status) => {
        setHasTeacherJoined(status);
    };

    const handleStudentJoin = (status) => {
        setHasStudentJoined(status);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // whitebaord tools
    const [tool, setTool] = useState('pencil');
    const [thickness, setThickness] = useState(3);
    const [color, setColor] = useState('black');
    const [inputSize, setInputSize] = useState(4);
    const [fileData, setFileData] = useState(null);

    const [tokens, setTokens] = useState({ student_token: '', teacher_token: '' });
    const userID = userType === 'teacher' ? teacherID : studentID;
    
    useEffect(() => {
        const getTokens = async () => {
            try {
                const token = await fetchAgoraTokens(classID, userID);
                setTokens(token);
            } catch (error) {
                console.error('Failed to fetch tokens:', error);
            }
        };

        const createAttendance = async () => {
            try {
                await fetchCreateAttendanceOnJoin(classID, classType, userID);
                localStorage.setItem('classJoined', 'true');
            } catch (error) {
                console.error('Failed to create attendance:', error);
            }
        };

        getTokens();
        const hasJoinedClass = localStorage.getItem('classJoined');
        console.log('hasJoinedClass:', hasJoinedClass);

        if (!hasJoinedClass) {
            createAttendance();
        }
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFileData(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const formatUserName = (str) => {
        if (str.includes('-')) {
            return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        }
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleScreenShareStop = () => {
        setScreenShareOn(false);
    };

    const navigate = useNavigate();

    const leaveClass = () => {

        const createAttendance = async () => {
            try {
                await fetchCreateAttendanceOnLeave(classID, classType, userID);
                localStorage.removeItem('classJoined');
            } catch (error) {
                console.error('Failed to create attendance:', error);
            }
        };

        createAttendance();
       
        navigate('/');
    };

    // Whiteboard remote share event listener
    console.log('Whiteboard share promise');
    const checkWhiteboardShareStatus = (retries = 3, delay = 1000) => {
        return new Promise((resolve) => {
            // Set up the event listener once
            const handleWhiteboardShareStatus = (e) => {
                if (e.status === 'started') {
                    setWhiteboardOpen(true);
                    console.log('Remote whiteboard sharing started');
                    resolve();
                } else if (e.status === 'stopped') {
                    setWhiteboardOpen(false);
                    console.log('Remote whiteboard sharing stopped');
                    resolve();
                }
            };
    
            echo.channel('whiteboard-share').listen('.WhiteboardShareStatus', handleWhiteboardShareStatus);
    
            const attempt = (remainingRetries) => {
                if (remainingRetries <= 0) {
                    console.log('No whiteboard share event received, proceeding...');
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
    
    useEffect(() => {
        const init = async () => {
            await checkWhiteboardShareStatus();
            console.log('Whiteboard share promise resolved');
        };

        init();
    }, []);
    
    // Send API request to start/stop remote whiteboard sharing
    useEffect(() => {
        if (isWhiteboardOpen !== null) {
            const handleWhiteboardToggle = () => {
                let apiURL = '';
                if (isWhiteboardOpen) {
                    apiURL = '/whiteboard-share/start';
                } else {
                    apiURL = '/whiteboard-share/stop';
                }
                api.post(apiURL, {
                    user_id: userID,
                });
            };

            handleWhiteboardToggle();
        }
    }, [isWhiteboardOpen]);

    useEffect(() => {
        console.log('Student, teacher joined:', hasStudentJoined, hasTeacherJoined);
    }, [hasStudentJoined, hasTeacherJoined]);

    return (
        <div className='pl-6 pr-6 bg-main-dark-bg min-h-screen'>
            <div className='pt-6'>
                <h3 className='font-semibold text-xl text-white mb-4'>
                    Class Room
                </h3>
            </div>

            <div className='flex flex-col md:flex-row lg:flex-row mt-6'>
                {/* Whiteboard Area */}
                {isWhiteboardOpen && (
                    <div className={`w-full md:w-9/12 h-56 
                        ${hasTeacherJoined || hasStudentJoined ? 
                        'md:h-auto' : 'md:h-90'} 
                        mb-4 md:mb-0 rounded-md overflow-auto min-h-0`}
                    >
                        <div className="relative flex items-center h-full">
                            <UploadFileContext.Provider value={{ fileData, onFileChange }}>
                                <Toolbar 
                                    onToolChange={setTool} 
                                    onThicknessChange={setThickness} 
                                    onColorChange={setColor} 
                                    inputSize={inputSize} 
                                    onInputSizeChange={setInputSize} // Pass the setInputSize function
                                />
                                <Whiteboard 
                                    tool={tool} 
                                    thickness={thickness} 
                                    color={color} 
                                    inputSize={inputSize} // Pass the inputSize state
                                    className="flex-grow max-w-full max-h-full" 
                                />
                            </UploadFileContext.Provider>
                        </div>
                    </div>
                )}

                {/* Video Area */}
                <VideoClassSession 
                    isWhiteboardOpen={isWhiteboardOpen}
                    isScreenShareOn={isScreenShareOn}
                    onScreenShareStop={handleScreenShareStop}
                    isTeacherVideoOn={isTeacherVideoOn}
                    isTeacherAudioOn={isTeacherAudioOn}
                    isStudentVideoOn={isStudentVideoOn}
                    isStudentAudioOn={isStudentAudioOn}
                    isRemoteScreenShareOn={isRemoteScreenShareOn}
                    setIsRemoteScreenShareOn={setIsRemoteScreenShareOn}
                    token={tokens.token}
                    userType = {userType}
                    classId = {classID}
                    teacherId = {teacherID}
                    studentId = {studentID}
                    teacherName = {formatUserName(teacherName)}
                    studentName = {formatUserName(studentName)}
                    selectedSpeaker={selectedSpeaker}
                    selectedMic={selectedMic}
                    selectedCamera={selectedCamera}
                    onTeacherJoin={handleTeacherJoin} 
                    onStudentJoin={handleStudentJoin}
                />
            </div>

            {/* Control Panel */}
            <div className='flex justify-between items-center w-full mt-4 relative'>
                <div className='hidden md:flex items-center mt-4 md:mt-0 text-white text-lg'>
                    <span className='mr-3'>{currentTime}</span> 
                    <div className='w-px h-4 bg-current inline-block'></div>
                    <span className='ml-3'>{classType.charAt(0).toUpperCase() + classType.slice(1)}</span>
                </div>
                <div className='absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center'>
                    <div className='flex md:flex-row gap-4 items-center justify-center required'>
                        {
                            userType === 'student' ? (
                                <>
                                    <CustomButton 
                                        onClick={() => setStudentAudioOn(!isStudentAudioOn)} 
                                        customClass={`flex flex-col items-center p-0 text-gray-400 
                                            relative text-white py-2 px-2 rounded-full ${isStudentAudioOn ? 'bg-secondary-dark-bg' : 
                                            'bg-red-600'}`}
                                        zeroPadding={true}
                                    >
                                        {isStudentAudioOn ? (
                                            <AiOutlineAudio size={20} />
                                        ) : (
                                            <FaMicrophoneSlash size={20} />
                                        )}
                                    </CustomButton>
                                    <CustomButton 
                                        onClick={() => setStudentVideoOn(!isStudentVideoOn)} 
                                        customClass={`flex flex-col items-center p-0 text-gray-400 
                                            relative text-white py-2 px-2 rounded-full ${isStudentVideoOn ? 'bg-secondary-dark-bg' : 
                                            'bg-red-600'}`}
                                        zeroPadding={true}
                                    >
                                        {isStudentVideoOn ? (
                                            <AiOutlineVideoCamera size={20} />
                                        ) : (
                                            <FaVideoSlash size={20} />
                                        )}
                                    </CustomButton>
                                </>
                            ) : (
                                <>
                                    <CustomButton 
                                        onClick={() => setTeacherAudioOn(!isTeacherAudioOn)} 
                                        customClass={`flex flex-col items-center p-0 text-gray-400 
                                            relative text-white py-2 px-2 rounded-full ${isTeacherAudioOn ? 'bg-secondary-dark-bg' : 
                                            'bg-red-600'}`}
                                        zeroPadding={true}
                                    >
                                        {isTeacherAudioOn ? (
                                            <AiOutlineAudio size={20} />
                                        ) : (
                                            <FaMicrophoneSlash size={20} />
                                        )}
                                    </CustomButton>
                                    <CustomButton 
                                        onClick={() => setTeacherVideoOn(!isTeacherVideoOn)} 
                                        customClass={`flex flex-col items-center p-0 text-gray-400 
                                            relative text-white py-2 px-2 rounded-full ${isTeacherVideoOn ? 'bg-secondary-dark-bg' : 
                                            'bg-red-600'}`}
                                        zeroPadding={true}
                                    >
                                        {isTeacherVideoOn ? (
                                            <AiOutlineVideoCamera size={20} />
                                        ) : (
                                            <FaVideoSlash size={20} />
                                        )}
                                    </CustomButton>
                                </>
                            )
                        }
                        <CustomButton 
                            onClick={() => {
                                if (!isRemoteScreenShareOn) {
                                    setScreenShareOn(!isScreenShareOn);
                                }
                            }} 
                            customClass={`flex flex-col items-center py-2 px-2 
                                rounded-full ${isScreenShareOn ? 'bg-light-blue text-black' : 'bg-secondary-dark-bg text-white'} 
                                ${isWhiteboardOpen || isRemoteScreenShareOn ? 'opacity-50 cursor-not-allowed' : ''}`}
                            zeroPadding={true}
                            disabled={isRemoteScreenShareOn}
                        >
                            <MdPresentToAll size={24} />
                        </CustomButton>
                        <CustomButton
                            onClick={() => {
                                if (!isScreenShareOn || userType == 'student') {
                                    setWhiteboardOpen(!isWhiteboardOpen);
                                }
                            }}
                            customClass={`flex flex-col items-center py-2 px-2 
                                rounded-full ${isWhiteboardOpen ? 'bg-light-blue text-black' : 'bg-secondary-dark-bg text-white'} 
                                ${isScreenShareOn || userType === 'student' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            zeroPadding={true}
                        >
                            <MdBorderColor size={20} />
                        </CustomButton>
                        <CustomButton 
                            onClick={() => setSettingOpen(!isSettingOpen)} 
                            customClass={`flex flex-col items-center py-2 px-2 
                                rounded-full ${isSettingOpen ? 'bg-light-blue text-black' : 
                                'bg-secondary-dark-bg text-white'}`}
                            zeroPadding={true}
                        >
                            <MdSettings size={20} />
                        </CustomButton>
                        {isSettingOpen && 
                            <SettingsPopup 
                                onClose={handleClosePopup}
                                selectedSpeaker={selectedSpeaker}
                                setSelectedSpeaker={setSelectedSpeaker}
                                selectedMic={selectedMic}
                                setSelectedMic={setSelectedMic}
                                selectedCamera={selectedCamera}
                                setSelectedCamera={setSelectedCamera}
                            />
                        }
                        
                        <CustomButton 
                            onClick={leaveClass}
                            customClass='flex flex-col items-center py-2 px-4 
                                rounded-full bg-red-600 text-white'
                            zeroPadding={true}
                        >
                            <MdCallEnd size={20} />
                        </CustomButton>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ClassRoom;