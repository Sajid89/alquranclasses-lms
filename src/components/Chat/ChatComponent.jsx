import React, { useState, useRef, useEffect } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { USER_TYPES } from '../../data/TextConstants';

const Chat = ({ 
    chat, currentUser=USER_TYPES.CUSTOMER,
    handleAttachFile, handleSendMessage, isSending 
}) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const sendMessage = () => {
        handleSendMessage(message);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-70 md:h-90 justify-between border 
            border-gray-200 p-3">
            <div className="overflow-auto mb-4">
                {chat.map((message, index) => (
                    <div key={index} className={`flex items-start mb-3 
                        ${message.sender === currentUser ? 'justify-end' : 
                            'justify-start'}`}>
                        <div className={`max-w-sm rounded-full px-4 py-1.5 
                            ${message.sender === currentUser ? 'bg-green text-white' : 
                            'bg-gray-200 text-black'}`}>
                            <p className={`text-xs ${message.message.length > 50 ? 'p-1' : ''}`}>
                                <strong className='mr-2'>
                                    {message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}:
                                </strong> 
                                {message.message}
                            </p>
                            <span className={`block text-right text-gray-500 text-xs ${message.message.length > 50 ? 'px-4' : ''}`}>
                                {new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
                                new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center border rounded-md px-2 py-1">
                {/* <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleAttachFile} accept="image/*" />
                <button className="mr-2" onClick={() => document.getElementById('fileInput').click()}>
                    <FiPaperclip />
                </button> */}
                <input 
                    className="flex-grow text-sm focus-visible:outline-none" 
                    type='text' 
                    placeholder='Feel free to ask what you want to know' 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                />
                <button className="ml-2 bg-green rounded-md p-2" 
                    onClick={sendMessage} 
                    disabled={!message.trim()}
                >
                    {isSending ? 
                        <div className="flex items-center">
                            <div className="loader border-4 border-t-4 green-border-light green-t-border-lighter 
                                rounded-full w-6 h-6 animate-spin"></div>
                        </div>
                        : <FiSend color="white" />
                    }
                </button>
            </div>
        </div>
    );
};

export default Chat;