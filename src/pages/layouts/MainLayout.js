import React from 'react';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Footer, Sidebar, ThemeSettings } from '../../components';
import { Students, Calendar, PaymentSettings, ProfileSettings } from '../../pages';
import { Dashboard } from '../../pages/customer';

import { useStateContext } from '../../contexts/ContextProvider';

import { USER_TYPES } from '../../data/TextConstants';
import { CustomerRoutes } from '../../utils/routes/CustomerRoutes';

import { StudentRoutes }  from '../../utils/routes/StudentRoutes';
import { TeacherRoutes } from '../../utils/routes/TeacherRoutes';

const MainLayout = ({ userType }) => {
    const { activeMenu } = useStateContext();
    let routes;

    switch (userType) {
        case USER_TYPES.CUSTOMER:
            routes = CustomerRoutes;
            break;
        case USER_TYPES.STUDENT:
            routes = StudentRoutes;
            break;
        case USER_TYPES.TEACHER:
            routes = TeacherRoutes;
            break;
        default:
            routes = [];
    }

    return (
        <div className='flex relative bg:bg-main-dark-bg'>
            {/* <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
                <TooltipComponent content="Settings" position='top'>
                    <button type='button' className='text-3xl p-3 hover:drop-shadow-xl 
                        hover:bg-light-gray text-white'
                        style={{ background: '#01563F', borderRadius: '50%' }}>
                        <FiSettings />
                    </button>
                </TooltipComponent>
            </div> */}
            {activeMenu ? (
                <div className='w-18 fixed sidebar dark:bg-secondary-dark-bg bg-green'>
                    <Sidebar userType={userType} />
                </div>    
            ): (
                <div className='w-0 dark:bg-secondary-dark-bg'>
                    <Sidebar userType={USER_TYPES.CUSTOMER} />
                </div>
            )}
            <div className={`dark:bg-main-bg bg-main-bg 
                min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`
            }>
                <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                    {userType !== USER_TYPES.STUDENT  && <Navbar showMenuButton={true} />}
                </div>
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
    );
}

export default MainLayout;