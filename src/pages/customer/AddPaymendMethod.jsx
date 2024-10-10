import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import Image from '../../data/icons/payments.png';
import CustomButton from '../../components/generic/CustomButton';
import Breadcrumb from '../../components/generic/Breadcrumb';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../utils/api';
import { Spinner } from '../../components';

const AddPaymendMethod = () => {
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [reset, setReset] = useState(false);
    const navigate = useNavigate();

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "#32325d",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                },
            },
            invalid: {
                color: "red",
                iconColor: "red"
            }
        }
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        if (loading) {
            // Prevent multiple submissions
            return;
        }

        setButtonDisabled(true);

        try {
            const cardElement = elements.getElement(CardElement);
            const {error, token} = await stripe.createToken(cardElement);

            if (token) {
                setLoading(true);

                // Send token.id to your backend API
                try {
                    await api.post('add-card', { stripe_token: token.id });
                    toast.success('Card added successfully');
                    setReset(prevState => !prevState);
                    
                    if (localStorage.getItem('redirect')) {
                        navigate(localStorage.getItem('redirect'));
                        localStorage.removeItem('redirect');
                    }
                } catch (error) {
                    console.log('Failed to add new card ', error);
                } finally {
                    setLoading(false);
                    setButtonDisabled(false);
                }
            } else {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            <div className='w-full pl-6 pr-6'>
                <Breadcrumb items={[
                    { name: 'Payment Methods', link: '/customer/transaction-billing' },
                    { name: 'Add Payment Method', active: true }
                ]} />
            </div>

            <div className='mt-20 md:mt-4 mb-4'>
                {loading ? (
                    <Spinner loading={true} text={'Request in progress'} />
                ) : (
                    <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                        <div className='w-full lg:w-8/12'>
                            <div className='md:flex items-center justify-between flex-col md:flex-row'>
                                <p className='text-1xl font-semibold w-full md:text-left'>We accept these cards:</p>
                                <img src={Image} alt='cards' className='md:ml-4 w-full md:w-auto' />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <CardElement key={reset} options={CARD_ELEMENT_OPTIONS} />
                                <button 
                                    className='w-full mt-4 shadow bg-dark-green hover:bg-green text-white 
                                    focus:shadow-outline focus:outline-none  
                                    py-2 px-8 rounded'
                                    type='submit'
                                    disabled={buttonDisabled}
                                >
                                    {buttonDisabled ? 'Processing...' : 'Add Card'}
                                </button>
                            </form>
                        </div>

                        <div className='w-full lg:w-4/12 md:ml-6'>
                            <div className='bg-light-green rounded-md p-3'>
                                <p className='text-green font-semibold'>Secure Payments</p>
                                <p>
                                    Your Payment details are safe. They will be transferred 
                                    over an encrypted server and stored on a verified server.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddPaymendMethod