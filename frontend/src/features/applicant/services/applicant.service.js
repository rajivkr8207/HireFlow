import api from '../../../lib/api';

export const applicantService = {
    async getAllJobs(params = {}) {
        const response = await api.get('/applicant/jobs', { params });
        return response.data;
    },

    async applyJob(data) {
        const config = data instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await api.post('/applicant/apply', data, config);
        return response.data;
    },

    async getMyApplications(params = {}) {
        const response = await api.get('/applicant/my-applications', { params });
        return response.data;
    },

    async withdrawApplication(id) {
        const response = await api.patch(`/applicant/withdraw/${id}`);
        return response.data;
    },
};
