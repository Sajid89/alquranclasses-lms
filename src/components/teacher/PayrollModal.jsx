import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { FaUserGraduate } from "react-icons/fa";
import Modal from 'react-modal';

import { CustomButton } from '../../components';
import api from '../../utils/api';

Modal.setAppElement('#root'); 

const PayrollModal = ({ isOpen, onRequestClose, ID }) => {

    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.post('/get-single-payroll', {
                    payroll_id: ID,
                });

                const item = response.data.data;
                const formattedDate = new Date(item.to_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const capitalizeFirstLetter = (string) => {
                    if (!string) return '';
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };

                const teamBonus = parseFloat(item.team_bonus) || 0;
                const customerBonus = parseFloat(item.customer_bonus) || 0;
                const totalBonus = Math.round(teamBonus + customerBonus);

                const lateJoiningDeduction = parseFloat(item.late_joining_deduction) || 0;
                const loanDeduction = parseFloat(item.loan_deduction) || 0;
                const totalDeduction = Math.round(lateJoiningDeduction + loanDeduction);

                const formattedData ={
                    date: formattedDate,
                    hours: Math.round(item.total_regular_duration),
                    trialHours: Math.round(item.total_trial_duration),
                    amount: item.net_to_pay,
                    trialAmount: item.total_trial_amount,
                    allowance: Math.round(item.allowance),
                    teamBonus: teamBonus,
                    customerBonus: customerBonus,
                    totalBonus: totalBonus,
                    lateDeduction: lateJoiningDeduction,
                    loanDeduction: loanDeduction,
                    totalDeduction: totalDeduction,
                    status: capitalizeFirstLetter(item.salary_status),
                }

                setDetail(formattedData);
            } catch (error) {
                console.error('Failed to fetch enrolled students data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [ID]);



    const handleClick = () => {
        console.log('clicked');
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-white rounded shadow-lg p-6 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
        >
            <button 
                onClick={onRequestClose} 
                className="absolute top-2 right-2 cursor-pointer"
            >
                <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">Pay Slip</h2>
            <div className='flex flex-col'>
                <div className='w-3/4'>
                    <div className='flex justify-between'>
                        <p className='text-gray-500'>Date:</p>
                        <p className='font-semibold'>{detail.date}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Total Hours:</p>
                        <p>{detail.hours}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Trial Hours:</p>
                        <p>{detail.trialHours}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Status:</p>
                        <p 
                            className={`${detail.status ? detail.status === 'Pending' ? 'bg-purple-200' : 'bg-light-dark-green' : ''} 
                                ${detail.status === 'Pending' ? 'text-purple-700' : 'text-green'}
                                py-1 px-2 rounded-full font-semibold text-xs`}
                        >
                            {detail.status}
                        </p>
                    </div>
                </div>

                <hr className='w-full mt-2'/>

                <div className='w-3/4'>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Total Amount:</p>
                        <p>{detail.amount}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Trial Amount:</p>
                        <p>{detail.trialAmount}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Internet Allowance:</p>
                        <p>{detail.allowance}</p>
                    </div>
                </div>

                <hr className='w-full mt-2'/>

                <div className='w-3/4'>
                    <p className='font-semibold mt-2'>Bonus:</p>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>By Team:</p>
                        <p className='text-green'>{detail.teamBonus}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>By Customer:</p>
                        <p className='text-green'>{detail.customerBonus}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Total Bonus:</p>
                        <p className='text-green'>{detail.totalBonus}</p>
                    </div>
                </div>

                <hr className='w-full mt-2'/>
                
                <div className='w-3/4'>
                    <p className='font-semibold mt-2'>Deduction:</p>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Late Joining:</p>
                        <p className='text-red-600'>{detail.lateDeduction}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Loan Cutting:</p>
                        <p className='text-red-600'>{detail.loanDeduction}</p>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='text-gray-500'>Total Deduction:</p>
                        <p className='text-red-600'>{detail.totalDeduction}</p>
                    </div>
                </div>
                <CustomButton 
                    customClass="w-full bg-green text-white mt-4"
                    onClick={handleClick}
                >
                    Download Slip
                </CustomButton>
            </div>
        </Modal>
    );
};

export default PayrollModal;