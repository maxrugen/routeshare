import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Strava OAuth routes
router.get('/strava', authController.initiateStravaAuth);
router.get('/strava/callback', authController.handleStravaCallback);

// Profile and session management
router.get('/profile', authController.getStravaProfile);
router.post('/logout', authController.logout);

export default router;
