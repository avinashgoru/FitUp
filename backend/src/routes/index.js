const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const workoutRoutes = require('./workout.routes');
const mealRoutes = require('./meal.routes');
const yogaRoutes = require('./yoga.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/workouts', workoutRoutes);
router.use('/meals', mealRoutes);
router.use('/yoga', yogaRoutes);

module.exports = router;
