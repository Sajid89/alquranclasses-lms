import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineDashboard, MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FaChevronDown } from 'react-icons/fa';
import { AiOutlineQuestionCircle, AiOutlineRollback as AiOutlineReturn, AiOutlineLogout } from 'react-icons/ai';

import { 
    sidebarCustomerLinks, sidebarStudentLinks, 
    sidebarTeacherLinks, USER_TYPES 
} from '../../data/TextConstants';
import Logo from '../../data/LOGO.png';
import avatar from '../../data/placedolder_avatar.jpg';
import { useStateContext } from '../../contexts/ContextProvider';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authActions';

const Sidebar = ({ userType }) => {
    let routes;
    
    switch (userType) {
        case USER_TYPES.CUSTOMER:
            routes = sidebarCustomerLinks;
            break;
        case USER_TYPES.STUDENT:
            routes = sidebarStudentLinks;
            break;
        case USER_TYPES.TEACHER:
            routes = sidebarTeacherLinks;
            break;
        default:
            routes = [];
    }

    const dispatch = useDispatch();
    const students = useSelector(state => state.students.data);
    const userProfile = useSelector(state => state.auth.profile);
    
    const { activeMenu, setActiveMenu, screenSize, setScreenSize } = useStateContext(); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Transform the data to fit the table component
    const transformedStudents = students && Array.isArray(students) ? students.map(student => ({
        id: student.id,
        name: student.name,
        profilePic: student.profile_photo_url || avatar
    })) : [];

    // Get current student
    const { studentName } = useParams();
    const [currentStudent, setCurrentStudent] = useState(null);

    useEffect(() => {
        if (students && students.length > 0 && studentName) {
            const foundStudent = students.find(student => student.name.toLowerCase() === studentName.toLowerCase());
            setCurrentStudent(foundStudent);
        } else {
            setCurrentStudent(null);
        }
    }, [studentName, students]);
        
    

    const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-white bg-dark-green text-md m-2";
    const inactiveLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white dark:text-gray-200 dark:hover:text-black hover:bg-dark-green m-2";
    const sidebarItem = "sidebar-item";

    const handleCloseSidebar = () => {
        if (screenSize < 900) {
          setActiveMenu(false);
        }
        setIsDropdownOpen(false);
    }

    const handleToggleDropdown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsDropdownOpen(prev => !prev);
    }

    const handleClick = () => {
        navigate('/customer/help/customer-support');
    }

    return (
        <div className="ml-3 h-screen
            md:overflow-hidden overflow-auto
            md:hover:overflow-auto pb-10">
            {activeMenu && (<>
                <div className="flex justify-between items-center">
                    <Link to="/" onClick={() => setActiveMenu(false)}
                        className="items-center">
                        <img src={Logo} alt="Logo" className="logo" />
                        {/* <span className="text-xl font-bold ml-2">Logo</span> */}
                    </Link>
                    <TooltipComponent content="Menu"
                        position="BottomCenter">
                        <button type="button" 
                            onClick={() => setActiveMenu((prevActiveMneu) => !prevActiveMneu)}
                            className="text-xl rounded-full 
                            p-3 hover:bg-light-gray 
                            block md:hidden text-white"
                        >
                            <MdOutlineCancel size={24} />
                        </button>
                    </TooltipComponent>
                </div>
                <div className="mt-10 pr-4">
                    {routes.map((item) => (
                        <div key={item.title}>
                            {item.links.map((link, index) => (
                                <div key={link.name} className={`sidebar-item-${index + 1} ${link.name === 'Students' ? "relative" : ""}`}>
                                    <NavLink
                                        to={link.name === 'Students' ? 
                                            ('/customer/student-profile' || '/customer/student-details') 
                                            : userType === USER_TYPES.STUDENT
                                                ? `/student/${window.location.pathname.split('/')[2]}/${link.name.replace(' ', '-').replace(/\s/g, '').toLowerCase()}`
                                                : userType === USER_TYPES.TEACHER 
                                                    ? `/${userType}/${link.name.replace(' ', '-').replace(/\s/g, '').toLowerCase()}`
                                                    : `/${userType}/${link.name.replace('&', '-').replace(/\s/g, '').toLowerCase()}`
                                        }
                                        onClick={(event) => {
                                            if (link.name === 'Students') {
                                                event.preventDefault();
                                            }
                                            handleCloseSidebar();
                                        }}
                                        className={({ isActive }) => 
                                        isActive ? `${activeLink} ${sidebarItem} flex-grow text-sm` : `${inactiveLink} ${sidebarItem} flex-grow`}
                                        isActive={(match, location) => {
                                            // Consider the link active if the location pathname includes the path of the link
                                            return location.pathname.includes(`/customer/student-details`);
                                        }}
                                    >
                                        {link.icon}
                                        <span className="capitalize">
                                            {link.name === 'Welcome' ? 'Back to student panel' : link.name}
                                        </span>
                                        {link.name === 'Students' && transformedStudents.length > 0 && (
                                            <button 
                                                className="bg-green-light rounded-md p-1 mr-6 absolute right-0 top-5 transform -translate-y-1/2"
                                                onClick={handleToggleDropdown}
                                            >
                                                <FaChevronDown style={{ width: '14px', height: '14px' }} />
                                            </button>
                                        )}
                                    </NavLink>
                                    {link.name === 'Students' && isDropdownOpen && (
                                        <div className='pl-4'>
                                            {transformedStudents.map((student) => (
                                                <NavLink
                                                    key={student.id}
                                                    to={`/customer/student-profile/${student.name.toLowerCase()}`}
                                                    onClick={handleCloseSidebar}
                                                    className={({ isActive }) => 
                                                        isActive ? `${activeLink} ${sidebarItem}` : `${inactiveLink} ${sidebarItem}`}
                                                >
                                                    <img src={student.profilePic} alt={student.name} className="h-6 w-6 rounded-full" />
                                                    <span className="capitalize">
                                                        {student.name}
                                                    </span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    {userType === USER_TYPES.STUDENT ? (
                        <div className="flex items-center justify-between">
                            {currentStudent && (
                                    <div className='flex justify-between items-center gap-2 mb-3 absolute bottom-0 left-0 right-0 ml-4 mr-4'>
                                        <div className="flex items-center space-x-2">
                                            <img src={currentStudent.profile_photo_url ? currentStudent.profile_photo_url : avatar} 
                                                alt="Profile" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div className='text-white'>{currentStudent.name}</div>
                                                <div className="text-xs text-gray-300">ALQ-STD{currentStudent.id}</div>
                                            </div>
                                        </div>
                                        <Link to="/customer/welcome">
                                            <AiOutlineReturn className="text-white text-2xl" />
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    ) : ( userType != USER_TYPES.TEACHER &&
                        <button 
                            className="flex items-center gap-2 bg-light-green text-green 
                            py-2 px-3 rounded-md absolute bottom-0 mb-3 ml-2"
                            onClick={handleClick}
                        >
                            <AiOutlineQuestionCircle />
                            <span>Contact with Support</span>
                        </button>
                    )}
                </div>
            </>)}
        </div>
    )
}

export default Sidebar