import express from 'express';
import githubRoutes from './github.routes.js';
import userRoutes from './user.routes.js';
import gameRoutes from './game.routes.js';

const router = express.Router();

// Mount routes
router.use('/github', githubRoutes);
router.use('/users', userRoutes);
router.use('/game', gameRoutes);

export default router;