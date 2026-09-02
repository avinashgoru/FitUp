import { globalState } from './app-state.js';
import { renderLogin, renderSignup } from '../features/auth/auth-ui.js';
import { renderOnboarding } from '../features/onboarding/onboarding-ui.js';
import { renderAppShell as renderDashboardShell } from '../features/app-shell/app-ui.js';
import { renderWorkoutLibrary } from '../features/workouts/workout-library-ui.js';
import { renderWorkoutDetail } from '../features/workouts/workout-detail-ui.js';
import { renderWorkoutSession } from '../features/workouts/workout-session-ui.js';
import { renderMealLibrary } from '../features/meals/meal-library-ui.js';
import { renderMealDetail } from '../features/meals/meal-detail-ui.js';
import { renderYogaLibrary } from '../features/yoga/yoga-library-ui.js';
import { renderYogaDetail } from '../features/yoga/yoga-detail-ui.js';
import { renderYogaSession } from '../features/yoga/yoga-session-ui.js';

/**
 * Application Shell Coordinator.
 * Listens for route changes and mounts/unmounts the appropriate shell
 * (Public Marketing vs Protected Application vs Authentication).
 */
class AppShell {
    constructor() {
        this.marketingHeader = document.getElementById('site-header');
        this.marketingMain = document.querySelector('main');
        this.marketingFooter = document.getElementById('site-footer');
        
        this.authShell = document.getElementById('auth-shell');
        this.loginView = document.getElementById('login-view');
        this.signupView = document.getElementById('signup-view');
        
        this.onboardingShell = document.getElementById('onboarding-shell');
        this.appShellView = document.getElementById('app-shell');
        
        // App Sub-views
        this.dashboardView = document.getElementById('dashboard-view');
        this.workoutLibraryShell = document.getElementById('workout-library-shell');
        this.workoutDetailShell = document.getElementById('workout-detail-shell');
        this.workoutSessionShell = document.getElementById('workout-session-shell');
        
        this.mealLibraryShell = document.getElementById('meal-library-shell');
        this.mealDetailShell = document.getElementById('meal-detail-shell');
        
        this.yogaLibraryShell = document.getElementById('yoga-library-shell');
        this.yogaDetailShell = document.getElementById('yoga-detail-shell');
        this.yogaSessionShell = document.getElementById('yoga-session-shell');
        
        this.unsubscribe = null;
    }

    init() {
        // Initial render for views
        renderLogin();
        renderSignup();
        renderOnboarding();

        // Listen for route changes
        this.unsubscribe = globalState.subscribe('currentRoute', (route) => {
            this.renderShell(route);
        });
    }

    renderShell(route) {
        if (!route) return;

        // Hide everything first
        this.marketingHeader.style.display = 'none';
        this.marketingMain.style.display = 'none';
        this.marketingFooter.style.display = 'none';
        this.authShell.style.display = 'none';
        this.loginView.style.display = 'none';
        this.signupView.style.display = 'none';
        this.onboardingShell.style.display = 'none';
        this.appShellView.style.display = 'none';

        // Hide app sub-views
        if (this.dashboardView) this.dashboardView.style.display = 'none';
        if (this.workoutLibraryShell) this.workoutLibraryShell.style.display = 'none';
        if (this.workoutDetailShell) this.workoutDetailShell.style.display = 'none';
        if (this.workoutSessionShell) this.workoutSessionShell.style.display = 'none';
        if (this.mealLibraryShell) this.mealLibraryShell.style.display = 'none';
        if (this.mealDetailShell) this.mealDetailShell.style.display = 'none';
        if (this.yogaLibraryShell) this.yogaLibraryShell.style.display = 'none';
        if (this.yogaDetailShell) this.yogaDetailShell.style.display = 'none';
        if (this.yogaSessionShell) this.yogaSessionShell.style.display = 'none';

        if (route.isApp) {
            // Mount application shell
            this.appShellView.style.display = 'block';

            if (route.name === 'app-dashboard') {
                this.dashboardView.style.display = 'block';
                renderDashboardShell();
            } else if (route.name === 'workout-library') {
                this.workoutLibraryShell.style.display = 'block';
                renderWorkoutLibrary();
            } else if (route.name === 'workout-detail') {
                this.workoutDetailShell.style.display = 'block';
                renderWorkoutDetail(route.params.slug);
            } else if (route.name === 'workout-session') {
                this.workoutSessionShell.style.display = 'block';
                renderWorkoutSession(route.params.slug);
            } else if (route.name === 'meal-library') {
                this.mealLibraryShell.style.display = 'block';
                renderMealLibrary();
            } else if (route.name === 'meal-detail') {
                this.mealDetailShell.style.display = 'block';
                renderMealDetail(route.params.slug);
            } else if (route.name === 'yoga-library') {
                this.yogaLibraryShell.style.display = 'block';
                renderYogaLibrary();
            } else if (route.name === 'yoga-detail') {
                this.yogaDetailShell.style.display = 'block';
                renderYogaDetail(route.params.slug);
            } else if (route.name === 'yoga-session') {
                this.yogaSessionShell.style.display = 'block';
                renderYogaSession(route.params.slug);
            }
        } else if (route.name === 'onboarding') {
            // Mount onboarding shell
            this.onboardingShell.style.display = 'block';
        } else if (route.name === 'login' || route.name === 'signup') {
            // Mount auth shell
            this.authShell.style.display = 'block';
            if (route.name === 'login') this.loginView.style.display = 'block';
            if (route.name === 'signup') this.signupView.style.display = 'block';
        } else {
            // Mount public marketing shell
            this.marketingHeader.style.display = 'block';
            this.marketingMain.style.display = 'block';
            this.marketingFooter.style.display = 'block';
        }
    }
}

export const appShell = new AppShell();
