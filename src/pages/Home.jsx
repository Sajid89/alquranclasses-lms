import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { USER_TYPES } from '../data/TextConstants';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth);
    const userType = useSelector(state => state.auth.profile?.user_type);

    useEffect(() => {
        if (isLoggedIn && userType === USER_TYPES.CUSTOMER) {
            navigate('/customer/welcome');
        } else if (isLoggedIn && userType === USER_TYPES.TEACHER) {
            navigate('/teacher/dashboard');
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return null;
}

export default Home;