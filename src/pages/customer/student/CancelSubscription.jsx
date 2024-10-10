import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CancelSubscriptionComponent }  from '../../../components';
import Breadcrumb from '../../../components/generic/Breadcrumb';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import CustomButton from '../../../components/generic/CustomButton';
import { FaGift } from 'react-icons/fa';

const CancelSubscription = () => {
    const [step, setStep] = useState(1);
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [ showList, setShowList ] = useState(true);
    const [title, setTitle] = useState("Before You Go, Fahad");
    const [text, setText] = useState("We’re sorry that you’re thinking of leaving. Please spare us a moment to tell us why you want to cancel the subscription. We might be able to help you.");
    
    const reasonsToCancel = ['It’s too Expensive', 'I don’t like the classes', 'I don’t have time', 'I’m not satisfied with the service', 'Other'];
    const [list, setList] = useState(reasonsToCancel);
    const [buttonText1, setButtonText1] = useState("Keep Subscription");
    const [buttonText2, setButtonText2] = useState("Continue");
    const [ changeMind, setChangeMind ] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const navigate = useNavigate();

    const handleButton1Click = (event) => {
        event.preventDefault();
        if (step === 2) {
            setModalIsOpen(true);
            return;
        }

        navigate('/customer/dashboard');
    };
    
    const handleCheckedItemsChange = (newCheckedItems) => {
        setCheckedItems(newCheckedItems);
    };

    const handleButton2Click = (event) => {
        event.preventDefault();

        const reasons = ['We have a new feature coming soon', 'We have a new teacher joining soon', 'We have a new course coming soon'];
        
        switch (step) {
            case 1:
                if (showList && checkedItems.length === 0) {
                    toast.error('Please select an option before proceeding.');
                    return;
                }

                if (checkedItems[0]) {
                    setStep(2);
                    setShowCheckboxes(false);
                    setShowList(false);
                    setTitle("Let’s Make It Affordable For You");
                    setText("We're sorry to hear that you find our classes too expensive. We might be able to help you out.");
                    setButtonText1("Get Affordable Package");
                    setButtonText2("Still Want To Cancel");
                    setChangeMind(true);
                } else {
                    setStep(3);
                    setShowCheckboxes(false);
                    setShowList(true);
                    setChangeMind(false);
                    setTitle("Reasons Not to Cancel");
                    setText("We’re sorry that you’re thinking of leaving. Here are some reasons not to cancel the subscription");
                    setList(reasons); 
                    setButtonText1("Keep Subscription");
                    setButtonText2("No, I want to cancel");
                }
                break;
            case 2:
                setStep(3);
                setShowCheckboxes(false);
                setShowList(true);
                setChangeMind(false);
                setTitle("Reasons Not to Cancel");
                setText("We’re sorry that you’re thinking of leaving. Here are some reasons not to cancel the subscription");
                setList(reasons); 
                setButtonText1("Keep Subscription");
                setButtonText2("No, I want to cancel");
                break;
            case 3:
                toast.success('Your subscription is canceled successfully.\nHowever, you can enjoy our services till 4th Oct, as per your billing cycle.', {
                    onClose: () => navigate('/customer/dashboard')
                });
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        <div>
            <div className='w-full pl-6 pr-6'>
                <Breadcrumb items={[
                    { name: 'Student Profile', link: '/customer/transaction-billing' },
                    { name: 'Cancel Subscription', active: true }
                ]} />
            </div>

            <div className='mt-20 md:mt-8 mb-4'>
                <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                    <div className='w-full  flex items-center justify-center'>
                        <CancelSubscriptionComponent
                            step={step}
                            title={title}
                            text={text}
                            checkboxes={showCheckboxes}
                            list={list}
                            listShow={showList}
                            buttonText1={buttonText1}
                            buttonText2={buttonText2}
                            onButton1Click={handleButton1Click}
                            onButton2Click={handleButton2Click}
                            changeMind={changeMind}
                            onCheckedItemsChange={handleCheckedItemsChange}
                            className="text-center"
                        />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Discount Modal"
                className="model-content"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        width: '90%',
                        maxWidth: '400px',
                        height: '300px',
                        margin: 'auto',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '06px',
                        backgroundColor: 'white',
                    }
                }}
            >
                <h2 className='font-semibold text-lg mb-3'>Congratulations!</h2>
                <p className='text-center mb-6'>You can now use this coupon to avail an amazing discount of 20% in your current plan.</p>
                <FaGift size={30} />
                <div className="font-semibold mt-2 mb-3">Summer20%</div>
                <div className='flex flex-row justify-between space-x-4 w-full'>
                    <CustomButton
                        customClass="bg-gray-300 rounded-md flex-grow w-full"
                        onClick={() => setModalIsOpen(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton
                        customClass="bg-green text-white flex-grow w-full"
                        onClick={() => {
                            setModalIsOpen(false);
                            navigate('/customer/dashboard');
                        }}
                    >
                        Proceed
                    </CustomButton>
                </div>
            </Modal>
        </div>
    )
}

export default CancelSubscription