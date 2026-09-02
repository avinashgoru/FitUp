const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logMeal(userId, mealId, servingCount) {
    const meal = await prisma.meal.findUnique({ where: { id: mealId }});
    if (!meal) throw new Error('MEAL_NOT_FOUND');

    return await prisma.mealLog.create({
        data: {
            userId,
            mealId,
            servingCount
        },
        include: {
            meal: true
        }
    });
}

async function getRecentLogs(userId, limit = 5) {
    return await prisma.mealLog.findMany({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
        take: limit,
        include: {
            meal: true
        }
    });
}

module.exports = {
    logMeal,
    getRecentLogs
};
