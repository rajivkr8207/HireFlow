import api from '../../../lib/api';

export const jobService = {
    async createJob(jobData) {
        const response = await api.post('/job/create', jobData);
        return response.data;
    },

    async getAllJobs() {
        const response = await api.get('/job/getAllJobPosting');
        return response.data;
    },

    async getJobDetail(id) {
        const response = await api.get(`/job/getJobposting/${id}`);
        return response.data;
    },

    async updateJob(id, jobData) {
        const response = await api.put(`/job/updateJobPosting/${id}`, jobData);
        return response.data;
    },

    async deleteJob(id) {
        const response = await api.delete(`/job/deleteJobPosting/${id}`);
        return response.data;
    },

    async openJob(id) {
        const response = await api.put(`/job/OpenjobPosting/${id}`);
        return response.data;
    },

    async closeJob(id) {
        const response = await api.put(`/job/ClosejobPosting/${id}`);
        return response.data;
    },

    async holdJob(id) {
        const response = await api.put(`/job/HoldjobPosting/${id}`);
        return response.data;
    },

    async getJobApplicants(jobId) {
        const response = await api.get(`/job/${jobId}/applicants`);
        return response.data;
    },

    async updateApplicantStatus(applicationId, status) {
        const response = await api.patch('/job/application-status/' + applicationId, { status });
        return response.data;
    },
};
