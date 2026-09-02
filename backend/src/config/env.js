require('dotenv').config();

const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5500', // Assuming a typical local frontend port if not specified
    DATABASE_URL: process.env.DATABASE_URL
};

// Validate required variables
const requiredVariables = ['DATABASE_URL'];
const missingVariables = requiredVariables.filter(key => !ENV[key]);

if (missingVariables.length > 0) {
    console.error(`[Fatal Error] Missing required environment variables: ${missingVariables.join(', ')}`);
    // Depending on deployment, we might want to exit here, but since this is Phase 7 and we are establishing the boundary without credentials:
    console.warn(`[Warning] Proceeding without verified database connection (Phase 7 scaffolding limit).`);
}

module.exports = { ENV };
