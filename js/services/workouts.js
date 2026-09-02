import { fetchApi } from './api.js';

export const workoutService = {
    async getLibrary(params = {}) {
        const query = new URLSearchParams(params).toString();
        const response = await fetchApi(`/workouts?${query}`);
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async getRecommendations() {
        const response = await fetchApi('/workouts/recommended');
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async getWorkoutDetail(slug) {
        const response = await fetchApi(`/workouts/detail/${slug}`);
        if (response.error) throw new Error(response.error.message);
        return response.data;
    }
};
