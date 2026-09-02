const { PrismaClient } = require('@prisma/client');
const { ENV } = require('../config/env');

const prisma = new PrismaClient();

/**
 * Service for Health Check.
 * Responsibility: Perform business logic and system checks (e.g. pinging DB).
 */
async function checkHealth() {
    let dbStatus = 'unverified'; // Default state due to Phase 7 limitations

    if (ENV.DATABASE_URL) {
        try {
            // Attempt a lightweight safe query to verify DB connection
            await prisma.$queryRaw`SELECT 1`;
            dbStatus = 'ok';
        } catch (error) {
            console.error('[HealthService] Database ping failed:', error.message);
            dbStatus = 'degraded';
        }
    }

    return {
        service: 'fitup-api',
        status: dbStatus === 'degraded' ? 'degraded' : 'ok',
        database: dbStatus,
        environment: ENV.NODE_ENV,
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    checkHealth
};
