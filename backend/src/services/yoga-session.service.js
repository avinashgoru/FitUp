const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class YogaSessionService {
  async startSession(userId, practiceId) {
    const practice = await prisma.yogaPractice.findUnique({ where: { id: practiceId }});
    if (!practice) {
      throw new Error('Practice not found');
    }
    
    return prisma.yogaPracticeSession.create({
      data: {
        userId,
        practiceId,
        status: 'IN_PROGRESS'
      }
    });
  }

  async completeSession(userId, sessionId) {
    const session = await prisma.yogaPracticeSession.findUnique({ where: { id: sessionId }});
    if (!session) {
      throw new Error('Session not found');
    }
    if (session.userId !== userId) {
      throw new Error('Unauthorized session access');
    }
    if (session.status === 'COMPLETED') {
      throw new Error('Session already completed');
    }

    return prisma.yogaPracticeSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
  }
  
  async getRecentSessions(userId) {
    return prisma.yogaPracticeSession.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      include: { practice: true },
      take: 5
    });
  }
}

module.exports = new YogaSessionService();
