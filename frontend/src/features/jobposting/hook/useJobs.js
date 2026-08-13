import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
    jobStart,
    jobsLoaded,
    jobLoaded,
    jobCreated,
    jobUpdated,
    jobDeleted,
    jobFailure,
    clearCurrentJob,
    clearJobError,
} from '../jobposting.slice';
import { jobService } from '../services/jobposting.service';

export const useJobs = () => {
    const dispatch = useDispatch();
    const { jobs, currentJob, isLoading, error } = useSelector((state) => state.jobposting);

    const fetchJobs = useCallback(async () => {
        try {
            dispatch(jobStart());
            const data = await jobService.getAllJobs();
            dispatch(jobsLoaded(data.data));
            return data.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to fetch jobs';
            dispatch(jobFailure(msg));
            throw err;
        }
    }, [dispatch]);

    const fetchJobDetail = useCallback(async (id) => {
        try {
            dispatch(jobStart());
            const data = await jobService.getJobDetail(id);
            dispatch(jobLoaded(data.data));
            return data.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to fetch job';
            dispatch(jobFailure(msg));
            throw err;
        }
    }, [dispatch]);

    const createJob = useCallback(async (jobData) => {
        try {
            dispatch(jobStart());
            const data = await jobService.createJob(jobData);
            dispatch(jobCreated(data.data));
            return data.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create job';
            dispatch(jobFailure(msg));
            throw err;
        }
    }, [dispatch]);

    const updateJobStatus = useCallback(async (id, status) => {
        try {
            dispatch(jobStart());
            let data;
            if (status === 'open') data = await jobService.openJob(id);
            else if (status === 'closed') data = await jobService.closeJob(id);
            else if (status === 'hold') data = await jobService.holdJob(id);
            const updatedData = await jobService.getJobDetail(id);
            dispatch(jobUpdated(updatedData.data));
            return updatedData.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to update status';
            dispatch(jobFailure(msg));
            throw err;
        }
    }, [dispatch]);

    const removeJob = useCallback(async (id) => {
        try {
            dispatch(jobStart());
            await jobService.deleteJob(id);
            dispatch(jobDeleted(id));
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to delete job';
            dispatch(jobFailure(msg));
            throw err;
        }
    }, [dispatch]);

    const fetchJobApplicants = useCallback(async (jobId) => {
        try {
            const res = await jobService.getJobApplicants(jobId);
            return res.data;
        } catch (err) {
            throw err;
        }
    }, []);

    const changeApplicantStatus = useCallback(async (applicationId, status) => {
        try {
            const res = await jobService.updateApplicantStatus(applicationId, status);
            return res.data;
        } catch (err) {
            throw err;
        }
    }, []);

    const resetCurrentJob = useCallback(() => {
        dispatch(clearCurrentJob());
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearJobError());
    }, [dispatch]);

    return {
        jobs,
        currentJob,
        isLoading,
        error,
        fetchJobs,
        fetchJobDetail,
        createJob,
        updateJobStatus,
        removeJob,
        fetchJobApplicants,
        changeApplicantStatus,
        resetCurrentJob,
        clearError,
    };
};
