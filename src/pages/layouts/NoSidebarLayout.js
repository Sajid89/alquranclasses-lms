import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar } from '../../components';

import { useStateContext } from '../../contexts/ContextProvider';
import { StudentContext } from '../../contexts/StudentContext';

import { USER_TYPES } from '../../data/TextConstants';
import { CustomerOtherRoutes } from '../../utils/routes/CustomerRoutes';

import { studentOtherRoutes } from '../../utils/routes/StudentRoutes';
import { TeacherOtherRoutes } from '../../utils/routes/TeacherRoutes';

const NoSidebarLayout = ({ userType }) => {
    const [studentName, setStudentName] = useState("");
    const { activeMenu } = useStateContext();

    let routes;
    switch (userType) {
        case USER_TYPES.CUSTOMER:
            routes = CustomerOtherRoutes;
            break;
        case USER_TYPES.STUDENT:
            routes = studentOtherRoutes;
            break;
        case USER_TYPES.TEACHER:
            routes = TeacherOtherRoutes;
            break;
        default:
            routes = [];
    }

    return (
        <StudentContext.Provider value={{ studentName, setStudentName }}>
            <div className='flex relative bg:bg-main-dark-bg'>
                <div className='dark:bg-main-bg bg-main-bg 
                    min-h-screen w-full'>
                    {!(userType === 'student' || userType === 'teacher') && (
                        <div className='fixed md:static bg-green dark:bg-main-dark-bg navbar w-full'>
                            <Navbar showMenuButton={false} dotColor={"#eab308"} color={"white"} />
                        </div>
                    )}
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </StudentContext.Provider>
    );
}

export default NoSidebarLayout;