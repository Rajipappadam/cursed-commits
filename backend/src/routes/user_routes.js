import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

// Create or update user
router.post('/', userController.upsertUser);

// Get user by username
router.get('/:username', userController.getUser);

export default router;