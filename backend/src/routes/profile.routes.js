const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const profileController = require('../controllers/profile.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const profileLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // Limit each IP to 30 requests per `window` for profile updates
    message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' } }
});

const profileSchema = z.object({
    goal: z.enum(['STRENGTH', 'WEIGHT_MANAGEMENT', 'MOBILITY', 'GENERAL_FITNESS']).optional(),
    experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    routinePreference: z.enum(['QUICK', 'BALANCED', 'DEDICATED']).optional()
});

router.use(requireAuth); // All profile routes require authentication

router.get('/', profileController.getProfile);
router.patch('/', profileLimiter, validateRequest(profileSchema), profileController.updateProfile);

module.exports = router;
