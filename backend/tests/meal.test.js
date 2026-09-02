const request = require('supertest');
const app = require('../src/app');
const { scoreMeal } = require('../src/services/meal-matching.service');

describe('Meal System (Phase 11)', () => {
    
    describe('Recommendation Scoring Logic', () => {
        it('should correctly score a meal based on profile attributes', () => {
            const profile = {
                goal: 'STRENGTH',
                dietaryPreference: 'VEGETARIAN',
                routinePreference: 'QUICK'
            };
            
            const meal = {
                goals: [{ goal: 'STRENGTH' }, { goal: 'GENERAL_FITNESS' }], // +3
                dietaryType: 'VEGETARIAN', // +2
                preparationTimeMinutes: 10 // +1 (QUICK expects <= 15)
            };
            
            const score = scoreMeal(meal, profile);
            expect(score).toBe(6);
        });

        it('should not award points for mismatches', () => {
            const profile = {
                goal: 'MOBILITY',
                dietaryPreference: 'VEGAN',
                routinePreference: 'BALANCED'
            };
            
            const meal = {
                goals: [{ goal: 'STRENGTH' }], // 0
                dietaryType: 'NON_VEGETARIAN', // 0
                preparationTimeMinutes: 45 // 0 (BALANCED expects <= 30)
            };
            
            const score = scoreMeal(meal, profile);
            expect(score).toBe(0);
        });
    });

    describe('GET /api/v1/meals', () => {
        it('should return 404 for missing DB integration or assert route existence', async () => {
            const res = await request(app).get('/api/v1/meals');
            expect(res.statusCode).not.toBe(404);
        });
    });

    describe('POST /api/v1/meals/log', () => {
        it('should return 401 unauthenticated for missing session', async () => {
            const res = await request(app).post('/api/v1/meals/log').send({
                mealId: '123e4567-e89b-12d3-a456-426614174000',
                servingCount: 1
            });
            expect(res.statusCode).toBe(401);
        });
    });
});
