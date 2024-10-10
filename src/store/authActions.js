import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';
import { clearStudents, clearStudentInfo } from './studentsSlice';

export const login = createAsyncThunk('auth/login', async (credentials) => {
    try {
        const result = await authService.login(
            credentials.email, credentials.password,
            credentials.deviceId, credentials.deviceType
        );
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accessToken', result.user.data.access_token);
        localStorage.setItem('tokenexpiresIn', result.user.data.expires_in);
        localStorage.setItem('tokenStoredTime', new Date().getTime().toString());
        return result;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
});

export const setProfile = (profile) => {
    return {
        type: 'SET_PROFILE',
        payload: profile
    }
}

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    authService.logout();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenexpiresIn');
    localStorage.removeItem('tokenStoredTime');
    localStorage.removeItem('hasTourFinished');
    dispatch(clearStudents());
    dispatch(clearStudentInfo());
});
