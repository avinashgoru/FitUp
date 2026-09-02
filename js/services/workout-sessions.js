import { fetchApi } from './api.js';

export const workoutSessionService = {
    async startSession(workoutId) {
        const response = await fetchApi('/workouts/sessions', {
            method: 'POST',
            body: JSON.stringify({ workoutId })
        });
        if (response.error) throw new Error(response.error.message);
        return response.data;
    },

    async completeSession(sessionId) {
        const response = await fetchApi(`/workouts/sessions/${sessionId}/complete`, {
            method: 'POST'
        });
        if (response.error) throw new Error(response.error.message);
        return response.data;
    }
};
