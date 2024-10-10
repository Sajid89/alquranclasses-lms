import React from 'react';
import { AiFillFile, AiOutlineMessage } from 'react-icons/ai';
import { 
    TicketViewSkeletonLoader
} from '../../components';

const ActivityCard = ({ 
    activity, loading 
}) => {
    return (
        loading ? (
            <TicketViewSkeletonLoader />
        ) : (
            <>
                <div className="w-full border border-gray-200 b-1 rounded-md p-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <img src={activity.profilePic} alt="Teacher" className="w-8 h-8 rounded-full" />
                        <div>
                            <div><span className='font-semibold'>{activity.name}</span> {activity.type === 'message' ? 'sent' : 'added'} a new {activity.type}.</div>
                            <div className="text-xs text-gray-400">{activity.timestamp}</div>
                        </div>
                    </div>
                    <div className="pl-10 mt-2">
                        <div className="flex items-center space-x-2 p-2">
                            <div className='w-8 h-8 bg-light-green rounded-full flex items-center justify-center'>
                                {activity.type === 'file' ? <AiFillFile className='w-4 h-4 text-green' /> : <AiOutlineMessage className='w-4 h-4 text-green' />}
                            </div>
                            <div>
                                <div>{activity.activity.name}</div>
                                {activity.type === 'file' && (
                                    <div className="text-xs text-gray-400">
                                        {(activity.activity.size / 1024).toFixed(2)} MB
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <div className='mt-2 bg-green max-w-max px-2 py-1 rounded-md text-white'>
                            {activity.course}
                        </div> */}
                    </div>
                </div>
            </>
        )
    );
};

export default ActivityCard;