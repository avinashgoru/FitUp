const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMeals({ page = 1, limit = 10, mealType, dietaryType }) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (mealType) where.mealType = mealType;
    if (dietaryType) where.dietaryType = dietaryType;

    const [meals, total] = await Promise.all([
        prisma.meal.findMany({
            where,
            skip,
            take: limit,
            include: {
                goals: true, // needed to show goal alignment
                ingredients: true // fetched but can be trimmed in response
            }
        }),
        prisma.meal.count({ where })
    ]);

    return {
        data: meals.map(m => ({
            ...m,
            goals: m.goals.map(g => g.goal),
            ingredientCount: m.ingredients.length,
            ingredients: undefined // omit bulk list in library view
        })),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

async function getMealBySlug(slug) {
    const meal = await prisma.meal.findUnique({
        where: { slug },
        include: {
            goals: true,
            ingredients: true
        }
    });

    if (!meal) throw new Error('MEAL_NOT_FOUND');
    
    return {
        ...meal,
        goals: meal.goals.map(g => g.goal)
    };
}

module.exports = {
    getMeals,
    getMealBySlug
};
