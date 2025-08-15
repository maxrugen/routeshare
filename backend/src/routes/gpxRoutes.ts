import express from 'express';
import { GPXController } from '../controllers/gpxController';

const router = express.Router();
const gpxController = new GPXController();

// GPX file upload and parsing
router.post('/upload', gpxController.uploadGPX);

// (Sample route removed)

export default router;
