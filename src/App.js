import React, { useEffect, lazy, Suspense } from 'react';
import { 
    BrowserRouter, Routes, Route, useNavigate
} from 'react-router-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setLoading } from './store/authSlice';
import { getStudents } from './store/studentsSlice';
import { logout } from './store/authActions';
import api from './utils/api';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from './utils/ErrorBoundary';

import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfLoggedIn from './utils/RedirectIfLoggedIn';

import { USER_TYPES } from '../src/data/TextConstants';

import { useStateContext } from './contexts/ContextProvider';
import './App.css';

// Import the necessary modules from react-stripe-js
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Loader from './components/loader/Spinner';

// eslint-disable-next-line import/first
const Signup = lazy(() => import('./pages/auth/Signup'));
// eslint-disable-next-line import/first
const AfterSuccessfulSignup = lazy(() => import('./pages/auth/AfterSuccessfulSignup'));
// eslint-disable-next-line import/first
const EmailVerification = lazy(() => import('./pages/auth/EmailVerification'));
// eslint-disable-next-line import/first
const Login = lazy(() => import('./pages/auth/Login'));
// eslint-disable-next-line import/first
const Onboarding = lazy(() => import('./pages/customer/onboarding/Onboarding'));
// eslint-disable-next-line import/first
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
// eslint-disable-next-line import/first
const ResetPasswordLink = lazy(() => import('./pages/auth/ResetPasswordLink'));
// eslint-disable-next-line import/first
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
// eslint-disable-next-line import/first
const ResetPasswordSuccessful = lazy(() => import('./pages/auth/ResetPasswordSuccessful'));
// eslint-disable-next-line import/first
const Home = lazy(() => import('./pages/Home'));
// eslint-disable-next-line import/first
const Welcome = lazy(() => import('./pages/customer/Welcome'));
// eslint-disable-next-line import/first
const MainLayout = lazy(() => import('./pages/layouts/MainLayout'));
// eslint-disable-next-line import/first
const NoSidebarLayout = lazy(() => import('./pages/layouts/NoSidebarLayout'));
// eslint-disable-next-line import/first
const NotFound = lazy(() => import('./pages/NotFound404'));

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const App = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
    const userType = useSelector(state => state.auth.profile?.user_type);

    // Check if the token has expired
    // If it has, log the user out
    useEffect(() => {
        const tokenStoredTime = localStorage.getItem('tokenStoredTime');
        const expiresIn = localStorage.getItem('tokenexpiresIn');

        if (tokenStoredTime && expiresIn) {
            const expirationTime = Number(tokenStoredTime) + Number(expiresIn) * 1000;
            const currentTime = new Date().getTime();

            // If the current time is less than the expiration time, the token is still valid
            if (currentTime < expirationTime) {
                //console.log('Token is still valid');
            } else {
                dispatch(logout());
            }
        }
    }, [dispatch]);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                dispatch(setLoading(true));
                const response = await api.get('/customer-profile');
                dispatch(setProfile(response.data.data));
                dispatch(setLoading(false));
            } catch (error) {
                console.error('Failed to fetch user profile:', error); 
                dispatch(setLoading(false));
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (userType === USER_TYPES.CUSTOMER && isAuthenticated) {
            try {
                dispatch(getStudents());
            } catch (error) {
                console.error('Failed to fetch students:', error);
            }
        }
    }, [dispatch, isAuthenticated, userType]);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Elements stripe={stripePromise}>
                    <ErrorBoundary>
                        <div>
                            <ToastContainer />
                            <BrowserRouter>
                                <div>
                                    <Suspense fallback={<Loader loading={true} text={'Loading...'} />}>
                                        <Routes>
                                            {/* Auth routes */}
                                            <Route path='/*' element={<RedirectIfLoggedIn />}>
                                                <Route path='signup' element={<Signup />} />
                                                <Route path='verify-your-email' element={<AfterSuccessfulSignup />} />
                                                <Route path='email-verification/:token' element={<EmailVerification />} />
                                                <Route path='login' element={<Login />} />
                                                <Route path='onboarding' element={<Onboarding />} />
                                                <Route path='forgot-password' element={<ForgotPassword />} />
                                                <Route path='reset-password-link' element={<ResetPasswordLink />} />
                                                <Route path='reset-password/:token/:email' element={<ResetPassword />} />
                                                <Route path='reset-password-successful' element={<ResetPasswordSuccessful />} />
                                            </Route>

                                            <Route path="/" element={<Home />} />

                                            {/* Customer Routes */}
                                            <Route path="/*" element={<ProtectedRoute />}>
                                                <Route path='customer/welcome' element={<Welcome />} />
                                                <Route path='customer/*' element={<MainLayout userType={USER_TYPES.CUSTOMER} />} />
                                                <Route path='customer/student/*' element={<NoSidebarLayout userType={USER_TYPES.CUSTOMER} />} />
                                                <Route path='customer/help/*' element={<NoSidebarLayout userType={USER_TYPES.CUSTOMER} />} />
                                            </Route>

                                            {/* Student Routes */}
                                            <Route path="/*" element={<ProtectedRoute />}>
                                                <Route path='student/:studentName/*' element={<MainLayout userType={USER_TYPES.STUDENT} />} />
                                                <Route path='student/:StudentName/class/*' element={<NoSidebarLayout userType={USER_TYPES.STUDENT} />} />
                                            </Route>

                                            {/* Teacher Routes */}
                                            <Route path="/*" element={<ProtectedRoute />}>
                                                <Route path='teacher/*' element={<MainLayout userType={USER_TYPES.TEACHER} />} />
                                                <Route path='teacher/:TeacherName/class/*' element={<NoSidebarLayout userType={USER_TYPES.TEACHER} />} />
                                            </Route>

                                            {/* display 404 page */}
                                            <Route path="*" element={<NotFound /> } />
                                        </Routes>
                                    </Suspense>
                                </div>
                            </BrowserRouter>
                        </div>
                    </ErrorBoundary>
                </Elements>
            </PersistGate>
        </Provider>
    );
}

export default App 