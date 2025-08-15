import express from 'express';
import { GPXController } from '../controllers/gpxController';

const router = express.Router();
const gpxController = new GPXController();

// GPX file upload and parsing
router.post('/upload', (req, res) => gpxController.uploadGPX(req, res));

// Get sample GPX data for testing
router.get('/sample', (req, res) => gpxController.getSampleGPX(req, res));

export default router;
