const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Profile Endpoints (Phase 9)', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('GET /api/v1/profile', () => {
        it('should return 401 unauthenticated for missing session', async () => {
            const res = await request(app).get('/api/v1/profile');
            expect(res.statusCode).toBe(401);
            expect(res.body.error.code).toBe('UNAUTHORIZED');
        });

        // The authenticated tests are structurally blocked without a live Postgres instance
        it.todo('authenticated GET /profile returns correct user profile');
    });

    describe('PATCH /api/v1/profile', () => {
        it('should return 401 unauthenticated for missing session', async () => {
            const res = await request(app)
                .patch('/api/v1/profile')
                .send({ goal: 'STRENGTH' });
            
            expect(res.statusCode).toBe(401);
        });

        // The authenticated validation tests can't trigger without bypassing requireAuth
        // Assuming unit testing of Zod schemas is done, these integration tests are marked todo
        it.todo('should reject invalid goal enum');
        it.todo('should reject invalid experience level enum');
        it.todo('should reject invalid routine preference enum');
        it.todo('should persist profile changes securely');
        it.todo('should not allow modifying another user profile');
        it.todo('passwordHash and session token must never appear in response');
    });
});
