const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getProfile(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    });

    if (!user || !user.profile) {
        throw new Error('PROFILE_NOT_FOUND');
    }

    // Filter fields to return only safe public personalization fields
    return {
        id: user.profile.id,
        displayName: user.profile.displayName,
        goal: user.profile.goal,
        experienceLevel: user.profile.experienceLevel,
        routinePreference: user.profile.routinePreference
    };
}

async function updateProfile(userId, data) {
    const { goal, experienceLevel, routinePreference } = data;

    // Use Prisma to update exactly what's allowed.
    // The Zod schema layer will ensure 'data' is clean before it reaches here.
    const updated = await prisma.profile.update({
        where: { userId },
        data: {
            goal,
            experienceLevel,
            routinePreference
        }
    });

    return {
        id: updated.id,
        displayName: updated.displayName,
        goal: updated.goal,
        experienceLevel: updated.experienceLevel,
        routinePreference: updated.routinePreference
    };
}

module.exports = { getProfile, updateProfile };
