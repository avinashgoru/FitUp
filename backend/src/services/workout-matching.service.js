const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Deterministically scores workouts based on user profile.
 * - Experience match: +3
 * - Goal match: +2
 * - Routine match: +1
 */
function scoreWorkout(workout, profile) {
    let score = 0;
    if (workout.experienceLevel === profile.experienceLevel) score += 3;
    if (workout.goal === profile.goal) score += 2;
    if (workout.routinePreference === profile.routinePreference) score += 1;
    return score;
}

async function getRecommendedWorkouts(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    });

    if (!user || !user.profile || !user.profile.goal || !user.profile.experienceLevel || !user.profile.routinePreference) {
        throw new Error('PROFILE_INCOMPLETE');
    }

    const allWorkouts = await prisma.workout.findMany({
        include: { exercises: true }
    });

    // Score and sort descending
    const scored = allWorkouts.map(w => ({
        ...w,
        relevanceScore: scoreWorkout(w, user.profile),
        exerciseCount: w.exercises.length,
        exercises: undefined
    }));

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Return top 4
    return scored.slice(0, 4);
}

module.exports = {
    getRecommendedWorkouts
};
