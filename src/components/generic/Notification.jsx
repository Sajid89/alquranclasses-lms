import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.post('/get-notifications', { page: 1, limit: 15});
                setNotifications(response.data.data.notifications);
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
            }
            setLoading(false);
        };

        fetchNotifications();
    }, []);



    return (
        <div className="absolute top-14 right-0 w-64 mt-2 py-2 mr-6 md:mr-0 
            bg-white rounded shadow-xl z-50">
            {loading ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No notifications</div>
            ) : (
                <>
                    {notifications.slice(0, 5).map((notification, index) => (
                        <a href="#" className="transition-colors duration-200 block px-4 py-1.5 text-normal 
                            text-gray-400 rounded hover:text-gray-900" 
                            key={index}>
                            {notification.message}
                            {index < notifications.length - 1 && <hr className="mt-1 border-gray-200" />}
                        </a>
                    ))}
                    {notifications.length > 5 && (
                        <div className='block px-4 py-2 text-xs text-right'>
                            <a href="#" className=" text-green hover:underline">
                                View all
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Notification