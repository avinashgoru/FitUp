import { globalState } from './app-state.js';
import { router } from './router.js';
import { appShell } from './app-shell.js';

// Feature / Component Initializers
import { initNavigation } from '../components/navigation.js';
import { initMeals } from '../features/meals/meals.js';
import { initYoga } from '../features/yoga/yoga.js';
import { initEvents } from '../features/events/events.js';
import { initAnimations } from '../features/marketing/animations.js';

/**
 * Main application orchestrator.
 * Responsible for the deterministic bootstrap sequence.
 */
class Application {
    init() {
        console.log("FITUP Phase 6: Application Architecture Bootstrapping...");

        // 1. Initialize Global UI Components
        initNavigation();
        initAnimations();

        // 2. Initialize Public Features
        initMeals();
        initYoga();
        initEvents();

        // 3. Initialize App Shell Coordinator
        appShell.init();

        // 4. Initialize Router (starts listening and sets initial route)
        router.init();

        // 5. Mark application as ready
        globalState.set('isReady', true);
        console.log("FITUP Application Ready.");
    }
}

export const app = new Application();
