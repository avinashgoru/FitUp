import { workoutSessionService } from '../../services/workout-sessions.js';
import { globalState } from '../../app/app-state.js';
import { router } from '../../app/router.js';

export async function renderWorkoutSession(slug) {
    const sessionShell = document.getElementById('workout-session-shell');
    const currentWorkout = globalState.get('currentWorkout');

    // If navigated directly without loading the detail first, fallback
    if (!currentWorkout || currentWorkout.slug !== slug) {
        router.navigate(`/app/workouts/${slug}`);
        return;
    }

    sessionShell.innerHTML = `
        <div class="workout-session-container">
            <h2 class="loading-skeleton">Initializing Session...</h2>
        </div>
    `;

    try {
        const session = await workoutSessionService.startSession(currentWorkout.id);
        globalState.set('activeSession', session);
        startActiveExperience(sessionShell, currentWorkout, session);
    } catch (error) {
        sessionShell.innerHTML = `
            <div class="workout-session-container">
                <h2>Unable to start workout.</h2>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="window.history.back()">Go Back</button>
            </div>
        `;
    }
}

function startActiveExperience(container, workout, session) {
    let currentExerciseIndex = 0;
    const totalExercises = workout.exercises.length;

    function renderCurrentExercise() {
        if (currentExerciseIndex >= totalExercises) {
            renderCompletion();
            return;
        }

        const we = workout.exercises[currentExerciseIndex];
        const ex = we.exercise;

        const prescription = [
            we.sets ? `${we.sets} Sets` : null,
            we.reps ? `${we.reps} Reps` : null,
            we.durationSecs ? `${we.durationSecs} Seconds` : null
        ].filter(Boolean).join(' • ');

        container.innerHTML = `
            <div class="workout-session-container">
                <div class="session-progress">
                    Movement ${currentExerciseIndex + 1} of ${totalExercises}
                </div>
                
                <div class="active-exercise-card">
                    <h2>${ex.name}</h2>
                    <div class="active-prescription">${prescription}</div>
                    <p class="active-instructions">${ex.instructions || ex.description || 'Focus on form.'}</p>
                    ${we.restSecs ? `<p style="margin-top: var(--spacing-md); font-weight: 600; color: var(--color-text-light)">Rest ${we.restSecs}s after set.</p>` : ''}
                </div>

                <div class="session-controls">
                    <button class="btn btn-outline" id="btn-session-prev" ${currentExerciseIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button class="btn btn-primary" id="btn-session-next">
                        ${currentExerciseIndex === totalExercises - 1 ? 'Finish Workout' : 'Next Movement'}
                    </button>
                </div>
                <div style="margin-top: var(--spacing-2xl)">
                    <button class="btn btn-outline" id="btn-abandon" style="color: var(--color-text-light); border-color: transparent;">End Session Early</button>
                </div>
            </div>
        `;

        document.getElementById('btn-session-prev').addEventListener('click', () => {
            if (currentExerciseIndex > 0) {
                currentExerciseIndex--;
                renderCurrentExercise();
            }
        });

        document.getElementById('btn-session-next').addEventListener('click', () => {
            currentExerciseIndex++;
            renderCurrentExercise();
        });

        document.getElementById('btn-abandon').addEventListener('click', () => {
            if (confirm("Are you sure you want to end this workout early?")) {
                router.navigate('/app/workouts');
            }
        });
    }

    async function renderCompletion() {
        container.innerHTML = `
            <div class="workout-session-container completion-state">
                <h2 class="loading-skeleton">Saving Session...</h2>
            </div>
        `;

        try {
            await workoutSessionService.completeSession(session.id);
            container.innerHTML = `
                <div class="workout-session-container completion-state">
                    <h2>Workout Complete.</h2>
                    <p style="font-size: var(--text-lg); color: var(--color-text-light); margin-bottom: var(--spacing-2xl)">
                        Great job completing <strong>${workout.title}</strong>.
                    </p>
                    <button class="btn btn-primary" id="btn-back-to-workouts">Back to Library</button>
                </div>
            `;
            document.getElementById('btn-back-to-workouts').addEventListener('click', () => {
                router.navigate('/app/workouts');
            });
        } catch (error) {
            container.innerHTML = `
                <div class="workout-session-container completion-state">
                    <h2>Session Save Failed</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" id="btn-back-to-workouts">Back to Library</button>
                </div>
            `;
            document.getElementById('btn-back-to-workouts').addEventListener('click', () => {
                router.navigate('/app/workouts');
            });
        }
    }

    renderCurrentExercise();
}
