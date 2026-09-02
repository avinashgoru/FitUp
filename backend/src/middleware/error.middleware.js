/**
 * Centralized Error Handling Middleware.
 * Standardizes API responses for predictability.
 */
function errorMiddleware(err, req, res, next) {
    console.error(`[Error] ${err.name}: ${err.message}`);

    // Default 500 error
    let statusCode = err.statusCode || 500;
    let errorCode = err.code || 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred. Please try again.';

    // Expose message if it's an expected operational error (status < 500)
    if (statusCode < 500) {
        errorMessage = err.message;
    }

    // Prisma-specific error normalization (scaffolding for future DB interaction)
    if (err.code && err.code.startsWith('P2')) {
        statusCode = 400; // Bad request for most Prisma client errors like constraint failures
        errorCode = 'DATABASE_CONSTRAINT_ERROR';
        // Do not leak internal DB schema details, keep it vague or parse safely
        errorMessage = 'A database validation or constraint error occurred.';
    }

    res.status(statusCode).json({
        error: {
            code: errorCode,
            message: errorMessage
        }
    });
}

module.exports = { errorMiddleware };
