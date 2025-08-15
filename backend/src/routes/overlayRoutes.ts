import express from 'express';
import { OverlayController } from '../controllers/overlayController';

const router = express.Router();
const overlayController = new OverlayController();

// Overlay generation
router.post('/generate', (req, res) => overlayController.generateOverlay(req, res));
router.post('/generate/custom', (req, res) => overlayController.generateCustomOverlay(req, res));

// Template management
router.get('/templates', (req, res) => overlayController.getOverlayTemplates(req, res));
router.post('/templates/:templateId/preview', (req, res) => overlayController.generateTemplatePreview(req, res));

export default router;
