import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const getStudents = createAsyncThunk('students/getAll', async () => {
    const response = await api.get('/get-all-students');
    return response.data;
});

const studentsSlice = createSlice({
    name: 'students',
    initialState: { 
        data: [], 
        loading: false, 
        studentInfo: {}, 
        selectedShifts: [],
        selectedReason: [],
    },
    reducers: {
        clearStudents: () => ({ data: [], loading: false }),
        setStudentInfo: (state, action) => {
            console.log('Payload:', action.payload); // Debug log
            state.studentInfo = action.payload;
        },
        clearStudentInfo: (state) => {
            state.studentInfo = {};
        },
        setSelectedShift: (state, action) => {
            state.selectedShifts = action.payload;
        },
        clearSelectedShift: (state) => {
            state.selectedShifts = [];
        },
        setSelectedReason: (state, action) => {
            state.selectedReason = action.payload;
        },
        clearSelectedReason: (state) => {
            state.selectedReason = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudents.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.loading = false;
            })
            .addCase(getStudents.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { 
    clearStudents, setStudentInfo, clearStudentInfo, 
    setSelectedShift, clearSelectedShift, setSelectedReason, clearSelectedReason 
} = studentsSlice.actions;

export default studentsSlice.reducer;