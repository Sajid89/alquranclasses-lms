import React, { useState } from 'react';
import bgImage from '../../data/images/payment_details.png';
import generalProfile from '../../data/images/general_profile.png';
import homeAddress from '../../data/images/address.png';
import password from '../../data/images/password_setting.png';

const Tabs = ({ tabs, setActiveTab, bankDetails=false, isApproved=false, teacherSettings=false }) => {
    const [activeTabLocal, setActiveTabLocal] = useState(tabs[0].label);

    const handleTabClick = (label) => {
        setActiveTabLocal(label);
        if (setActiveTab) {
            setActiveTab(label);
        }
    };

    return (
        <div className='main-wrap tabs'>
            <div className="flex border-1 border-gray-200">
                {tabs.map((tab, index) => (
                    <button 
                        key={index}
                        className={`w-1/2 py-2 px-3 ${activeTabLocal === tab.label ? (tab.bgColor ? 'bg-green text-white' : 'border-b-2 green-border text-green') : 'text-gray-400'}`}
                        onClick={() => handleTabClick(tab.label)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="max-h-screen overflow-auto">
                <div className='my-6'>
                    {tabs.map((tab, index) => (
                        activeTabLocal === tab.label && 
                        <div 
                            key={index}
                            className='tab-content'
                            style={
                                bankDetails && index === 0 
                                ? { 
                                    backgroundImage: `url(${bgImage})`, 
                                    backgroundPosition: 'right', 
                                    backgroundRepeat: 'no-repeat', 
                                    backgroundSize: 'auto' 
                                } 
                                : teacherSettings 
                                ? {
                                    backgroundImage: `url(${
                                        index === 0 
                                        ? generalProfile 
                                        : index === 1 
                                        ? homeAddress 
                                        : password
                                    })`,
                                    backgroundPosition: 'right', 
                                    backgroundRepeat: 'no-repeat', 
                                    backgroundSize: 'auto'
                                }
                                : {}
                            }
                        >
                            {bankDetails && (
                                <div className='mt-4 mb-4'>
                                    <div className='flex items-center bg-yellow-50 text-yellow-700 p-4' role='alert'>
                                        <svg className='fill-current w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/></svg>
                                        {isApproved ? 
                                            <p>You can’t change this information. However, we give you option to add a new bank account.</p> : 
                                            <p>You request for new bank account information is in review. You’ll be notified when its approved.</p>
                                        }
                                    </div>
                                </div>
                            )}
                            {tab.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Tabs;