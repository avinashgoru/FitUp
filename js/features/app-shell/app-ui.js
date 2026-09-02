import { globalState } from '../../app/app-state.js';
import { authService } from '../../services/auth.js';
import { router } from '../../app/router.js';

export function renderAppShell() {
    const appView = document.getElementById('dashboard-view');
    const user = globalState.get('user');
    const profile = globalState.get('profile');

    if (!user || !profile) {
        appView.innerHTML = '<p>Loading...</p>';
        return;
    }

    const displayName = profile.displayName || user.email;
    const routineText = profile.routinePreference ? profile.routinePreference.toLowerCase() : 'custom';
    const goalText = profile.goal ? profile.goal.toLowerCase().replace('_', ' ') : 'fitness';

    appView.innerHTML = `
        <div class="app-dashboard-header" style="margin-bottom: var(--spacing-xl)">
            <h2>Welcome back, <span class="fitup-emphasis">${displayName}</span></h2>
            <button id="logout-btn" class="btn btn-outline">Sign Out</button>
        </div>
        <div class="app-dashboard-content" style="text-align: center; padding: var(--spacing-3xl) 0; background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
            <p class="app-dashboard-greeting" style="font-size: var(--text-2xl); color: var(--color-text-dark); margin-bottom: var(--spacing-md); font-weight: 600;">
                Ready for a ${routineText} routine focused on ${goalText}?
            </p>
            <p style="color: var(--color-text-light); margin-bottom: var(--spacing-2xl);">Head to the Workout, Meal, or Yoga Library to see your personalized recommendations.</p>
            <div style="display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap;">
                <button id="nav-workouts-btn" class="btn btn-primary">Go to Workouts</button>
                <button id="nav-meals-btn" class="btn btn-outline">Go to Meals</button>
                <button id="nav-yoga-btn" class="btn btn-outline">Go to Yoga</button>
            </div>
        </div>
    `;

    document.getElementById('nav-workouts-btn').addEventListener('click', () => {
        router.navigate('/app/workouts');
    });

    document.getElementById('nav-meals-btn').addEventListener('click', () => {
        router.navigate('/app/meals');
    });

    document.getElementById('nav-yoga-btn').addEventListener('click', () => {
        router.navigate('/app/yoga');
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        const btn = document.getElementById('logout-btn');
        btn.disabled = true;
        btn.textContent = 'Signing out...';
        await authService.logout();
    });
}
