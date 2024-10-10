import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowBack } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authActions';

import avatar from '../../data/placedolder_avatar.jpg';
import { Notification, UserProfile } from '..';
import { useStateContext } from '../../contexts/ContextProvider';
import { StudentContext } from '../../contexts/StudentContext';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title}
        position="BottomCenter">
        <button type="button" onClick={customFunc}
            style={{ color }}
            className="relative text-xl rounded-full 
            hover:bg-light-gray"
        >
            <span style={{ background: dotColor, top: '0.4rem', right: '0.45rem'}}
                className="absolute inline-flex rounded-full 
                h-1.5 w-1.5" 
            />
            {icon}
        </button>
    </TooltipComponent>
);

const Navbar = ({showMenuButton, dotColor = "#01563F", color = "black"}) => {
    const profile = useSelector(state => state.auth.profile);
    let context = useContext(StudentContext);
    let studentName = context ? context.studentName : '';
    
    const { setActiveMenu, 
        isClicked, setIsClicked,
        screenSize, setScreenSize
    } = useStateContext();

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let newStudent = query.get("newStudent");
    let changeTeacher = query.get("changeTeacher");
    let buySubscritionAfterTrial = query.get("buySubscritionAfterTrial");
    let student = query.get("student");

    let backLink;
    const ticketRoutePattern = /\/customer\/help\/ticket\/\d+/;

    switch (true) {
        case location.pathname === '/customer/help/customer-support':
            backLink = '/customer/dashboard';
            break;
        case location.pathname === '/customer/help/create-ticket':
        case ticketRoutePattern.test(location.pathname):
            backLink = '/customer/help/customer-support';
            break;
        case location.pathname === '/customer/student/change-teacher':
            backLink = '/customer/dashboard';
            break;
        case location.pathname === '/customer/student/add-availability' && changeTeacher === 'true':
            backLink = '/customer/student/change-teacher';
            break;
        case location.pathname === '/customer/student/add-availability' && buySubscritionAfterTrial === 'true':
            backLink = `/customer/student-profile/${student}`;
            break;
        case location.pathname === '/customer/student/add-availability':
            backLink = newStudent === 'false' ? `/customer/student/${studentName}/add-student/` : '/customer/student/add-student';
            break;
        default:
            backLink = '/customer/welcome';
            break;
    }

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set active menu based on screen size
    useEffect(() => {
        if (screenSize > 900) {
          setActiveMenu(true);
        } else {
          setActiveMenu(false);
        }
    }, [screenSize]);

    const handleLogout = (event) => {
        event.preventDefault();
        setIsClicked(prevState => ({ ...prevState, userProfile: false }));
        dispatch(logout());
    };

    const handleClose = () => {
        setIsClicked(prevState => ({ ...prevState, userProfile: false }));
    };

    const handleBackNavigation = () => {
        if (location.pathname === '/customer/student/add-availability') {
            navigate(backLink, { state: { fromSecondStep: true } });
        } else {
            navigate(backLink);
        }
    };

    return (
        <div className="flex justify-between px-6 md:px-0 py-4 md:pt-6 md:mx-6 relative">
            {showMenuButton ? (
                <NavButton
                    title="Menu"
                    customFunc={() => setActiveMenu((prevActiveMneu) => !prevActiveMneu)}
                    color="#01563F"
                    icon={<AiOutlineMenu />}
                />
            ) : (
                <button onClick={handleBackNavigation}>
                    <div className="bg-white rounded-full w-8 h-8 flex justify-center items-center">
                        <IoIosArrowBack />
                    </div>
                </button>
            )}

            <div className='flex items-center gap-x-2'>
                <NavButton 
                    title="Notification"
                    dotColor={dotColor}
                    customFunc={() => setIsClicked(prevState => ({...prevState, notification: !prevState.notification}))}
                    color={color}
                    icon={<IoNotificationsOutline  />}
                />
                {isClicked.notification && <Notification />}

                <TooltipComponent 
                    content="Profile"
                    position="BottomCenter"
                >
                    <div className="flex items-center gap-2 
                        cursor-pointer p-1 rounded-lg"
                        onClick={() => setIsClicked(prevState => ({...prevState, userProfile: !prevState.userProfile}))}
                    >
                        <img 
                            src={ profile && profile.profile_photo_path ? profile.profile_photo_path : avatar }
                            alt="Avatar" 
                            className="w-8 h-8 rounded-full" 
                        />
                        <p>
                            <span className={`text-14 ${showMenuButton ? 'text-gray-700' : 'text-gray-300'}`}>
                                Hi, </span> {' '}
                            <span className="text-gray-400 font-bold ml-1 text-14">
                                { profile ? profile.name.split(' ')[0] : '' }
                            </span>
                        </p>
                        <MdKeyboardArrowDown className="text-gray-400 text-14" />
                    </div>
                </TooltipComponent>
                {isClicked.userProfile && <UserProfile handleClick={handleLogout} handleClose={handleClose} />}
            </div>
        </div>
    )
}

export default Navbar