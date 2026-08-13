import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    jobs: [],
    currentJob: null,
    isLoading: false,
    error: null,
};

const jobpostingSlice = createSlice({
    name: 'jobposting',
    initialState,
    reducers: {
        jobStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        jobsLoaded(state, action) {
            state.isLoading = false;
            state.jobs = action.payload;
            state.error = null;
        },
        jobLoaded(state, action) {
            state.isLoading = false;
            state.currentJob = action.payload;
            state.error = null;
        },
        jobCreated(state, action) {
            state.isLoading = false;
            state.jobs.unshift(action.payload);
            state.error = null;
        },
        jobUpdated(state, action) {
            state.isLoading = false;
            state.jobs = state.jobs.map((j) =>
                j._id === action.payload._id ? action.payload : j
            );
            if (state.currentJob?._id === action.payload._id) {
                state.currentJob = action.payload;
            }
            state.error = null;
        },
        jobDeleted(state, action) {
            state.isLoading = false;
            state.jobs = state.jobs.filter((j) => j._id !== action.payload);
            if (state.currentJob?._id === action.payload) {
                state.currentJob = null;
            }
            state.error = null;
        },
        jobFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearCurrentJob(state) {
            state.currentJob = null;
        },
        clearJobError(state) {
            state.error = null;
        },
    },
});

export const {
    jobStart,
    jobsLoaded,
    jobLoaded,
    jobCreated,
    jobUpdated,
    jobDeleted,
    jobFailure,
    clearCurrentJob,
    clearJobError,
} = jobpostingSlice.actions;

export default jobpostingSlice.reducer;
