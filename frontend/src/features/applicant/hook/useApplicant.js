import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
    applicantStart,
    jobsLoaded,
    myApplicationsLoaded,
    applicationSubmitted,
    applicationWithdrawn,
    applicantFailure,
    clearApplicantError,
} from '../applicant.slice';
import { applicantService } from '../services/applicant.service';

export const useApplicant = () => {
    const dispatch = useDispatch();
    const {
        jobs,
        pagination,
        myApplications,
        myApplicationsPagination,
        isLoading,
        error,
    } = useSelector((state) => state.applicant);

    const fetchJobs = useCallback(
        async (params = {}) => {
            try {
                dispatch(applicantStart());
                const res = await applicantService.getAllJobs(params);
                dispatch(jobsLoaded(res.data));
                return res.data;
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to fetch jobs';
                dispatch(applicantFailure(msg));
                throw err;
            }
        },
        [dispatch]
    );

    const fetchMyApplications = useCallback(
        async (params = {}) => {
            try {
                dispatch(applicantStart());
                const res = await applicantService.getMyApplications(params);
                dispatch(myApplicationsLoaded(res.data));
                return res.data;
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to fetch applications';
                dispatch(applicantFailure(msg));
                throw err;
            }
        },
        [dispatch]
    );

    const applyJob = useCallback(
        async (applicationData) => {
            try {
                dispatch(applicantStart());
                const res = await applicantService.applyJob(applicationData);
                dispatch(applicationSubmitted(res.data));
                // Refetch applications to keep full populated structure in sync
                await applicantService.getMyApplications({ page: 1, limit: 20 }).then((r) => {
                    dispatch(myApplicationsLoaded(r.data));
                });
                return res.data;
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to submit application';
                dispatch(applicantFailure(msg));
                throw err;
            }
        },
        [dispatch]
    );

    const withdrawApp = useCallback(
        async (id) => {
            try {
                dispatch(applicantStart());
                const res = await applicantService.withdrawApplication(id);
                dispatch(applicationWithdrawn(res.data));
                return res.data;
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to withdraw application';
                dispatch(applicantFailure(msg));
                throw err;
            }
        },
        [dispatch]
    );

    const getApplicationForJob = useCallback(
        (jobId) => {
            if (!myApplications || !Array.isArray(myApplications)) return null;
            return myApplications.find(
                (app) => (app.jobId?._id === jobId || app.jobId === jobId) && app.status !== 'withdrawn'
            );
        },
        [myApplications]
    );

    const clearError = useCallback(() => {
        dispatch(clearApplicantError());
    }, [dispatch]);

    return {
        jobs,
        pagination,
        myApplications,
        myApplicationsPagination,
        isLoading,
        error,
        fetchJobs,
        fetchMyApplications,
        applyJob,
        withdrawApp,
        getApplicationForJob,
        clearError,
    };
};
