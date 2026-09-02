const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class YogaMatchingService {
  async getRecommendations(userId) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return this.getFallbackRecommendations();

    const practices = await prisma.yogaPractice.findMany();
    
    const scored = practices.map(p => {
      let score = 0;
      if (profile.goal && p.goal === profile.goal) score += 3;
      if (profile.experienceLevel && p.experienceLevel === profile.experienceLevel) score += 2;
      if (profile.routinePreference && p.routinePreference === profile.routinePreference) score += 1;
      return { ...p, _score: score };
    });

    // Sort descending by score, deterministic tie-breaking using duration/createdAt
    scored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      if (a.durationMinutes !== b.durationMinutes) return a.durationMinutes - b.durationMinutes;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    
    // Remove the internal _score field
    const results = scored.slice(0, 4).map(p => {
      const { _score, ...rest } = p;
      return rest;
    });

    return results;
  }

  async getFallbackRecommendations() {
    return prisma.yogaPractice.findMany({
      where: { level: 'BEGINNER' },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  }
}

module.exports = new YogaMatchingService();
