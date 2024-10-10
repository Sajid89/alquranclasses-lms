import React, { useState, useEffect, useMemo, useRef } from 'react';
import Pusher from 'pusher-js';
import api from '../../../utils/api';
import { API_BASE_URL } from '../../../config';

import { useSelector } from 'react-redux';

import { ChatUserList, ChatComponent, Spinner } from '../../../components';
import avatar from '../../../data/placedolder_avatar.jpg';
import noMessages from '../../../data/images/no_messages.png';
import { USER_TYPES } from '../../../data/TextConstants';
import { toast } from 'react-toastify';

const Chat = () => {
    const profile = useSelector(state => state.auth.profile);
    const teacher = { 
        id: profile.id, 
        name: profile.name, 
        profile_photo_url: profile.profile_photo_path ? profile.profile_photo_path : avatar
    };

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/get-students-with-unread-messages-count');
                setStudents(response.data.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const [messages, setMessages] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [chat, setChat] = useState(messages);
    const disconnectionAttempts = useRef(0);
    const isFirstMount = useRef(true);

    // Fetch all messages on component mount
    useEffect(() => {
        const getMessages = async () => {
            try {
                const data = {
                    user_type: USER_TYPES.TEACHER,
                    from: teacher.id,
                    to: selectedStudent ? selectedStudent.id : students[0]?.id
                };
        
                const response = await api.post('/get-messages', data);
                setChat(response.data.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
    
        if (!loading) {
            getMessages();
        }
    }, [loading, selectedStudent]);

    // Pusher setup
    useEffect(() => {
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            forceTLS: true,
            authEndpoint: `${API_BASE_URL}/pusher/auth`,
        });

        const participantId = selectedStudent ? selectedStudent.id : students[0]?.id;
        const ids = [parseInt(teacher.id, 10), parseInt(participantId, 10)].sort((a, b) => a - b);
        const channelName = `private-chat-${ids[0]}-${ids[1]}`;
        const channel = pusher.subscribe(channelName);

        channel.bind('new-message', (data) => {
            setChat((prevChat) => [...prevChat, data]);
            console.log('New message:', data);
        });

        channel.bind('pusher:subscription_error', function(status) {
            console.error('Subscription error:', status);
        });
        
        channel.bind('pusher:subscription_succeeded', function() {
            console.log('Subscription succeeded');
        });

        pusher.connection.bind('connected', () => {
            if (!isFirstMount.current) {
                console.log("Connection re-established. Fetching latest messages and verifying queued messages...");
                fetchLatestMessage();
                disconnectionAttempts.current = 0;
            }
        });

        pusher.connection.bind('disconnected', () => {
            disconnectionAttempts.current += 1;
            console.log(`Connection lost. Attempt #${disconnectionAttempts.current}. Attempting to reconnect...`);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, []);

    // Fetch latest message
    async function fetchLatestMessage() {
        try {
            const data = {
                user_type: USER_TYPES.TEACHER,
                from: teacher.id,
                to: selectedStudent.id
            };
    
            const response = await api.post('/get-latest-message', data);
            setChat((prevChat) => [...prevChat, response.data.data]);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    // Function to handle student selection
    const handleStudentSelect = (studentId) => {
        const student = students.find(student => student.id === studentId);
        //console.log(`Found student:`, student); // Debugging log
        if (!student) {
            console.error(`Student with ID ${studentId} not found.`);
            return;
        }
        setSelectedStudent(student);

        const filteredMessages = messages.filter(message => 
            (message.senderId === studentId && message.recieverId === teacher.id) ||
            (message.senderId === teacher.id && message.recieverId === studentId)
        );
        setChat(filteredMessages);
    }

    const handleAttachFile = (event) => {
        const file = event.target.files[0];
    };

    const handleSendMessage = async (message) => {
        const data = {
            sender: USER_TYPES.TEACHER,
            from: teacher.id,
            to: selectedStudent.id,
            message: message,
            type: 'teacher-student'
        };

        try {
            const response = await api.post('/send-message', data);
            //setMessages((prevMessages) => [...prevMessages, response.data.data]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <>
            {loading ? (
                <Spinner loading={loading} text="Loading chat..." />
            ) : (
                <div className="mt-20 md:mt-4 mb-4">
                    <div className="pl-6 pr-6">
                        <h3 className="font-semibold text-xl mb-4">Messaging</h3>
                    </div>
                    <div className="flex flex-col md:flex-row pl-6 pr-6">
                        {students.length > 0 ? (
                            <>
                                <div className="w-full md:w-4/12">
                                    <ChatUserList 
                                        users={students}
                                        currentUser={teacher.id}
                                        onUserSelect={handleStudentSelect} 
                                    />
                                </div>
                                <div className="w-full md:w-8/12">
                                    <div className="ml-0 md:ml-3">
                                        <div className="flex items-center mb-4">
                                            <div className="relative">
                                                <img className="rounded-full h-12 w-12" src={teacher.profile_photo_url} alt={teacher.name} />
                                                <span className="absolute bottom-0 right-0 inline-block h-3 w-3 rounded-full border-2 border-white bg-green-600" />
                                            </div>
                                            <div className="ml-2">
                                                <p>{teacher.name}</p>
                                                <p className="text-xs text-gray-500">active</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 mb-4">
                                            <div className="flex items-center bg-yellow-50 text-yellow-700 p-4" role="alert">
                                                <svg className="fill-current w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                                                <p>This chat is being monitored by our team. Please do not share any personal information.</p>
                                            </div>
                                        </div>

                                        {selectedStudent ? (
                                            <ChatComponent 
                                                chat={chat}
                                                currentUser={USER_TYPES.TEACHER}
                                                handleAttachFile={handleAttachFile}
                                                handleSendMessage={handleSendMessage} 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-center justify-center">
                                                <img src={noMessages} alt="No messages" />
                                                <h2 className="text-1xl font-semibold mb-2">No Messages Yet</h2>
                                                <p>Once you have active subscription for this student,<br /> you can communicate with teachers from here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center w-full h-full mt-8">
                                <h2 className="text-1xl font-semibold mb-2">No Student Found</h2>
                                <p>You currently do not have any students assigned.<br />Please wait until at least one student is assigned to you to start a chat.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Chat