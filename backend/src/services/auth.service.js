const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const crypto = require('crypto');

const prisma = new PrismaClient();
const SESSION_EXPIRY_DAYS = 7;

/**
 * Register a new user and create an initial session.
 */
async function registerUser(email, password, displayName) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check duplicate
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
        throw new Error('DUPLICATE_EMAIL');
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user and profile in a transaction
    const user = await prisma.user.create({
        data: {
            email: normalizedEmail,
            passwordHash,
            profile: displayName ? {
                create: { displayName }
            } : undefined
        },
        include: { profile: true }
    });

    return createSession(user.id);
}

/**
 * Verify credentials and create a new session.
 */
async function loginUser(email, password) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ 
        where: { email: normalizedEmail },
        include: { profile: true }
    });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    return createSession(user.id);
}

/**
 * Generate a secure opaque session token and persist its hash to the database.
 */
async function createSession(userId) {
    // 1. Generate opaque raw token
    const rawToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Hash it for DB storage
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    
    // 3. Set expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

    // 4. Save to DB
    await prisma.session.create({
        data: {
            tokenHash,
            userId,
            expiresAt
        }
    });

    return { rawToken, expiresAt };
}

/**
 * Revoke a session.
 */
async function revokeSession(sessionId) {
    await prisma.session.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() }
    });
}

module.exports = { registerUser, loginUser, revokeSession };
