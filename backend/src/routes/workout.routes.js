const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const workoutController = require('../controllers/workout.controller');

const router = express.Router();

// Public / Non-Personalized
router.get('/', workoutController.getWorkouts);
router.get('/detail/:slug', workoutController.getWorkoutBySlug);

// Protected / Personalized
router.get('/recommended', requireAuth, workoutController.getRecommendedWorkouts);

const startSessionSchema = z.object({
    workoutId: z.string().uuid()
});

router.post('/sessions', requireAuth, validateRequest(startSessionSchema), workoutController.startSession);
router.post('/sessions/:sessionId/complete', requireAuth, workoutController.completeSession);

module.exports = router;
