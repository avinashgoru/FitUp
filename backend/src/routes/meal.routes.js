const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const mealController = require('../controllers/meal.controller');

const router = express.Router();

// Public / Non-Personalized
router.get('/', mealController.getMeals);
router.get('/detail/:slug', mealController.getMealBySlug);

// Protected / Personalized
router.get('/recommended', requireAuth, mealController.getRecommendedMeals);
router.get('/logs', requireAuth, mealController.getRecentLogs);

const logMealSchema = z.object({
    mealId: z.string().uuid(),
    servingCount: z.number().positive().max(10)
});

router.post('/log', requireAuth, validateRequest(logMealSchema), mealController.logMeal);

module.exports = router;
