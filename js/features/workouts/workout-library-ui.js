import { workoutService } from '../../services/workouts.js';
import { globalState } from '../../app/app-state.js';
import { router } from '../../app/router.js';

export async function renderWorkoutLibrary() {
    const libraryShell = document.getElementById('workout-library-shell');
    libraryShell.innerHTML = `
        <div class="workout-library-container loading-skeleton">
            <div class="workout-header">
                <h2>Loading Workouts...</h2>
            </div>
        </div>
    `;

    try {
        const [recommendations, allWorkouts] = await Promise.all([
            workoutService.getRecommendations().catch(() => []), // Fails gracefully if profile blocked
            workoutService.getLibrary()
        ]);

        globalState.set('recommendedWorkouts', recommendations);
        globalState.set('workouts', allWorkouts.data || []);

        renderLibraryContent(libraryShell, recommendations, allWorkouts.data);
    } catch (error) {
        libraryShell.innerHTML = `
            <div class="workout-library-container">
                <div class="workout-header">
                    <h2>Unable to load workouts.</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-outline" onclick="window.location.reload()">Retry</button>
                </div>
            </div>
        `;
    }
}

function renderLibraryContent(container, recommended, all) {
    let recommendedHtml = '';
    
    if (recommended && recommended.length > 0) {
        recommendedHtml = `
            <h3 class="workout-section-title">Recommended For You</h3>
            <div class="workout-grid">
                ${recommended.map(w => createWorkoutCard(w, true)).join('')}
            </div>
        `;
    }

    const allHtml = `
        <h3 class="workout-section-title">All Workouts</h3>
        <div class="workout-grid">
            ${(all || []).map(w => createWorkoutCard(w)).join('')}
        </div>
    `;

    container.innerHTML = `
        <div class="workout-library-container">
            <div class="workout-header">
                <h2>Workout Library</h2>
                <p>Find your next challenge or follow your personalized plan.</p>
            </div>
            ${recommendedHtml}
            ${allHtml}
        </div>
    `;

    // Attach listeners
    container.querySelectorAll('.view-workout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.target.dataset.slug;
            router.navigate(`/app/workouts/${slug}`);
        });
    });
}

function createWorkoutCard(workout, isRecommended = false) {
    return `
        <div class="workout-card">
            <div class="workout-card-meta">
                ${isRecommended ? '<span class="workout-tag primary">Match</span>' : ''}
                <span class="workout-tag">${workout.durationMinutes} Min</span>
                <span class="workout-tag">${workout.difficulty}</span>
            </div>
            <h3>${workout.title}</h3>
            <p>${workout.description}</p>
            <button class="btn btn-outline view-workout-btn" data-slug="${workout.slug}">View Workout</button>
        </div>
    `;
}
