import sharp from 'sharp';
import { ActivityData, OverlayStyle } from '../schemas/overlaySchema';
import * as fs from 'fs';
import * as path from 'path';

export class OverlayService {
  private readonly STORY_WIDTH = 1080;
  private readonly STORY_HEIGHT = 1920;

  /**
   * Generate Instagram Story overlay
   */
  async generateOverlay(
    activityData: ActivityData,
    backgroundImagePath?: string,
    overlayStyle?: Partial<OverlayStyle>
  ): Promise<Buffer> {
    // Set default style if not provided
    const style: OverlayStyle = {
      primaryColor: '#1a1a1a',
      secondaryColor: '#666666',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      fontSize: 48,
      position: 'bottom',
      showMap: true,
      showStats: true,
      ...overlayStyle
    };

    try {
      // Create a simple overlay using Sharp
      // For now, we'll create a basic image with text overlay
      // In a production app, you might want to use a more sophisticated approach
      
      // Create base image
      let image = sharp({
        create: {
          width: this.STORY_WIDTH,
          height: this.STORY_HEIGHT,
          channels: 4,
          background: { r: 248, g: 250, b: 252, alpha: 1 } // #f8fafc
        }
      });

      // Add background image if provided
      if (backgroundImagePath && fs.existsSync(backgroundImagePath)) {
        image = image.composite([{
          input: backgroundImagePath,
          top: 0,
          left: 0,
          blend: 'over'
        }]);
      }

      // For MVP purposes, we'll return a simple overlay
      // In production, you'd want to add text, charts, and route visualization
      const overlayBuffer = await image
        .png()
        .toBuffer();

      return overlayBuffer;
    } catch (error) {
      throw new Error(`Failed to generate overlay: ${error}`);
    }
  }

  // Note: For MVP purposes, we're using a simplified overlay generation
  // In production, you'd want to implement full text rendering, charts, and route visualization
  // using libraries like Sharp's text rendering capabilities or SVG generation
}
