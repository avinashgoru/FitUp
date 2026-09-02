const { z } = require('zod');
const yogaService = require('../services/yoga.service');
const yogaMatchingService = require('../services/yoga-matching.service');
const yogaSessionService = require('../services/yoga-session.service');

const getLibrary = async (req, res) => {
  try {
    const filters = req.query; 
    const practices = await yogaService.getLibrary(filters);
    res.json({ status: 'success', data: practices });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getDetail = async (req, res) => {
  try {
    const practice = await yogaService.getDetail(req.params.slug);
    res.json({ status: 'success', data: practice });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const getRecommended = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await yogaMatchingService.getRecommendations(userId);
    res.json({ status: 'success', data: recommendations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const startSessionSchema = z.object({
  practiceId: z.string().uuid()
});

const startSession = async (req, res) => {
  try {
    const parsed = startSessionSchema.parse(req.body);
    const session = await yogaSessionService.startSession(req.user.id, parsed.practiceId);
    res.status(201).json({ status: 'success', data: session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: 'Invalid data provided' });
    }
    if (error.message === 'Practice not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const session = await yogaSessionService.completeSession(req.user.id, req.params.id);
    res.json({ status: 'success', data: session });
  } catch (error) {
    if (error.message === 'Unauthorized session access') {
      return res.status(403).json({ status: 'error', message: error.message });
    }
    if (error.message === 'Session not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await yogaSessionService.getRecentSessions(req.user.id);
    res.json({ status: 'success', data: sessions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getLibrary,
  getDetail,
  getRecommended,
  startSession,
  completeSession,
  getSessions
};
