import React, { useState, useEffect } from 'react';
import { TableComponent, Tabs, StripeCardsList } from '../../components';
import api from '../../utils/api';

const TransactionAndBillings = () => {
    const [subscribedPlansData, setSubscribedPlansData] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const subscribedPlansHeaders = [
        'student name', 'course', 'plan', 'status', 'start date', 'end date', 'next billing', 'price'
    ];

    useEffect(() => {
        const fetchSubscribedPlans = async () => {
            try {
                const response = await api.get('enrollment-plans');
                const data = response.data.data.map(r => ({
                    'student name': r.name,
                    'course': r.course_title,
                    'plan': r.subscription_plan_title,
                    'status': r.subscription_status.charAt(0).toUpperCase() + r.subscription_status.slice(1).toLowerCase(),
                    'start date': r.start_at,
                    'end date': r.ends_at ? r.ends_at : 'N/A',
                    'next billing': 'N/A',
                    'price': `$${(r.price / 100).toFixed(2)}`
                }));
                setSubscribedPlansData(data);
            } catch (error) {
                console.error('Failed to fetch subscribed plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribedPlans();
    }, []);

    const transactionHeaders = [
        'student name', 'course', 'billing period', 'status', 'date', 'price', 'action'
    ];

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                const response = await api.get('transaction-history');
                const data = response.data.data.map(invoice => ({
                    'invoice_id': invoice.invoice_id,
                    'student name': invoice.student_name,
                    'course': invoice.course_title,
                    'billing period': invoice.billing_period,
                    'status': invoice.status,
                    'date': invoice.invoice_date,
                    'price': `$${invoice.amount}`,
                    'action': 'Download'
                }));
                setTransactionData(data);
            } catch (error) {
                console.error('Failed to fetch transaction history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, []);

    return (
        <div className='mt-20 md:mt-4 mb-4'>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    {/* <h3 className='font-semibold mb-3'>Transaction & Billings</h3> */}
                    <Tabs 
                        tabs={[
                            { label: 'Subscriptions', content: <TableComponent headers={subscribedPlansHeaders} data={subscribedPlansData} loading={loading} /> },
                            { label: 'Transaction History', content: <TableComponent headers={transactionHeaders} data={transactionData} showDownloadButton={true} loading={loading} /> },
                            { label: 'Payment Methods', content: <StripeCardsList /> }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default TransactionAndBillings