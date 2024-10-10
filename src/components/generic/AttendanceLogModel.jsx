import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { FaUserGraduate } from "react-icons/fa";
import Modal from 'react-modal';

import { VerticalLine, TicketViewSkeletonLoader } from '../../components';
import api from '../../utils/api';

Modal.setAppElement('#root'); 

const AttendanceLogModel = ({ isOpen, onRequestClose, classId, classType }) => {

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const fetchAttendanceLog = async () => {
            setLoading(true);
            try {
                const response = await api.post('/get-class-attendance', 
                    {
                        class_id: classId,
                        class_type: classType,
                    }
                );
                setDetails(response.data.data);
            } catch (error) {
                console.log('Error while fetching attendance logs for a class', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAttendanceLog();
    }, [isOpen]);

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-white rounded shadow-lg p-6 w-10/12 md:w-2/5 max-h-[40vh] md:max-h-[60vh] overflow-y-auto"
        >
            <button 
                onClick={onRequestClose} 
                className="absolute top-2 right-2 cursor-pointer"
            >
                <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">Details Log</h2>
            {loading ? (
                <TicketViewSkeletonLoader />
            ) : details.length === 0 ? (
                <div className="text-center mt-4">No data available</div>
            ) : (
                details.map((detail, index) => (
                    <div 
                        key={index} 
                        className={`flex relative justify-between items-center mb-2 ${index !== 0 ? 'mt-7' : ''}`}
                    >
                        {index !== 0 && <VerticalLine />}
                        <div className="flex items-center">
                            {detail.user === 'teacher' ? 
                                <AiOutlineUser className="bg-green text-white w-6 h-6 rounded-full p-1 mr-2" /> 
                            : 
                                <FaUserGraduate className="bg-green text-white w-6 h-6 rounded-full p-1 mr-2" />
                            }
                            <span>{detail.text}</span>
                        </div>
                        <span>{detail.time}</span>
                    </div>
                ))
            )}
        </Modal>
    );
};

export default AttendanceLogModel;