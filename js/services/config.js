/**
 * Configuration Boundary
 * Stores safe public configuration. SECRETS MUST NEVER BE STORED HERE.
 */
export const CONFIG = {
    // Future deployment configurations
    API_BASE_URL: 'http://localhost:3000', // Phase 7 local backend
    APP_VERSION: '1.0.0',
    ENVIRONMENT: 'development' // 'development' | 'production'
};
