const { z } = require('zod');

/**
 * Validates request bodies against a Zod schema.
 * @param {z.ZodSchema} schema 
 */
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Return a sanitized, readable message
                const issue = error.issues[0];
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: `${issue.path.join('.')}: ${issue.message}`
                    }
                });
            }
            next(error);
        }
    };
}

module.exports = { validateRequest };
