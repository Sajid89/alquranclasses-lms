import { createSlice } from '@reduxjs/toolkit';

export const trialClassSlice = createSlice({
    name: 'trialClass',
    initialState: {
        wantTrial: false,
    },
    reducers: {
        setWantTrial: (state, action) => {
            state.wantTrial = action.payload;
        },
    },
});

export const { setWantTrial } = trialClassSlice.actions;

export const selectWantTrial = (state) => state.trialClass.wantTrial;

export default trialClassSlice.reducer;