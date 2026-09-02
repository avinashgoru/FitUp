/**
 * Global application state management.
 * Provides a lightweight subscription model for cross-component state updates.
 */

class AppState {
    constructor() {
        this.state = {
            isReady: false,
            currentRoute: null,
            isAuthenticated: false,
            authStatus: 'unknown',
            user: null,
            profile: null,
            
            // UI State
            isMenuOpen: false,

            // Workout State (Phase 10)
            workouts: [],
            recommendedWorkouts: [],
            currentWorkout: null,
            activeSession: null,

            // Meal State (Phase 11)
            meals: [],
            recommendedMeals: [],
            currentMeal: null
        };
        this.listeners = new Map();
    }

    /**
     * Subscribe to state changes.
     * @param {string} key - The state key to watch.
     * @param {Function} callback - Function to call when state changes.
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(key);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    /**
     * Retrieve a derived state slice
     * @param {string} key 
     */
    getDerived(key) {
        if (key === 'isProfileComplete') {
            const p = this.state.profile;
            return p && p.goal && p.experienceLevel && p.routinePreference;
        }
        return null;
    }

    /**
     * Update a state value and notify subscribers.
     * @param {string} key - The state key to update.
     * @param {*} value - The new value.
     */
    set(key, value) {
        if (this.state[key] !== value) {
            this.state[key] = value;
            this.notify(key, value);
        }
    }

    /**
     * Get a current state value.
     * @param {string} key - The state key to retrieve.
     * @returns {*} The current value.
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Notify subscribers of a change.
     * @private
     */
    notify(key, value) {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }
}

// Export as a singleton
export const globalState = new AppState();
