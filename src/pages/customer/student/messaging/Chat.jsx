import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Pusher from 'pusher-js';

import { ChatUserList, ChatComponent } from '../../../../components';
import avatar from '../../../../data/placedolder_avatar.jpg';
import noMessages from '../../../../data/images/no_messages.png';
import api from '../../../../utils/api';
import { API_BASE_URL } from '../../../../config';
import { USER_TYPES } from '../../../../data/TextConstants';

const Chat = () => {
    const { studentName } = useParams();
    const students = useSelector(state => state.students.data);
    const student = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
    const teacherList = student.teachers;
    const teachers = useMemo(() => teacherList.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        course: teacher.course,
        profilePic: teacher.profile_photo_url ? teacher.profile_photo_url : avatar,
        unreadMessagesCount: 0,
        active: false
    })), [teacherList]);

    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState(messages);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isSending, setIsSending] = useState(false);

    // Fetch all messages on component mount
    useEffect(() => {
        const getMessages = async () => {
            console.log("Fetching messages for student:", student.id);
            try {
                const data = {
                    user_type: USER_TYPES.STUDENT,
                    from: student.id,
                    to: selectedTeacher ? selectedTeacher.id : teachers[0]?.id
                };
        
                const response = await api.post('/get-messages', data);
                setChat(response.data.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        getMessages();
    }, [selectedTeacher]);

    // Pusher setup
    useEffect(() => {
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            forceTLS: true,
            authEndpoint: `${API_BASE_URL}/pusher/auth`,
        });

        const participantId = selectedTeacher ? selectedTeacher.id : teachers[0]?.id;
        const ids = [parseInt(student.id, 10), parseInt(participantId, 10)].sort((a, b) => a - b);
        const channelName = `private-chat-${ids[0]}-${ids[1]}`;
        console.log('Subscribing to channel:', channelName);
        const channel = pusher.subscribe(channelName);

        channel.bind('new-message', (data) => {
            console.log('New message:', data);
            setChat((prevChat) => [...prevChat, data]);
        });

        channel.bind('pusher:subscription_error', function(status) {
            console.error('Subscription error:', status);
        });
        
        channel.bind('pusher:subscription_succeeded', function() {
            console.log('Subscription succeeded');
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [messages]);

    

    // Function to handle teacher selection
    const handleTeacherSelect = (teacherId) => {
        const teacher = teachers.find(teacher => teacher.id === teacherId);
        setSelectedTeacher(teacher);

        const filteredMessages = messages.filter(message => 
            (message.senderId === teacherId && message.recieverId === student.id) ||
            (message.senderId === student.id && message.recieverId === teacherId)
        );
        setChat(filteredMessages);
    }

    const handleAttachFile = (event) => {
        const file = event.target.files[0];
    };

    const handleSendMessage = async (message) => {
        setIsSending(true);
        const data = {
            sender: USER_TYPES.STUDENT,
            from: student.id,
            to: selectedTeacher.id,
            message: message,
            type: 'student-teacher'
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
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Messaging
                </h3>
            </div>
            <div className='flex flex-col md:flex-row pl-6 pr-6'>
                {teacherList.length > 0 ? (
                    <>
                        <div className='w-full md:w-4/12'>
                            <ChatUserList 
                                users={teachers} 
                                currentUser={student.id}
                                onUserSelect={handleTeacherSelect} 
                            />
                        </div>
                        <div className='w-full md:w-8/12'>
                            <div className='ml-0 md:ml-3'>
                                <div className='flex items-center mb-4'>
                                    <div className='relative'>
                                        <img className='rounded-full h-12 w-12' src={student.profile_photo_url ? student.profile_photo_url : avatar} alt={student.name} />
                                        <span
                                            className='absolute bottom-0 right-0 inline-block h-3 w-3 
                                            rounded-full border-2 border-white bg-green-600'
                                        />
                                    </div>
                                    <div className='ml-2'>
                                        <p>{student.name}</p>
                                        <p className='text-xs text-gray-500'>active</p>
                                    </div>
                                </div>

                                <div className='mt-4 mb-4'>
                                    <div className='flex items-center bg-yellow-50 text-yellow-700 p-4' role='alert'>
                                        <svg className='fill-current w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/></svg>
                                        <p>This chat is being monitored by our team. Please do not share any personal information.</p>
                                    </div>
                                </div>


                                {selectedTeacher ? (
                                        <ChatComponent 
                                            chat={chat}
                                            currentUser={USER_TYPES.STUDENT}
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
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center w-full h-full">
                        <h2 className='text-1xl font-semibold mb-2'>No Teacher Found</h2>
                        <p>You currently do not have any teachers. Please enroll in a course to start a chat.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat