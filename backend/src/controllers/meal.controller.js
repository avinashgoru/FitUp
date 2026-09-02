const mealService = require('../services/meal.service');
const mealMatchingService = require('../services/meal-matching.service');
const mealLogService = require('../services/meal-log.service');

async function getMeals(req, res, next) {
    try {
        const result = await mealService.getMeals({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            mealType: req.query.mealType,
            dietaryType: req.query.dietaryType
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function getRecommendedMeals(req, res, next) {
    try {
        const recommended = await mealMatchingService.getRecommendedMeals(req.user.id);
        res.status(200).json({ data: recommended });
    } catch (error) {
        if (error.message === 'PROFILE_INCOMPLETE') {
            return res.status(400).json({ error: { code: 'PROFILE_INCOMPLETE', message: 'Please complete your personalization profile.' }});
        }
        next(error);
    }
}

async function getMealBySlug(req, res, next) {
    try {
        const meal = await mealService.getMealBySlug(req.params.slug);
        res.status(200).json({ data: meal });
    } catch (error) {
        if (error.message === 'MEAL_NOT_FOUND') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Meal not found.' }});
        }
        next(error);
    }
}

async function logMeal(req, res, next) {
    try {
        const log = await mealLogService.logMeal(req.user.id, req.body.mealId, req.body.servingCount);
        res.status(201).json({ data: log });
    } catch (error) {
        if (error.message === 'MEAL_NOT_FOUND') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Meal not found.' }});
        }
        next(error);
    }
}

async function getRecentLogs(req, res, next) {
    try {
        const logs = await mealLogService.getRecentLogs(req.user.id);
        res.status(200).json({ data: logs });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMeals,
    getRecommendedMeals,
    getMealBySlug,
    logMeal,
    getRecentLogs
};
