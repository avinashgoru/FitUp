const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function startSession(userId, workoutId) {
    // Verify workout exists
    const workout = await prisma.workout.findUnique({ where: { id: workoutId }});
    if (!workout) throw new Error('WORKOUT_NOT_FOUND');

    return await prisma.workoutSession.create({
        data: {
            userId,
            workoutId,
            status: 'IN_PROGRESS'
        }
    });
}

async function getSession(userId, sessionId) {
    const session = await prisma.workoutSession.findUnique({
        where: { id: sessionId },
        include: { workout: true }
    });

    if (!session) throw new Error('SESSION_NOT_FOUND');
    if (session.userId !== userId) throw new Error('FORBIDDEN');

    return session;
}

async function completeSession(userId, sessionId) {
    const session = await getSession(userId, sessionId);

    if (session.status === 'COMPLETED') {
        return session; // Idempotent completion
    }

    return await prisma.workoutSession.update({
        where: { id: sessionId },
        data: {
            status: 'COMPLETED',
            completedAt: new Date()
        }
    });
}

module.exports = {
    startSession,
    getSession,
    completeSession
};
