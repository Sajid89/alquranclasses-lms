import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import recordingIcon from '../../data/icons/lantern.png';
import { AiOutlineArrowRight } from 'react-icons/ai';
import CustomButtonWithIcon from './CustomButtonWithIcon';

const RecordingsBanner = ({ recordings }) => {
    const { studentName } = useParams();
    const navigate = useNavigate();

    if (!recordings) return null;

    return (
        <div className="bg-light-green p-2 mb-4 rounded-md flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img src={recordingIcon} alt="Recording" className="w- h-6" />
                <div>
                    <div className='font-semibold'>Get Recordings</div>
                    <div className="text-xs">Get access to your course recordings up to a month</div>
                </div>
            </div>
            <CustomButtonWithIcon 
                buttonText="Check out plans" 
                buttonColor="green" 
                textColor="white" 
                icon={<AiOutlineArrowRight />} 
                onClick={() => {
                    navigate(`/student/${studentName}/recording-plans`);
                }}
            />
        </div>
    );
};

export default RecordingsBanner;