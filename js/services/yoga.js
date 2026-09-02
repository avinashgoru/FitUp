import { api } from './api.js';

class YogaService {
    async getLibrary(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return api.get(`/yoga${queryParams ? `?${queryParams}` : ''}`);
    }

    async getDetail(slug) {
        return api.get(`/yoga/detail/${slug}`);
    }

    async getRecommended() {
        return api.get('/yoga/recommended');
    }

    async startSession(practiceId) {
        return api.post('/yoga/sessions', { practiceId });
    }

    async completeSession(sessionId) {
        return api.post(`/yoga/sessions/${sessionId}/complete`, {});
    }

    async getRecentSessions() {
        return api.get('/yoga/sessions');
    }
}

export const yogaService = new YogaService();
