const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * Validates the HttpOnly session cookie and attaches the user to the request.
 */
async function requireAuth(req, res, next) {
    const sessionToken = req.cookies.session;

    if (!sessionToken) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required.'
            }
        });
    }

    try {
        // Hash the incoming token to match the database stored tokenHash
        const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');

        // Look up valid, non-expired session
        const session = await prisma.session.findFirst({
            where: {
                tokenHash: tokenHash,
                expiresAt: { gt: new Date() },
                revokedAt: null
            },
            include: {
                user: {
                    include: { profile: true }
                }
            }
        });

        if (!session) {
            // Invalid or expired session
            res.clearCookie('session', { path: '/' });
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Session invalid or expired.'
                }
            });
        }

        // Attach user to request
        req.user = session.user;
        req.session = session;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Placeholder Role-Based Authorization
 */
function requireRole(roleName) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
        }
        if (req.user.role !== roleName) {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' } });
        }
        next();
    };
}

module.exports = { requireAuth, requireRole };
