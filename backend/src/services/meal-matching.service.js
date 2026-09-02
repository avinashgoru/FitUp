const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Deterministically scores meals based on user profile.
 * - Goal match: +3
 * - Dietary Type match: +2
 * - Routine compatibility: +1
 */
function scoreMeal(meal, profile) {
    let score = 0;
    
    // Goal Match (A meal can have multiple goals, if any match, award points)
    const mealGoals = meal.goals.map(g => g.goal);
    if (profile.goal && mealGoals.includes(profile.goal)) {
        score += 3;
    }

    // Dietary Type Match
    if (profile.dietaryPreference && meal.dietaryType === profile.dietaryPreference) {
        score += 2;
    }

    // Routine Compatibility Match
    if (profile.routinePreference) {
        if (profile.routinePreference === 'QUICK' && meal.preparationTimeMinutes <= 15) {
            score += 1;
        } else if (profile.routinePreference === 'BALANCED' && meal.preparationTimeMinutes <= 30) {
            score += 1;
        } else if (profile.routinePreference === 'DEDICATED') {
            score += 1; // Dedicated routines can accommodate any prep time
        }
    }

    return score;
}

async function getRecommendedMeals(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    });

    if (!user || !user.profile) {
        throw new Error('PROFILE_INCOMPLETE');
    }

    const allMeals = await prisma.meal.findMany({
        include: { goals: true }
    });

    const scored = allMeals.map(m => ({
        ...m,
        goals: m.goals.map(g => g.goal),
        relevanceScore: scoreMeal(m, user.profile)
    }));

    // Sort descending by score
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Return top 4
    return scored.slice(0, 4);
}

module.exports = {
    getRecommendedMeals,
    scoreMeal // Exported for unit testing
};
