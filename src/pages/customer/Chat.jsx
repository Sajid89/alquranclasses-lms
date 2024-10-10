import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { ChatUserList, ChatComponent } from '../../components';
import avatar from '../../data/placedolder_avatar.jpg';
import noMessages from '../../data/images/no_messages.png';

import Pusher from 'pusher-js';
import api from '../../utils/api';
import { API_BASE_URL } from '../../config';
import { USER_TYPES } from '../../data/TextConstants';

const Chat = () => {
    const customer = useSelector(state => state.auth.profile);
    const studentsData = useSelector(state => state.students.data);

    const students = useMemo(() => studentsData.map(student => ({
        id: student.id,
        name: student.name,
        profilePic: student.profile_photo_url ? student.profile_photo_url : avatar,
        teachers: student.teachers.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            course: teacher.course
        }))
    })), [studentsData]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState(messages);
    const disconnectionAttempts = useRef(0);
    const isFirstMount = useRef(true);
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch all messages on component mount
    useEffect(() => {
        const getMessages = async () => {
            try {
                let data = {
                    user_type: USER_TYPES.CUSTOMER,
                    from: customer.id,
                    to: selectedTeacher ? selectedTeacher.id : students[0].teachers[0]?.id
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

        const participantId = selectedTeacher ? selectedTeacher.id : students[0].teachers[0]?.id;
        const ids = [parseInt(customer.id, 10), parseInt(participantId, 10)].sort((a, b) => a - b);
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
                user_type: USER_TYPES.CUSTOMER,
                from: customer.id,
                to: selectedTeacher.id
            };
    
            const response = await api.post('/get-latest-message', data);
            setChat((prevChat) => [...prevChat, response.data.data]);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    const handleStudentSelect = (studentId) => {
        const student = students.find(student => student.id === studentId);
        setSelectedStudent(student);
        let selectedTeacherLocal = null;
        if (student.teachers.length > 0) {
            selectedTeacherLocal = student.teachers[0];
            setSelectedTeacher(selectedTeacherLocal);
        } else {
            setSelectedTeacher(null);
        }

        // const filteredMessages = messages.filter(message => 
        //     (message.senderId === studentId && message.recieverId === selectedTeacherLocal.id) ||
        //     (message.senderId === selectedTeacherLocal.id && message.recieverId === studentId)
        // );
        // setChat(filteredMessages);
    };

    const handleTeacherSelect = (teacherId) => {
        const teacher = selectedStudent.teachers.find(teacher => teacher.id === teacherId);
        setSelectedTeacher(teacher);
        
        const filteredMessages = messages.filter(message => 
            (message.senderId === teacherId && message.recieverId === customer.id) ||
            (message.senderId === customer.id && message.recieverId === teacherId)
        );
        setChat(filteredMessages);
    };

    const handleAttachFile = (event) => {
        const file = event.target.files[0];
    };

    const handleSendMessage = async (message) => {
        setIsSending(true);

        const data = {
            sender: USER_TYPES.CUSTOMER,
            from: customer.id,
            to: selectedTeacher.id,
            message: message,
            type: 'customer-teacher'
        };

        try {
            await api.post('/send-message', data);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='flex flex-col md:flex-row pl-6 pr-6'>
                {students.length > 0 ? (
                    <>
                        <div className='w-full md:w-4/12'>
                            <ChatUserList 
                                users={students}
                                currentUser={customer.id}
                                onUserSelect={handleStudentSelect} 
                            />
                        </div>
                        <div className='w-full md:w-8/12'>
                            {selectedStudent && (
                                <div className='ml-0 md:ml-3'>
                                    <select 
                                        className='w-full p-2 mb-4 border border-gray-300 rounded-md
                                        focus-visible:outline-none cursor-pointer'
                                        onChange={(e) => handleTeacherSelect(Number(e.target.value))}>
                                        {selectedStudent.teachers.map((teacher, index) => (
                                            <option key={index} value={teacher.id}>{teacher.name} ({teacher.course})</option>
                                        ))}
                                    </select>

                                    {selectedStudent && selectedStudent.teachers.length > 0 ? 
                                        selectedTeacher && (
                                            <ChatComponent 
                                                chat={chat}
                                                handleAttachFile={handleAttachFile}
                                                handleSendMessage={handleSendMessage} 
                                                isSending={isSending}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-center justify-center">
                                                <img src={noMessages} alt="No messages" />
                                                <h2 className='text-1xl font-semibold mb-2'>No Messages Yet</h2>
                                                <p>
                                                    Once you have active subscription for this student, 
                                                    <br /> you can communicate with teachers from here.
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center w-full h-full">
                        <h2 className='text-1xl font-semibold mb-2'>No Students Found</h2>
                        <p>You currently do not have any students. Please add a student to start a chat.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat