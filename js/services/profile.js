import { fetchApi } from './api.js';
import { globalState } from '../app/app-state.js';

export const profileService = {
    async getProfile() {
        const response = await fetchApi('/profile', { method: 'GET' });
        if (response.error) {
            throw new Error(response.error.message);
        }
        
        globalState.set('profile', response.data);
        return response.data;
    },

    async updateProfile(preferences) {
        const response = await fetchApi('/profile', {
            method: 'PATCH',
            body: JSON.stringify(preferences)
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        globalState.set('profile', response.data);
        return response.data;
    }
};
