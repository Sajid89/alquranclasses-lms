import React, { useState, useEffect } from 'react';
import { TicketViewSkeletonLoader } from '../../../components';

const ScheduleTabs = ({ data, loading=false }) => {
    const [activeTab, setActiveTab] = useState('today');

    return (
        <div className='shadow'>
            <div className="flex border-b">
                <button 
                    className={`w-1/2 py-3 px-4 ${activeTab === 'today' ? 'border-b-2 green-border text-green' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('today')}
                >
                    Today
                </button>
                <button 
                    className={`w-1/2 py-3 px-4 ${activeTab === 'upcoming' ? 'border-b-2 green-border text-green' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
            </div>
            <div className="max-h-screen overflow-auto">
                {activeTab === 'today' && (
                    loading ? (
                        <TicketViewSkeletonLoader />
                    ) : (
                        data.today.length === 0 ? (
                            <div className='p-3'>
                                <p>No classes for today.</p>
                            </div>
                        ) : (data.today.map((item, index) => (
                                <div key={index} className="flex items-center p-3">
                                    <div className="mr-3 text-center px-3 py-2 font-semibold 
                                        bg-light-green rounded-full">
                                        <div className="text-1xl text-green">{item.date}</div>
                                        <div className='text-green'>{item.month}</div>
                                    </div>
                                    <div className="mr-3">
                                        <div className='font-semibold'>{item.courseName}</div>
                                        <div className='text-gray-500 text-xs my-0.5'>{item.time}</div>
                                        <div className="flex items-center">
                                            <img className="w-5 h-5 rounded-full mr-1" src={item.profilePic} alt={item.studentName} />
                                            <div className='text-xs font-semibold'>{item.studentName}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )
                )}
                {activeTab === 'upcoming' && (
                    loading ? (
                        <TicketViewSkeletonLoader />
                    ) : (
                        data.upcoming.length === 0 ? (
                            <div className='p-3'>
                                <p>No upcoming classes.</p>
                            </div>
                        ) : (
                            data.upcoming.map((item, index) => (
                                <div key={index} className="flex items-center p-3">
                                    <div className="mr-3 text-center px-3 py-2 font-semibold bg-light-green rounded-full">
                                        <div className="text-1xl text-green">{item.date}</div>
                                        <div className='text-green'>{item.month}</div>
                                    </div>
                                    <div className="mr-3">
                                        <div className='font-semibold'>{item.courseName}</div>
                                        <div className='text-gray-500 text-xs my-0.5'>{item.time}</div>
                                        <div className="flex items-center">
                                            <img className="w-5 h-5 rounded-full mr-1" src={item.profilePic} alt={item.studentName} />
                                            <div className='text-xs font-semibold'>{item.studentName}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )
                )}
            </div>
        </div>
    );
}

export default ScheduleTabs;