/**
 * Route registry for FITUP Application.
 * Defines public vs protected routes and future authentication requirements.
 */

export const ROUTES = {
    HOME: {
        path: '/',
        name: 'home',
        access: 'public',
        isApp: false
    },
    APP_DASHBOARD: {
        path: '/app',
        name: 'dashboard',
        access: 'protected',
        isApp: true
    },
    APP_WORKOUTS: {
        path: '/app/workouts',
        name: 'workouts',
        access: 'protected',
        isApp: true
    },
    APP_MEALS: {
        path: '/app/meals',
        name: 'meals',
        access: 'protected',
        isApp: true
    },
    APP_YOGA: {
        path: '/app/yoga',
        name: 'yoga',
        access: 'protected',
        isApp: true
    },
    APP_PROGRESS: {
        path: '/app/progress',
        name: 'progress',
        access: 'protected',
        isApp: true
    },
    APP_PROFILE: {
        path: '/app/profile',
        name: 'profile',
        access: 'protected',
        isApp: true
    },
    AUTH_LOGIN: {
        path: '/login',
        name: 'login',
        access: 'public',
        isApp: false
    },
    AUTH_SIGNUP: {
        path: '/signup',
        name: 'signup',
        access: 'public',
        isApp: false
    },
    AUTH_ONBOARDING: {
        path: '/onboarding',
        name: 'onboarding',
        access: 'protected',
        isApp: false
    }
};

/**
 * Finds a route by its hash path.
 * @param {string} path - The path to look up (e.g., '/app')
 * @returns {Object|null} The route definition or null if not found.
 */
export function getRouteByPath(path) {
    // Default to HOME if empty
    if (!path || path === '' || path === '/') {
        return ROUTES.HOME;
    }
    
    for (const key in ROUTES) {
        if (ROUTES[key].path === path) {
            return ROUTES[key];
        }
    }
    
    return null;
}
