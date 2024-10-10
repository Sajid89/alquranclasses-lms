import React, { useState } from 'react';
import { FiCreditCard, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from '../../../utils/api';
import { Spinner } from '../../../components';

const StripeCard = ({ id, last4, expiry, isDefault, refreshCardList }) => {
    const [loading, setLoading] = useState(false);

    const handleSetAsDefault = async () => {
        setLoading(true);
        try {
            const response = await axios.post('make-card-default', { card_id: id });
            toast.success('Default card set successfully');
            refreshCardList();
        } catch (error) {
            toast.error('Failed to set default card');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this card?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setLoading(true);
                        try {
                            const response = await axios.delete('delete-stripe-card', { data: { card_id: id } });
                            toast.success('Card deleted successfully');
                            refreshCardList();
                        } catch (error) {
                            toast.error('Failed to delete card');
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <div className="bg-gray-100 p-4 rounded-md flex items-center 
            justify-between">
            {loading ? (
                <Spinner loading={true} text={'Request in progress'} />
            ) : (
                <>
                    <div className="flex items-center">
                        <FiCreditCard className="mr-4" size={32} />
                        <div>
                            <div>Ending with {last4}</div>
                            <div className="text-gray-400">Expires {expiry}</div>
                        </div>
                    </div>
                    <div>
                        {isDefault ? (
                            <span className="bg-green text-white py-1 px-2 rounded-md">Default</span>
                        ) : (
                            <div className="flex items-center">
                                <button onClick={handleDelete} className="mr-2">
                                    <FiTrash2 />
                                </button>
                                <button onClick={handleSetAsDefault} className="text-green">
                                    Set as Default
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
            
        </div>
    );
};

export default StripeCard;