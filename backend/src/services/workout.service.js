const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getWorkouts({ page = 1, limit = 10, goal, difficulty }) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (goal) where.goal = goal;
    if (difficulty) where.difficulty = difficulty;

    const [workouts, total] = await Promise.all([
        prisma.workout.findMany({
            where,
            skip,
            take: limit,
            include: {
                exercises: true // fetch counts
            }
        }),
        prisma.workout.count({ where })
    ]);

    return {
        data: workouts.map(w => ({
            ...w,
            exerciseCount: w.exercises.length,
            exercises: undefined // Don't leak all details in list view
        })),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

async function getWorkoutBySlug(slug) {
    const workout = await prisma.workout.findUnique({
        where: { slug },
        include: {
            exercises: {
                orderBy: { order: 'asc' },
                include: {
                    exercise: true // Include actual exercise details (name, instructions)
                }
            }
        }
    });

    if (!workout) throw new Error('WORKOUT_NOT_FOUND');
    return workout;
}

module.exports = {
    getWorkouts,
    getWorkoutBySlug
};
