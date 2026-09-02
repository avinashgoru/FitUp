import { fetchApi } from './api.js';
import { globalState } from '../app/app-state.js';
import { router } from '../app/router.js';
import { profileService } from './profile.js';

export const authService = {
    async register(email, password, displayName) {
        const response = await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, displayName })
        });
        
        if (response.error) {
            throw new Error(response.error.message || 'Registration failed');
        }
        
        // After success, hydrate session
        await this.hydrateSession();
        return response;
    },

    async login(email, password) {
        const response = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.error) {
            throw new Error(response.error.message || 'Login failed');
        }

        // Hydrate session and navigate
        await this.hydrateSession();
        return response;
    },

    async logout() {
        await fetchApi('/auth/logout', { method: 'POST' });
        
        // Clear state
        globalState.set('user', null);
        globalState.set('isAuthenticated', false);
        globalState.set('authStatus', 'unauthenticated');
        
        router.redirectTo('/login');
    },

    async hydrateSession() {
        try {
            globalState.set('authStatus', 'loading');
            
            const response = await fetchApi('/auth/me', { method: 'GET' });
            
            if (response.error) {
                // Not authenticated
                globalState.set('user', null);
                globalState.set('isAuthenticated', false);
                globalState.set('authStatus', 'unauthenticated');
            } else if (response.data) {
                // Authenticated - now fetch profile sequentially to ensure state is atomic
                globalState.set('user', response.data);
                
                try {
                    await profileService.getProfile();
                } catch (profileError) {
                    // Profile might not exist yet if there was a registration error midway, but backend always creates an empty one.
                    // Fallback to setting it to empty to force incomplete state.
                    console.warn('Profile fetch failed during hydration:', profileError);
                    globalState.set('profile', {});
                }

                globalState.set('isAuthenticated', true);
                globalState.set('authStatus', 'authenticated');
            }
        } catch (error) {
            console.error('Session hydration failed:', error);
            globalState.set('user', null);
            globalState.set('profile', null);
            globalState.set('isAuthenticated', false);
            globalState.set('authStatus', 'unauthenticated');
        }
    }
};
