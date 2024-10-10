import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, TableComponent, CustomButton, TicketViewSkeletonLoader } from '../../../components';
import { FaUserGraduate, FaBook, FaClock, FaDollarSign } from 'react-icons/fa';
import api from '../../../utils/api';

const Payroll = () => {
    const [payrollStats, setPayrollStats] = useState({});
    const [payrollData, setPayrollData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [updateData, setUpdateData] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchPayrollStats = async () => {
            try {
                const [statsResponse, payrollResponse] = await Promise.all([
                    api.get('/teacher-payroll-stats'),
                    api.post('/teacher-payrolls', {
                        page: currentPage,
                        limit: itemsPerPage
                    })
                ]);

                setPayrollStats(statsResponse.data.data);

                const data = payrollResponse.data.data;
                const formattedData = data.map((item) => {
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

                    return {
                        id: item.id,
                        date: formattedDate,
                        regular: Math.round(item.total_regular_duration),
                        trial: Math.round(item.total_trial_duration),
                        bonus: totalBonus,
                        allowance: Math.round(item.allowance),
                        deduction: Math.round(item.late_joining_deduction + item.loan_deduction),
                        status: capitalizeFirstLetter(item.salary_status),
                        amount: item.net_to_pay,
                    }
                });

                setPayrollData(formattedData);
                setTotal(payrollResponse.data.total);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchPayrollStats();
    }, []);

    const cards = [
        { icon: <FaUserGraduate />, text: 'Earnings', 
            number: payrollStats.total_earning ? payrollStats.total_earning : 0 },
        { icon: <FaBook />, text: 'Classes', 
            number: payrollStats.total_class_count ? payrollStats.total_class_count : 0 },
        { icon: <FaClock />, text: 'Hours', 
            number: payrollStats.total_hours ? payrollStats.total_hours : 0},
        { icon: <FaDollarSign />, text: 'Rate', 
            number: payrollStats.regular_rate ? payrollStats.regular_rate : 0},
        { icon: <FaDollarSign />, text: 'Trail Rate', 
            number: payrollStats.trial_rate ? payrollStats.trial_rate : 0},
    ];

    const tableHeaders = [
        'date', 'regular', 'trial', 'bonus', 'allowance', 'status', 'amount'
    ];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/teacher/bank-details');
    }

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='flex flex-row justify-between pl-6 pr-6 w-full'>
                <h3 className='font-semibold text-xl mb-4'>
                    Payroll
                </h3>
                <CustomButton 
                    customClass="bg-green text-white text-xs mb-4"
                    onClick={handleClick}
                >
                    Bank Details
                </CustomButton>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6 mt-0'>
                <div className='w-full'>
                    {loading ?
                        <TicketViewSkeletonLoader />
                    : 
                        <>
                            <h3 className='font-semibold mb-2'>Overview</h3>
                            <div className='md:flex stats-card-wrap'>
                                {cards.map((card, index) => (
                                    <Card
                                        key={index}
                                        style={{ 
                                            width: '170px', 
                                            marginRight: index !== cards.length - 1 ? '1rem' : '0' 
                                        }}
                                        icon={card.icon}
                                        text={card.text}
                                        number={card.number}
                                    />
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>

            <div className='flex flex-col lg:flex-row pl-6 pr-6 mt-8 md:mt-4'>
                <div className='w-full'>
                    <h3 className='font-semibold mb-2'>Payroll Sheet</h3>
                    <TableComponent 
                        headers={tableHeaders} 
                        data={payrollData} 
                        loading={loading} 
                        showCourses={true} 
                        pagination={true} 
                        currentPage={currentPage} 
                        totalItems={total} 
                        itemsPerPage={itemsPerPage} 
                        paginate={paginate}
                        updateData={setUpdateData}
                    />
                </div>
            </div>
        </div>
    )
}

export default Payroll