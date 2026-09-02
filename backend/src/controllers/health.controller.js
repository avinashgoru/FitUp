const healthService = require('../services/health.service');

/**
 * Controller for Health Check.
 * Responsibility: Receive HTTP request, delegate to service, return JSON.
 */
async function getHealthStatus(req, res, next) {
    try {
        const healthData = await healthService.checkHealth();
        
        const status = healthData.database === 'ok' ? 200 : 503;
        
        return res.status(status).json({
            data: healthData
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHealthStatus
};
