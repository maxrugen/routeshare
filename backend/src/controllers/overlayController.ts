import { Request, Response, NextFunction } from 'express';
import { OverlayService } from '../services/overlayService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../utils/ApiError';
import { 
  OverlayRequest, 
  CustomOverlayRequest, 
  TemplatePreviewRequest,
  OverlayStyle,
  ActivityData 
} from '../schemas/overlaySchema';

export class OverlayController {
  private overlayService: OverlayService;

  constructor() {
    this.overlayService = new OverlayService();
  }

  /**
   * Generate Instagram Story overlay
   */
  generateOverlay = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { activityData, backgroundImage, overlayStyle } = req.body as OverlayRequest;

    // Generate overlay
    const overlayBuffer = await this.overlayService.generateOverlay(
      activityData,
      backgroundImage,
      overlayStyle
    );

    // Set response headers for image download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="instagram-story-overlay.png"');
    res.setHeader('Content-Length', overlayBuffer.length.toString());

    res.send(overlayBuffer);
  });

  /**
   * Generate overlay with custom styling
   */
  generateCustomOverlay = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { activityData, backgroundImage, customStyle } = req.body as CustomOverlayRequest;

    // Merge custom style with defaults
    const overlayStyle: OverlayStyle = {
      primaryColor: '#1a1a1a',
      secondaryColor: '#666666',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      fontSize: 48,
        position: 'bottom',
        showMap: true,
        showStats: true,
        ...customStyle
      };

      // Generate overlay
      const overlayBuffer = await this.overlayService.generateOverlay(
        activityData,
        backgroundImage,
        overlayStyle
      );

      // Set response headers for image download
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="custom-overlay.png"');
      res.setHeader('Content-Length', overlayBuffer.length.toString());

      res.send(overlayBuffer);
    });

  /**
   * Get available overlay templates
   */
  async getOverlayTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = [
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Clean, simple design with essential stats',
          preview: '/api/overlay/templates/minimal/preview',
          style: {
            primaryColor: '#1a1a1a',
            secondaryColor: '#666666',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontSize: 48,
            position: 'bottom',
            showMap: true,
            showStats: true
          }
        },
        {
          id: 'bold',
          name: 'Bold',
          description: 'High contrast design with large text',
          preview: '/api/overlay/templates/bold/preview',
          style: {
            primaryColor: '#ffffff',
            secondaryColor: '#cccccc',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            fontSize: 56,
            position: 'center',
            showMap: true,
            showStats: true
          }
        },
        {
          id: 'colorful',
          name: 'Colorful',
          description: 'Vibrant colors with gradient backgrounds',
          preview: '/api/overlay/templates/colorful/preview',
          style: {
            primaryColor: '#3b82f6',
            secondaryColor: '#1e40af',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fontSize: 52,
            position: 'top',
            showMap: true,
            showStats: true
          }
        }
      ];

      res.json({ templates });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get overlay templates' });
    }
  }

  /**
   * Generate preview for a specific template
   */
  generateTemplatePreview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { templateId } = req.params;
    const { activityData } = req.body as TemplatePreviewRequest;

    // Get template style
    const templateStyle = this.getTemplateStyle(templateId);
    if (!templateStyle) {
      throw ApiError.notFound('Template not found');
    }

    // Generate preview overlay
    const overlayBuffer = await this.overlayService.generateOverlay(
      activityData,
      undefined, // No background image for preview
      templateStyle
    );

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Content-Length', overlayBuffer.length.toString());

    res.send(overlayBuffer);
  });



  /**
   * Get template style by ID
   */
  private getTemplateStyle(templateId: string): OverlayStyle | null {
    const templates: { [key: string]: OverlayStyle } = {
      minimal: {
        primaryColor: '#1a1a1a',
        secondaryColor: '#666666',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        fontSize: 48,
        position: 'bottom',
        showMap: true,
        showStats: true
      },
      bold: {
        primaryColor: '#ffffff',
        secondaryColor: '#cccccc',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fontSize: 56,
        position: 'center',
        showMap: true,
        showStats: true
      },
      colorful: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fontSize: 52,
        position: 'top',
        showMap: true,
        showStats: true
      }
    };

    return templates[templateId] || null;
  }
}
