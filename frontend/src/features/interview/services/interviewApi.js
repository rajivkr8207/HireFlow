import api from '../../../lib/api';

export const scheduleInterviewApi = async ({ applicationId, scheduledAt, title }) => {
  const response = await api.post('/interview/schedule-interview', {
    applicationId,
    scheduledAt,
    title,
  });
  return response.data;
};

export const joinInterviewApi = async (interviewId) => {
  const response = await api.get(`/interview/join-interview/${interviewId}`);
  return response.data;
};

export const getInterviewByIdApi = async (interviewId) => {
  const response = await api.get(`/interview/get-interview/${interviewId}`);
  return response.data;
};

export const getInterviewByApplicationApi = async (applicationId) => {
  const response = await api.get(`/interview/application/${applicationId}`);
  return response.data;
};

export const getMyInterviewsApi = async () => {
  const response = await api.get('/interview/my-interviews');
  return response.data;
};

export const cancelInterviewApi = async (interviewId) => {
  const response = await api.post('/interview/cancel-interview', { interviewId });
  return response.data;
};
