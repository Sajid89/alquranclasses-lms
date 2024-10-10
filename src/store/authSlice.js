import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from './authActions';

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    accessToken: localStorage.getItem('accessToken') || null,
    tokenexpiresIn: localStorage.getItem('tokenexpiresIn') || null,
    profile: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.accessToken = null;
                state.tokenexpiresIn = null;
                state.error = action.error.message;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.accessToken = null;
                state.tokenexpiresIn = null;
                state.profile = null; 
            });
    },
});

export const { setProfile, setLoading } = authSlice.actions;

export default authSlice.reducer;