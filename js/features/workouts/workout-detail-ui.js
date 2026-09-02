import { workoutService } from '../../services/workouts.js';
import { globalState } from '../../app/app-state.js';
import { router } from '../../app/router.js';

export async function renderWorkoutDetail(slug) {
    const detailShell = document.getElementById('workout-detail-shell');
    detailShell.innerHTML = `
        <div class="workout-detail-container loading-skeleton">
            <div class="workout-detail-hero">
                <h1>Loading Workout...</h1>
            </div>
        </div>
    `;

    try {
        const workout = await workoutService.getWorkoutDetail(slug);
        globalState.set('currentWorkout', workout);
        renderDetailContent(detailShell, workout);
    } catch (error) {
        detailShell.innerHTML = `
            <div class="workout-detail-container">
                <div class="workout-detail-hero">
                    <h2>Workout not found.</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-outline" onclick="window.history.back()">Go Back</button>
                </div>
            </div>
        `;
    }
}

function renderDetailContent(container, workout) {
    const exercisesHtml = workout.exercises.map(we => `
        <div class="exercise-item">
            <div class="exercise-number">${String(we.order).padStart(2, '0')}</div>
            <div class="exercise-info">
                <h4>${we.exercise.name}</h4>
                <p>${we.exercise.instructions || we.exercise.description || ''}</p>
            </div>
            <div class="exercise-prescription">
                ${we.sets ? `${we.sets} Sets` : ''} 
                ${we.reps ? `x ${we.reps} Reps` : ''}
                ${we.durationSecs ? `(${we.durationSecs}s)` : ''}
                ${we.restSecs ? `<br><small>${we.restSecs}s rest</small>` : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="workout-detail-container">
            <button class="btn btn-outline" id="btn-back-library" style="margin-bottom: var(--spacing-md)">← Back to Library</button>
            
            <div class="workout-detail-hero">
                <div class="workout-card-meta">
                    <span class="workout-tag">${workout.durationMinutes} Min</span>
                    <span class="workout-tag">${workout.difficulty}</span>
                    <span class="workout-tag primary">${workout.goal.replace('_', ' ')}</span>
                </div>
                <h1>${workout.title}</h1>
                <p style="color: var(--color-text-light); margin-bottom: var(--spacing-xl)">${workout.description}</p>
                <button class="btn btn-primary" id="btn-start-session">Start Workout</button>
            </div>

            <h3 class="workout-section-title">Workout Structure (${workout.exercises.length} Movements)</h3>
            <div class="exercise-list">
                ${exercisesHtml}
            </div>
        </div>
    `;

    document.getElementById('btn-back-library').addEventListener('click', () => {
        router.navigate('/app/workouts');
    });

    document.getElementById('btn-start-session').addEventListener('click', () => {
        router.navigate(`/app/workouts/${workout.slug}/session`);
    });
}
