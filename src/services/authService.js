import axios from 'axios';
import { API_BASE_URL } from '../config';

const register = (username, email, password) => {
    return axios.post(API_BASE_URL + '/register', {
        username,
        email,
        password,
    });
};

const login = (email, password, deviceId, deviceType) => {
    return axios
        .post(API_BASE_URL + '/signin', {
            email,
            password,
            device_id: deviceId,
            device_type: deviceType,
        })
        .then((response) => {
            return { isLoggedIn: true, user: response.data };
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
};
