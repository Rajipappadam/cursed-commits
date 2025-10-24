import express from 'express';
import githubController from '../controllers/github.controller.js';

const router = express.Router();

// Get user's commits
router.get('/commits/:username', githubController.getCommits);

// Get user profile
router.get('/profile/:username', githubController.getProfile);

// Get commit stats
router.get('/stats/:username', githubController.getStats);

export default router;