import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton, TableComponent } from '../../../components';
import NoTickets from '../../../data/images/help_center.png';

import api from '../../../utils/api';

const CustomerSupport = () => {
    const tableHeaders = [
        'ticket no', 'issue', 'student name', 'status', 'created at', 'view'
    ];

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('show-tickets');
                setTableData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/customer/help/create-ticket');
    }

    return (
        <div className='mt-24 md:mt-8 mb-4'>
            <div className='px-6 md:px-16'>
                {!loading && tableData.length === 0 ? (
                    <div className='w-full text-center'>
                        <img src={NoTickets} alt="No Tickets" 
                            className='m-auto' width={220}/>
                        <h2 className='text-2xl font-semibold mb-2'>No Tickets Yet</h2>
                        <p className='text-sm text-gray-500 mb-4'>
                            For support, visit the Help Center or submit a ticket.
                        </p>
                        <div className='flex justify-center items-center mb-4 md:mb-0'>
                            <CustomButton 
                                onClick={handleClick}
                                customClass='bg-green text-white border border-green'
                            >
                                Create Ticket
                            </CustomButton>
                            <CustomButton 
                                onClick={handleClick}
                                customClass='bg-transparent text-green ml-4 border green-border'
                            >
                                Help Center
                            </CustomButton>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='w-full flex flex-col lg:flex-row'>
                            <div className='w-full lg:w-1/2'>
                                <h1 className='text-2xl font-semibold mb-2'>Customer Support</h1>
                                <p className='text-sm text-gray-500 mb-4'>
                                    Here you can view all the tickets you have created.
                                </p>
                            </div>
                            <div className='w-full lg:w-1/2 flex justify-end'>
                                <div className='flex items-center mb-4 md:mb-0'>
                                    <CustomButton 
                                        onClick={handleClick}
                                        customClass='bg-green text-white border border-green'
                                    >
                                        Create Ticket
                                    </CustomButton>
                                    <CustomButton 
                                        onClick={handleClick}
                                        customClass='bg-transparent text-green ml-4 border green-border'
                                    >
                                        Help Center
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                        <div className='w-full overflow-x-auto'>
                            <TableComponent 
                                headers={tableHeaders} 
                                data={tableData}
                                showDropDown={true}
                                loading={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CustomerSupport