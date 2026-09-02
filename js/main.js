/**
 * FITUP Entry Point
 * Delegates immediately to the Application Orchestrator.
 */
import { app } from './app/app.js';

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
