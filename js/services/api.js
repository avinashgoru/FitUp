/**
 * API Service Boundary
 * Standardizes fetch requests and error normalization for Phase 7.
 */
import { CONFIG } from './config.js';

export const api = {
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async request(endpoint, options = {}) {
        // Scaffold boundary. Do not make real fetch calls yet.
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        console.log(`[API Boundary] Mock ${options.method || 'GET'} request to ${url}`);
        
        // Future error normalization logic belongs here.
        // Returning a mock success contract structure for documentation purposes.
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Required for HttpOnly session cookies (Phase 8)
        };
        return {
            success: true,
            data: null
        };
    }
};
