import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        authSuccess(state, action) {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token || null;
            state.error = null;
        },
        authFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        logoutSuccess(state) {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
        },
        setInitialized(state, action) {
            state.isInitialized = true;
            if (action.payload) {
                state.user = action.payload.user;
                state.token = action.payload.token || null;
            } else {
                state.user = null;
                state.token = null;
            }
        },
        clearAuthError(state) {
            state.error = null;
        }
    }
});

export const {
    authStart,
    authSuccess,
    authFailure,
    logoutSuccess,
    setInitialized,
    clearAuthError
} = authSlice.actions;

export default authSlice.reducer;
