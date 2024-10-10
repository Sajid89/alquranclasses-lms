// StripeCardsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StripeCard } from '../../../components';
import { FiPlus } from 'react-icons/fi';
import axios from '../../../utils/api';

const SkeletonLoader = () => (
    <div className="bg-gray-100 p-4 rounded-md flex items-center 
        justify-between animate-pulse mb-2">
        <div className="flex items-center">
            <div className="mr-4 bg-gray-200 rounded w-10 h-10"></div>
            <div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
);

const StripeCardsList = () => {
    const [stripeCards, setStripeCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCards = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('stripe-cards');
            setStripeCards(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch stripe cards:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleClick = () => {
        navigate('/customer/add-payment-method');
    }

    return (
        <div className='border border-gray-300 p-4'>
            <div className="grid md:grid-cols-2 gap-4">
                {isLoading ? (
                    [...Array(2)].map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))
                ) : (
                    stripeCards.map((card) => (
                        <StripeCard
                            key={card.id}
                            id={card.stripe_card_id}
                            last4={card.last4}
                            expiry={card.expiry}
                            isDefault={card.is_default}
                            refreshCardList={fetchCards}
                        />
                    ))
                )}
            </div>

            <button className={`border border-gray-300 rounded-md
                flex items-center justify-center p-2 ${stripeCards.length > 0 ? 'mt-4' : 'mt-0'}`}
                onClick={handleClick}>
                <FiPlus className="mr-2" />
                Add new payment method
            </button>
        </div>
    );
};

export default StripeCardsList;