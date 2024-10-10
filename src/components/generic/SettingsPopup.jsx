import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const SettingsPopup = ({ 
    onClose, selectedSpeaker, setSelectedSpeaker, selectedMic, 
    setSelectedMic, selectedCamera, setSelectedCamera 
}) => {
    const popupRef = useRef(null);
    const [microphones, setMicrophones] = useState([]);
    const [speakers, setSpeakers] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);

    useEffect(() => {
        // Fetch available microphones and speakers using AgoraRTC
        const fetchDevices = async () => {
            const devices = await AgoraRTC.getDevices();
            setMicrophones(devices.filter(device => device.kind === 'audioinput'));
            setSpeakers(devices.filter(device => device.kind === 'audiooutput'));
            setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
        };

        fetchDevices();
    }, []);

    const handleTestAudio = async () => {
        try {
            const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
                microphoneId: selectedMic,
            });

            localAudioTrack.play();

            setTimeout(() => {
                localAudioTrack.stop();
                localAudioTrack.close();
            }, 5000);
        } catch (error) {
            console.error('Error testing audio:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    

    return (
        <div ref={popupRef} className="absolute bottom-12 right--4 
            bg-white p-4 shadow-lg rounded-md w-80 md:w-96">
            <h3 className="text-lg font-semibold mb-2">Audio Settings</h3>
            <div className="mb-4">
                <label htmlFor="microphone-select" className="block mb-1">Select Microphone:</label>
                <select
                    id="microphone-select"
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="w-full md:w-72 p-2 border rounded"
                >
                    {microphones.map((mic) => (
                        <option key={mic.deviceId} value={mic.deviceId}>{mic.label}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="speaker-select" className="block mb-1">Select Speaker:</label>
                <div className="flex items-center">
                    <select
                        id="speaker-select"
                        value={selectedSpeaker}
                        onChange={(e) => setSelectedSpeaker(e.target.value)}
                        className="w-full md:w-72 p-2 border rounded"
                    >
                        {speakers.map((speaker) => (
                            <option key={speaker.deviceId} value={speaker.deviceId}>{speaker.label}</option>
                        ))}
                    </select>
                    <button className="btn-secondary ml-2 px-4 py-2 hover:bg-blue-100 hover:rounded-full" 
                        onClick={handleTestAudio}>Test</button>
                </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Video Settings</h3>
            <div className="mb-4">
                <label htmlFor="video-select" className="block mb-1">Select Video Device:</label>
                <div className="flex items-center">
                    <select
                        id="video-select"
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full md:w-72 p-2 border rounded"
                    >
                        {videoDevices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SettingsPopup;