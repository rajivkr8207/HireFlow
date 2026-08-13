import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/auth.slice.js'
import jobpostingReducer from './features/jobposting/jobposting.slice.js'
import applicantReducer from './features/applicant/applicant.slice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobposting: jobpostingReducer,
        applicant: applicantReducer,
    },
})