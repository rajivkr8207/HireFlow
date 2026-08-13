import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    myApplications: [],
    myApplicationsPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    isLoading: false,
    error: null,
};

const applicantSlice = createSlice({
    name: "applicant",
    initialState,
    reducers: {
        applicantStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        jobsLoaded(state, action) {
            state.isLoading = false;
            state.jobs = action.payload.jobs;
            state.pagination = action.payload.pagination;
            state.error = null;
        },
        myApplicationsLoaded(state, action) {
            state.isLoading = false;
            state.myApplications = action.payload.applications;
            state.myApplicationsPagination = action.payload.pagination;
            state.error = null;
        },
        applicationSubmitted(state, action) {
            state.isLoading = false;
            state.myApplications.unshift(action.payload);
            state.error = null;
        },
        applicationWithdrawn(state, action) {
            state.isLoading = false;
            state.myApplications = state.myApplications.map((app) =>
                app._id === action.payload._id ? action.payload : app
            );
            state.error = null;
        },
        applicantFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearApplicantError(state) {
            state.error = null;
        },
    },
});

export const {
    applicantStart,
    jobsLoaded,
    myApplicationsLoaded,
    applicationSubmitted,
    applicationWithdrawn,
    applicantFailure,
    clearApplicantError,
} = applicantSlice.actions;

export default applicantSlice.reducer;
