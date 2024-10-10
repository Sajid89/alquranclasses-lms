import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { DynamicForm, TicketViewSkeletonLoader, Spinner } from '../../../components';
import api from '../../../utils/api';

const ViewTicket = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { ticketNo } = useParams();
    const [ticketData, setTicketData] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [images, setImages] = useState([]);

    const fields = [
        { type: 'textarea', name: 'description', placeholder: 'Write your reply here' },
        { type: 'multipleImageUpload', name: 'attachments', buttonText: 'Upload Attachments'},
        { type: 'button', name: 'submit', buttonText: 'Submit'},
    ];

    const fetchTicketData = () => {
        api.get(`view-ticket/${ticketNo}`)
            .then(response => {
                setTicketData(response.data.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching ticket data:', error);
            });
    };
    
    useEffect(() => {
        fetchTicketData();
    }, [ticketNo]);

    const validationSchema = generateValidationSchema(fields);

    const [formData, setFormData] = useState({
        ticket_id: ticketNo
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        setErrors({ ...errors, [fieldName]: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setApiLoading(true);
            const response = await api.post('/reply-ticket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Reply Sent Successfully');

            setFormData({
                ...formData,
                description: '',
            });

            setImages([]);
            setErrors({});
            fetchTicketData();
        }  catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
        } finally {
            setApiLoading(false);
        }
    };

    return (
        isLoading ?
            <TicketViewSkeletonLoader /> :
            <>
                {ticketData && 
                    <div className='flex justify-between items-start mt-24 md:mt-8 mx-6 md:mx-16 mb-4'>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <h2 className='font-semibold'>Ticket # {ticketData.id}</h2>
                                <p className={`flex items-center text-xs text-gray-500 rounded-full px-2 py-1 ${
                                    ticketData.status === 'Open' ? 'bg-blue-200' :
                                    ticketData.status === 'Closed' ? 'bg-green-200' :
                                    ticketData.status === 'Reopen' ? 'bg-purple-200' : ''
                                }`}>
                                    <div className={`mr-2 rounded-full w-2 h-2 ${
                                        ticketData.status === 'Open' ? 'bg-blue-500' :
                                        ticketData.status === 'Closed' ? 'bg-green-500' :
                                        ticketData.status === 'Reopen' ? 'bg-purple-500' : 'bg-black'
                                    }`}></div>
                                    {ticketData.status}
                                </p>
                            </div>
                        </div>
                    </div>
                }

                {ticketData && ticketData.customer &&
                    <div className='flex flex-col border-1 border-gray-300 p-6 mt-24 md:mt-8 mb-4 mx-6 md:mx-16'>
                        <div className='flex justify-between items-start mb-4'>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <h2 className='font-semibold'>{ticketData.customer.name}</h2>
                                    <p className='text-sm text-gray-500'>Customer</p>
                                </div>
                            </div>
                            <p className='text-sm text-gray-500'>{ticketData.customer.date}</p>
                        </div>
                        <p className='mb-4'>
                            {ticketData.customer.issue.replace(/^(Hello|Hi),/, '$1, ')}
                        </p>

                        <div className='flex flex-row mb-4'>
                            {ticketData.attachments.map((attachment, index) => (
                                <img 
                                    key={index} 
                                    src={attachment.attachment_url} 
                                    alt={attachment.name} 
                                    className={`${index !== 0 ? 'ml-2' : ''} border-1 border-gray-400`} 
                                    style={{ width: '100px', height: '100px' }} 
                                />
                            ))}
                        </div>

                        {ticketData.conversations.map((conversation, index) => (
                            <React.Fragment key={index}>
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <h2 className='font-semibold'>{conversation.name}</h2>
                                            <p className='text-sm text-gray-500'>{conversation.role}</p>
                                        </div>
                                    </div>
                                    <p className='text-sm text-gray-500'>{conversation.date}</p>
                                </div>
                                <p className='mb-4' style={{ wordBreak: 'break-word' }}>
                                    {conversation.reply.split(/^(.*?),/).map((text, index) => 
                                        index === 1 ? 
                                            <span key={index}>{text},<br className='h-6' /></span> : 
                                            <span key={index}>{text}</span>
                                    )}
                                </p>

                                <div className='flex flex-row mb-4'>
                                    {conversation.attachment && conversation.attachment.map((attachment, index) => (
                                        <img 
                                            key={index} 
                                            src={attachment.attachment_url} 
                                            alt={attachment.name} 
                                            className={`${index !== 0 ? 'ml-2' : ''} border-1 border-gray-400`} 
                                            style={{ width: '100px', height: '100px' }} 
                                        />
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}

                        

                        <DynamicForm
                            fields={fields}
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                            onSubmit={handleSubmit}
                            images={images}
                            setImages={setImages}
                            isMaxWidth={true}
                            customClasses="border-0 p-0 mt-4"
                        />
                    </div>
                }

                <Spinner loading={apiLoading} text="Please wait..." />
            </>
    );
}

export default ViewTicket;