import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { USER_TYPES } from '../data/TextConstants';
import { Spinner } from '../components';

const RedirectIfLoggedIn = () => {
    const { isLoggedIn, isLoading } = useSelector(state => state.auth);
    const userType = useSelector(state => state.auth.profile?.user_type);
    console.log(userType);

    if (isLoading) {
        return <Spinner loading={true} text={"Dashbaord loading..."} />;
    }

    return isLoggedIn && userType 
        ? (userType === USER_TYPES.TEACHER 
            ? <Navigate to="/teacher/dashboard" replace /> 
            : <Navigate to="/customer/welcome" replace />
          ) 
        : <Outlet />;
};

export default RedirectIfLoggedIn;