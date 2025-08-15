import sharp from 'sharp';
import { ActivityData, OverlayStyle, Coordinate } from '../schemas/overlaySchema';

export class OverlayService {
  private readonly STORY_WIDTH = 1080;
  private readonly STORY_HEIGHT = 1920;

  /**
   * Scales GPS coordinates to fit within a specified view box.
   */
  private getMapPath(coordinates: Coordinate[], viewBoxWidth: number, viewBoxHeight: number): string {
    if (coordinates.length < 2) {
      return '';
    }

    const padding = 20; // Padding within the viewBox
    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const effectiveWidth = viewBoxWidth - padding * 2;
    const effectiveHeight = viewBoxHeight - padding * 2;

    const scaleX = effectiveWidth / lngRange;
    const scaleY = effectiveHeight / latRange;
    const scale = Math.min(scaleX, scaleY);

    const pathData = coordinates.map((coord, index) => {
        const x = padding + (coord.lng - minLng) * scale;
        // SVG y-coordinates are top-to-bottom, so we subtract from height
        const y = padding + (maxLat - coord.lat) * scale;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');

    return pathData;
  }
  
  /**
   * Generates the SVG string for the overlay.
   */
  private generateSvgOverlay(activityData: ActivityData, style: OverlayStyle): string {
    // Helper to format duration
    const formatDuration = (totalSeconds: number) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
    };

    const mapPath = style.showMap ? this.getMapPath(activityData.coordinates, 800, 450) : '';

    return `
      <svg width="${this.STORY_WIDTH}" height="${this.STORY_HEIGHT}" viewBox="0 0 ${this.STORY_WIDTH} ${this.STORY_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: ${style.primaryColor};
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 80px;
            box-sizing: border-box;
          }
          .stats {
            display: flex;
            justify-content: space-between;
            width: 100%;
            border-bottom: 2px solid ${style.secondaryColor};
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .stat-value {
            font-size: 72px;
            font-weight: 700;
          }
          .stat-label {
            font-size: 28px;
            font-weight: 400;
            color: ${style.secondaryColor};
          }
          .map-container {
            width: 100%;
            border: 2px solid ${style.secondaryColor};
            border-radius: 20px;
            padding: 20px;
            box-sizing: border-box;
          }
        </style>
        <foreignObject x="0" y="0" width="${this.STORY_WIDTH}" height="${this.STORY_HEIGHT}">
          <div xmlns="http://www.w3.org/1999/xhtml" class="container">
            ${style.showMap && mapPath ? `
              <div class="map-container">
                <svg width="100%" height="100%" viewBox="0 0 800 450">
                  <path d="${mapPath}" fill="none" stroke="${style.primaryColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            ` : ''}
            ${style.showStats ? `
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">${(activityData.distance / 1000).toFixed(2)}</div>
                  <div class="stat-label">km</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${formatDuration(activityData.duration)}</div>
                  <div class="stat-label">Time</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${Math.round(activityData.elevation)}</div>
                  <div class="stat-label">m</div>
                </div>
              </div>
            ` : ''}
          </div>
        </foreignObject>
      </svg>
    `;
  }

  /**
   * Generate Instagram Story overlay
   */
  async generateOverlay(
    activityData: ActivityData,
    backgroundImage: string | null, // Changed from path to base64 string
    overlayStyle?: Partial<OverlayStyle>
  ): Promise<Buffer> {
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
      // Create the SVG overlay with data
      const svgOverlay = this.generateSvgOverlay(activityData, style);
      const svgBuffer = Buffer.from(svgOverlay);

      // Create a base layer: either a transparent background or the user's image
      let baseImage;
      if (backgroundImage) {
        // User provided a background image (as base64 data URL)
        const imageBuffer = Buffer.from(backgroundImage.split(',')[1], 'base64');
        baseImage = sharp(imageBuffer)
          .resize(this.STORY_WIDTH, this.STORY_HEIGHT, { fit: 'cover' });
      } else {
        // No background image, create a transparent canvas
        baseImage = sharp({
          create: {
            width: this.STORY_WIDTH,
            height: this.STORY_HEIGHT,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        });
      }

      // Composite the SVG overlay on top of the base layer
      const finalImageBuffer = await baseImage
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();

      return finalImageBuffer;

    } catch (error) {
      console.error('Error during overlay generation:', error);
      throw new Error(`Failed to generate overlay: ${error}`);
    }
  }
}