import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineSmile } from 'react-icons/ai';
import CustomButton from '../../generic/CustomButton';

const CancelSubscriptionComponent = ({ 
    title, text, checkboxes, list, buttonText1, buttonText2, step,
    onButton1Click, onButton2Click, listShow, changeMind, onCheckedItemsChange
}) => {
    
    const [checkedItems, setCheckedItems] = useState(list.map(() => false));

    const handleCheckChange = index => {
        const newCheckedItems = checkedItems.map((item, i) => (i === index ? !item : item));
        setCheckedItems(newCheckedItems);
        onCheckedItemsChange(newCheckedItems);
    };
    
    return (
        <div className='lg:w-6/12 text-center'>
            <h3 className='font-semibold text-lg w-full mb-2'>{title}</h3>
            <p className='mb-6'>{text}</p>

            {listShow && list.map((item, index) => (
                <div 
                    key={index} 
                    className={`border-1 rounded-md p-2 mb-2 flex items-center ${checkedItems[index] && step !== 3 ? 'bg-green text-white' : 'border-gray-200'}`}
                >
                    {checkboxes ? (
                        <div 
                            className={`w-5 h-5 mr-2 border rounded flex items-center justify-center cursor-pointer ${checkedItems[index] ? 'border-white bg-green' : 'bg-white'}`} 
                            onClick={() => handleCheckChange(index)}
                        >
                            {checkedItems[index] && <AiOutlineCheck className="text-white" />}
                        </div>
                    ) : (
                        <AiOutlineSmile className='text-green mr-2' size={24} />
                    )}
                    <span>{item}</span>
                </div>
            ))}

            <form className='flex justify-between'>
                <CustomButton 
                    customClass='mt-4 shadow bg-dark-green hover:bg-green text-white' 
                    onClick={onButton1Click}
                >
                    {buttonText1}
                </CustomButton>
                <CustomButton 
                    customClass='mt-4 shadow bg-transparent hover:bg-transparent text-green' 
                    onClick={onButton2Click}
                >
                    {buttonText2}
                </CustomButton>
            </form>

            <div className='text-center mt-6'>
                {changeMind && (
                    <Link to='/customer/dashboard'>
                        <span className='text-green text-xs font-semibold underline'>
                            I changed my Mind, I want to keep Subscription
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default CancelSubscriptionComponent;