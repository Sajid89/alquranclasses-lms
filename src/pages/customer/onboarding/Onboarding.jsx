import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../data/images/logo.png';
import Mosque from '../../../data/icons/mosque.png';
import Quran from '../../../data/icons/quran.png';
import Quran1 from '../../../data/icons/quran1.png';
import Line from '../../../data/icons/dotted_line.png';
import Line1 from '../../../data/icons/dotted_line_1.png';
import { CustomButton } from '../../../components';

const Onboarding = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    }

    return (
        <div className='flex flex-col py-16 px-10 sm:px-0 main-wrapper'>
            <div className='w-full flex-grow bg-white flex flex-col 
                items-center rounded-bl-10xl justify-center text-center'>
                <img src={Logo} alt="email verification" 
                    className="pb-8" />
                <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                    font-semibold pb-3'>
                    Here are the three simple steps to get started
                </h3>
                <p>
                    Follow the steps written below to get a free trial class. 
                </p>

                <div className='steps-wrap flex flex-col sm:flex-row 
                    items-center justify-center mt-10 mb-4 px-0 md:px-10'>
                    <div className='flex flex-col items-center mb-2 sm:mb-0'>
                        <div className='bg-gray-100 w-40 h-40 rounded-full 
                            flex items-center justify-center mb-4'>
                            <img className='w-20' src={Mosque} alt="mosque" />
                        </div>
                        <p>Add student's Basic 
                            <br /> Information first.</p>
                    </div>
                    <div className='flex items-center justify-center invisible sm:visible'>
                        <img src={Line} alt="line" />
                    </div>
                    <div className='items-center mb-2 sm:mb-0'>
                        <div className='bg-gray-100 w-40 h-40 rounded-full 
                            flex items-center justify-center mb-4'>
                            <img className='w-20' src={Quran} alt="quran" />
                        </div>
                        <p>Choose the course <br /> you want to learn.</p>
                    </div>
                    <div className='flex items-center justify-center invisible sm:visible'>
                        <img src={Line1} alt="line" />
                    </div>
                    <div className='items-center mb-2 sm:mb-0'>
                        <div className='bg-gray-100 w-40 h-40 rounded-full 
                            flex items-center justify-center mb-4'>
                            <img className='w-20' src={Quran1} alt="quran" />
                        </div>
                        <p>Select a feasible <br /> availability for a student. </p>
                    </div>
                </div>

                <div className='mt-2 sm:mt-5'>
                    <CustomButton onClick={handleClick}>Add Student</CustomButton>
                </div>
            </div>

            <div className='youtube-video flex justify-center mt-8'>
                <iframe
                    className='rounded-lg w-full h-auto aspect-w-16 aspect-h-9 md:w-full md:h-64'
                    style={{ maxWidth: '560px' }}
                    src="https://www.youtube.com/embed/9VsEAEX6C9Q?si=n3MBqEzTn2ad3pzS"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    );
}

export default Onboarding;