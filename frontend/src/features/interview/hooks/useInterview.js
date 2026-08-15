import { useState, useCallback } from 'react';
import {
  scheduleInterviewApi,
  joinInterviewApi,
  getInterviewByApplicationApi,
  getMyInterviewsApi,
  cancelInterviewApi,
} from '../services/interviewApi';

export const useInterview = () => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myInterviews, setMyInterviews] = useState([]);
  const [error, setError] = useState(null);

  const scheduleInterview = useCallback(async ({ applicationId, scheduledAt, title }) => {
    setIsScheduling(true);
    setError(null);
    try {
      const data = await scheduleInterviewApi({ applicationId, scheduledAt, title });
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to schedule interview';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsScheduling(false);
    }
  }, []);

  const joinInterview = useCallback(async (interviewId) => {
    setIsJoining(true);
    setError(null);
    try {
      const data = await joinInterviewApi(interviewId);
      return data.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to join interview';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsJoining(false);
    }
  }, []);

  const fetchInterviewByApplication = useCallback(async (applicationId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInterviewByApplicationApi(applicationId);
      return data.data;
    } catch (err) {
      if (err?.response?.status === 404) return null;
      const msg = err?.response?.data?.message || err.message || 'Failed to fetch interview';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyInterviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyInterviewsApi();
      setMyInterviews(data.data || []);
      return data.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to fetch interviews';
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelInterview = useCallback(async (interviewId) => {
    setError(null);
    try {
      const data = await cancelInterviewApi(interviewId);
      return data.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to cancel interview';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    isScheduling,
    isJoining,
    isLoading,
    myInterviews,
    error,
    scheduleInterview,
    joinInterview,
    fetchInterviewByApplication,
    fetchMyInterviews,
    cancelInterview,
  };
};
