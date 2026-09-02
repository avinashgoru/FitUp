const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class YogaService {
  async getLibrary(filters = {}) {
    const where = {};
    if (filters.level) where.level = filters.level;
    if (filters.style) where.style = filters.style;
    if (filters.duration) {
      if (filters.duration === 'short') where.durationMinutes = { lte: 15 };
      else if (filters.duration === 'medium') where.durationMinutes = { gt: 15, lte: 30 };
      else if (filters.duration === 'long') where.durationMinutes = { gt: 30 };
    }

    return prisma.yogaPractice.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getDetail(slug) {
    const practice = await prisma.yogaPractice.findUnique({
      where: { slug },
      include: {
        poses: {
          orderBy: { order: 'asc' },
          include: { pose: true }
        }
      }
    });

    if (!practice) {
      throw new Error('Yoga practice not found');
    }

    return practice;
  }
}

module.exports = new YogaService();
