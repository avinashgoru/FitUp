const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const yogaController = require('../controllers/yoga.controller');

// All yoga routes protected
router.use(requireAuth);

router.get('/', yogaController.getLibrary);
router.get('/recommended', yogaController.getRecommended);
router.get('/detail/:slug', yogaController.getDetail);
router.get('/sessions', yogaController.getSessions);
router.post('/sessions', yogaController.startSession);
router.post('/sessions/:id/complete', yogaController.completeSession);

module.exports = router;
