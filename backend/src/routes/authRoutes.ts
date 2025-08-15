import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Strava OAuth routes
router.get('/strava', (req, res) => authController.initiateStravaAuth(req, res));
router.get('/strava/callback', (req, res) => authController.handleStravaCallback(req, res));

// Profile and session management
router.get('/profile', (req, res) => authController.getStravaProfile(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
