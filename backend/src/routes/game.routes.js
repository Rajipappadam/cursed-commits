import express from 'express';
import gameController from '../controllers/game.controller.js';

const router = express.Router();

// Generate game level from commits
router.post('/generate', gameController.generateLevel);

// Start a new game session
router.post('/start', gameController.startGame);

// Submit game score
router.post('/submit-score', gameController.submitScore);

export default router;