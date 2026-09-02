const app = require('./app');
const { ENV } = require('./config/env');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma (though not strictly necessary to keep a global instance here, it's good for graceful shutdown)
const prisma = new PrismaClient();

const server = app.listen(ENV.PORT, () => {
    console.log(`[server] FITUP API listening on port ${ENV.PORT}`);
    console.log(`[server] Environment: ${ENV.NODE_ENV}`);
});

// Graceful shutdown handling
const shutdown = async (signal) => {
    console.log(`\n[server] Received ${signal}. Shutting down gracefully...`);
    
    server.close(async () => {
        console.log('[server] Closed out remaining HTTP connections.');
        try {
            await prisma.$disconnect();
            console.log('[server] Database disconnected successfully.');
            process.exit(0);
        } catch (err) {
            console.error('[server] Error during database disconnection:', err);
            process.exit(1);
        }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('[server] Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
