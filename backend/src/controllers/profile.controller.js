const profileService = require('../services/profile.service');

async function getProfile(req, res, next) {
    try {
        const profile = await profileService.getProfile(req.user.id);
        res.status(200).json({ data: profile });
    } catch (error) {
        if (error.message === 'PROFILE_NOT_FOUND') {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found.' } });
        }
        next(error);
    }
}

async function updateProfile(req, res, next) {
    try {
        const updated = await profileService.updateProfile(req.user.id, req.body);
        res.status(200).json({ data: updated });
    } catch (error) {
        next(error);
    }
}

module.exports = { getProfile, updateProfile };
