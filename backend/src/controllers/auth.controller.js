const { ENV } = require('../config/env');
const authService = require('../services/auth.service');

const cookieConfig = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
};

async function register(req, res, next) {
    try {
        const { email, password, displayName } = req.body;
        const { rawToken, expiresAt } = await authService.registerUser(email, password, displayName);
        
        res.cookie('session', rawToken, { ...cookieConfig, expires: expiresAt });
        
        res.status(201).json({ data: { message: 'Registered successfully' } });
    } catch (error) {
        if (error.message === 'DUPLICATE_EMAIL') {
            // Using a generic message to prevent enumeration if desired, but for registration, a standard error is often fine.
            // Following prompt: "Registration duplicate: Use a safe, user-friendly message consistent with the chosen enumeration strategy."
            return res.status(400).json({ error: { code: 'EMAIL_IN_USE', message: 'Email is already in use.' } });
        }
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const { rawToken, expiresAt } = await authService.loginUser(email, password);
        
        res.cookie('session', rawToken, { ...cookieConfig, expires: expiresAt });
        
        res.status(200).json({ data: { message: 'Logged in successfully' } });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid email or password.' } });
        }
        next(error);
    }
}

async function logout(req, res, next) {
    try {
        if (req.session) {
            await authService.revokeSession(req.session.id);
        }
        res.clearCookie('session', { path: '/' });
        res.status(200).json({ data: { message: 'Logged out successfully' } });
    } catch (error) {
        next(error);
    }
}

async function me(req, res, next) {
    try {
        // req.user is populated by requireAuth middleware
        const safeUser = {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            profile: req.user.profile ? {
                displayName: req.user.profile.displayName
            } : null
        };
        res.status(200).json({ data: safeUser });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, logout, me };
