const workoutService = require('../services/workout.service');
const workoutMatchingService = require('../services/workout-matching.service');
const workoutSessionService = require('../services/workout-session.service');

async function getWorkouts(req, res, next) {
    try {
        const result = await workoutService.getWorkouts({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            goal: req.query.goal,
            difficulty: req.query.difficulty
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function getRecommendedWorkouts(req, res, next) {
    try {
        const recommended = await workoutMatchingService.getRecommendedWorkouts(req.user.id);
        res.status(200).json({ data: recommended });
    } catch (error) {
        if (error.message === 'PROFILE_INCOMPLETE') {
            return res.status(400).json({ error: { code: 'PROFILE_INCOMPLETE', message: 'Please complete your personalization profile first.' }});
        }
        next(error);
    }
}

async function getWorkoutBySlug(req, res, next) {
    try {
        const workout = await workoutService.getWorkoutBySlug(req.params.slug);
        res.status(200).json({ data: workout });
    } catch (error) {
        if (error.message === 'WORKOUT_NOT_FOUND') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workout not found.' }});
        }
        next(error);
    }
}

async function startSession(req, res, next) {
    try {
        const session = await workoutSessionService.startSession(req.user.id, req.body.workoutId);
        res.status(201).json({ data: session });
    } catch (error) {
        if (error.message === 'WORKOUT_NOT_FOUND') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workout not found.' }});
        }
        next(error);
    }
}

async function completeSession(req, res, next) {
    try {
        const session = await workoutSessionService.completeSession(req.user.id, req.params.sessionId);
        res.status(200).json({ data: session });
    } catch (error) {
        if (error.message === 'SESSION_NOT_FOUND' || error.message === 'FORBIDDEN') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Session not found.' }}); // Obfuscate forbidden
        }
        next(error);
    }
}

module.exports = {
    getWorkouts,
    getRecommendedWorkouts,
    getWorkoutBySlug,
    startSession,
    completeSession
};
