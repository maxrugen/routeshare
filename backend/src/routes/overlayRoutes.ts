import express from 'express';
import { OverlayController } from '../controllers/overlayController';
import { validateBody } from '../middleware/validateRequest';
import { 
  overlayRequestSchema, 
  customOverlayRequestSchema, 
  templatePreviewRequestSchema 
} from '../schemas/overlaySchema';

const router = express.Router();
const overlayController = new OverlayController();

// Overlay generation
router.post('/generate', 
  validateBody(overlayRequestSchema), 
  overlayController.generateOverlay
);

router.post('/generate/custom', 
  validateBody(customOverlayRequestSchema), 
  overlayController.generateCustomOverlay
);

// Template management
router.get('/templates', overlayController.getOverlayTemplates);

router.post('/templates/:templateId/preview', 
  validateBody(templatePreviewRequestSchema), 
  overlayController.generateTemplatePreview
);

export default router;
