import { fetchApi } from './api.js';

export const mealLogService = {
    async logMeal(mealId, servingCount = 1) {
        const response = await fetchApi(`/meals/log`, {
            method: 'POST',
            body: JSON.stringify({ mealId, servingCount })
        });
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async getRecentLogs() {
        const response = await fetchApi(`/meals/logs`);
        if (response.error) throw new Error(response.error.message);
        return response.data;
    }
};
