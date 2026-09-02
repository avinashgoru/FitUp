import { fetchApi } from './api.js';

export const mealService = {
    async getLibrary(params = {}) {
        const query = new URLSearchParams(params).toString();
        const response = await fetchApi(`/meals?${query}`);
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async getRecommendations() {
        const response = await fetchApi('/meals/recommended');
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async getMealDetail(slug) {
        const response = await fetchApi(`/meals/detail/${slug}`);
        if (response.error) throw new Error(response.error.message);
        return response.data;
    }
};
