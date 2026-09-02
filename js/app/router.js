import { getRouteByPath, ROUTES } from './routes.js';
import { globalState } from './app-state.js';

/**
 * Hash-based router.
 * Manages transitions between the public marketing shell and the protected application shell.
 */
class Router {
    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    init() {
        window.addEventListener('hashchange', this.handleHashChange);
        // Trigger initial route calculation
        this.handleHashChange();
    }

    handleHashChange() {
        // Extract path from hash, e.g. '#/app' -> '/app'
        // If hash is empty or just '#', default to '/'
        const hash = window.location.hash;
        
        // Exclude purely in-page anchors like #why-fitup, #meals from being treated as full routes
        // A true route should start with #/
        let path = '/';
        if (hash.startsWith('#/')) {
            path = hash.substring(1); // e.g., '/app'
        }

        const route = this.matchRoute(path);
        
        if (route) {
            this.navigate(route);
        } else if (path !== '/') {
            console.warn(`Route not found: ${path}. Redirecting to home.`);
            this.redirectTo('/');
        }
    }

    matchRoute(path) {
        // Direct match
        const staticRoute = this.routes.find(r => r.path === path);
        if (staticRoute) return staticRoute;

        // Dynamic match for workouts
        const workoutMatch = path.match(/^\/app\/workouts\/([a-z0-9-]+)$/);
        if (workoutMatch) {
            return { path, name: 'workout-detail', access: 'protected', isApp: true, params: { slug: workoutMatch[1] } };
        }

        const sessionMatch = path.match(/^\/app\/workouts\/([a-z0-9-]+)\/session$/);
        if (sessionMatch) {
            return { path, name: 'workout-session', access: 'protected', isApp: true, params: { slug: sessionMatch[1] } };
        }

        // Dynamic match for meals
        const mealMatch = path.match(/^\/app\/meals\/([a-z0-9-]+)$/);
        if (mealMatch) {
            return { path, name: 'meal-detail', access: 'protected', isApp: true, params: { slug: mealMatch[1] } };
        }

        // Static match for Yoga Library
        if (path === '/app/yoga') {
            return { path, name: 'yoga-library', access: 'protected', isApp: true };
        }

        // Dynamic match for yoga session
        const yogaSessionMatch = path.match(/^\/app\/yoga\/([a-z0-9-]+)\/session$/);
        if (yogaSessionMatch) {
            return { path, name: 'yoga-session', access: 'protected', isApp: true, params: { slug: yogaSessionMatch[1] } };
        }

        // Dynamic match for yoga detail
        const yogaMatch = path.match(/^\/app\/yoga\/([a-z0-9-]+)$/);
        if (yogaMatch) {
            return { path, name: 'yoga-detail', access: 'protected', isApp: true, params: { slug: yogaMatch[1] } };
        }

        return this.routes ? this.routes.find(r => r.path === '/') : { path: '/', name: 'home', access: 'public' }; // fallback
    }

    navigate(routePathOrObj) {
        const route = typeof routePathOrObj === 'string' ? this.matchRoute(routePathOrObj) : routePathOrObj;
        globalState.set('currentRoute', route);
        
        // Phase 9: Profile Completeness Boundary Check
        const isAuthenticated = globalState.get('isAuthenticated');
        const isProfileComplete = globalState.getDerived('isProfileComplete');

        if (route.access === 'protected' && !isAuthenticated) {
            console.log(`Access denied to ${route.path}. Redirecting to login.`);
            this.redirectTo('/login');
            return;
        }

        if (isAuthenticated) {
            // Unauthenticated shells requested by authenticated users
            if (route.path === '/login' || route.path === '/signup') {
                this.redirectTo(isProfileComplete ? '/app' : '/onboarding');
                return;
            }

            // Onboarding shell requested
            if (route.path === '/onboarding') {
                if (isProfileComplete) {
                    this.redirectTo('/app');
                    return;
                }
                // Allow through if incomplete
            }

            // Protected App shell requested
            if (route.isApp && !isProfileComplete) {
                console.log(`Profile incomplete. Redirecting to onboarding.`);
                this.redirectTo('/onboarding');
                return;
            }
        }

        console.log(`Navigated to: ${route.name}`);
        // The app shell will listen to 'currentRoute' state changes to mount/unmount UI
    }

    redirectTo(path) {
        window.location.hash = '#' + path;
    }
}

export const router = new Router();
