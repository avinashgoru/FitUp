const express = require('express');
const { z } = require('zod');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validate.middleware');
const { requireAuth } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window`
    message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many authentication attempts. Please try again later.' } }
});

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(10, 'Password must be at least 10 characters').max(128),
    displayName: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
