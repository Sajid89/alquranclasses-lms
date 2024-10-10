import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Pusher from 'pusher-js';
import { API_BASE_URL } from '../../config';
import avatar from '../../data/placedolder_avatar.jpg';

const ChatUserList = ({ users, currentUser, onUserSelect }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [uniqueUsers, setUniqueUsers] = useState([]);
    const [pusher, setPusher] = useState(null);
    const [channels, setChannels] = useState({});
    const[newMessagesCount, setNewMessagesCount] = useState(0);

    // Utility function for deep comparison of two user arrays
    const arraysAreEqual = (array1, array2) => {
        if (array1.length !== array2.length) return false;
        return array1.every(element => array2.some(e => e.id === element.id));
    };

    useEffect(() => {
        if (users.length > 0) {
            const unique = users.reduce((unique, user) => {
                return unique.some(u => u.id === user.id) ? unique : [...unique, user];
            }, []);

            // Only update state if the unique users have actually changed
            if (!arraysAreEqual(uniqueUsers, unique)) {
                setUniqueUsers(unique);
                setSelectedUser(unique[0].id);
                onUserSelect(unique[0].id);
                //fetchNewMessagesCount(unique[0].id);
                //markMessagesAsRead(unique[0].id);
            }
        }

    }, [users, uniqueUsers]);

    useEffect(() => {
        const pusherInstance = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            forceTLS: true,
            authEndpoint: `${API_BASE_URL}/pusher/auth`,
        });
        setPusher(pusherInstance);
    
        return () => {
            if (pusherInstance) {
                pusherInstance.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!pusher) return;
    
        const subscribeToChannel = (user) => {
            const participantId = user.id;
            const ids = [parseInt(currentUser, 10), parseInt(participantId, 10)].sort((a, b) => a - b);
            const channelName = `private-chat-${ids[0]}-${ids[1]}`;
            const channel = pusher.subscribe(channelName);

            channel.bind('pusher:subscription_succeeded', () => {
                //console.log(`Successfully subscribed to ${channelName}`);
            });
            
            channel.bind('pusher:subscription_error', (status) => {
                console.error(`Subscription error for ${channelName}:`, status);
            });

            channel.bind('new-message', (data) => {
                if (selectedUser && selectedUser.id !== user.id) {
                    handleNewMessage(data, user.id);
                }
            });
        
            return channel;
        };
    
        const newChannels = {};
        users.forEach((user) => {
            if (!selectedUser || selectedUser.id !== user.id) {
                newChannels[user.id] = subscribeToChannel(user);
            }
        });
    
        setChannels(newChannels);
    
        return () => {
            Object.values(newChannels).forEach((channel) => {
                channel.unbind_all();
                pusher.unsubscribe(channel.name);
            });
        };
    }, [pusher, selectedUser, users]);

    const handleNewMessage = (message) => {
        const senderId = message.senderId;
        const unreadMessagesCount = getUnreadMessagesCount(senderId);
    
        if (senderId !== selectedUser && unreadMessagesCount > 0) {
            setNewMessagesCount(prev => ({
                ...prev,
                [senderId]: (prev[senderId] || 0) + 1
            }));
        }
    };
    
    const getUnreadMessagesCount = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.unreadMessagesCount : 0;
    };

    const markMessagesAsRead = async (userId) => {
        try {
            await api.post('/mark-messages-as-read', {
                from: currentUser,
                to: userId,
            });

            setNewMessagesCount(prevState => ({ ...prevState, [userId]: 0 }));
        } catch (error) {
            console.error('Failed to mark messages as read', error);
        }
    };

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        onUserSelect(userId);

        setNewMessagesCount(prev => ({
            ...prev,
            [userId]: 0
        }));

        markMessagesAsRead(userId);
    };

    return (
        <div className="h-90 md:max-h-screen overflow-y-auto">
            {uniqueUsers.map((user, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-between mb-2 p-2 cursor-pointer rounded-md 
                        ${user.id === selectedUser ? 'bg-light-green' : ''}`}
                    onClick={() => handleUserClick(user.id)}
                >
                    <div className="flex items-center">
                        <img className='rounded-full h-12 w-12' src={user.profilePic ? user.profilePic : avatar} alt={user.name} />
                        <div className='ml-2'>
                            <p>{user.name}</p>
                            {user.hasOwnProperty('active') && 
                                <p className='text-xs text-gray-500'>{user.active ? 'active now' : 'away'}</p>
                            }
                        </div>
                    </div>
                    {/* New Messages Badge */}
                    {(user.id !== selectedUser ? user.unreadMessagesCount : newMessagesCount[user.id]) > 0 && 
                        <span
                            className="bg-green text-white text-xs rounded-full px-1 py-0.5"
                            style={{fontSize: '0.75rem', minHeight: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        >
                            {user.id !== selectedUser ? user.unreadMessagesCount : newMessagesCount[user.id]}
                        </span>
                    }
                </div>
            ))}
        </div>
    );
};

export default ChatUserList;