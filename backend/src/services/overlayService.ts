import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
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
    // Create canvas with Instagram Story dimensions
    const canvas = createCanvas(this.STORY_WIDTH, this.STORY_HEIGHT);
    const ctx = canvas.getContext('2d');

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

    // Draw background image if provided
    if (backgroundImagePath && fs.existsSync(backgroundImagePath)) {
      await this.drawBackgroundImage(ctx, backgroundImagePath);
    } else {
      // Draw default gradient background
      this.drawDefaultBackground(ctx);
    }

    // Draw overlay content
    if (style.showStats) {
      this.drawActivityStats(ctx, activityData, style);
    }

    if (style.showMap && activityData.coordinates.length > 0) {
      this.drawRouteMap(ctx, activityData.coordinates, style);
    }

    // Draw activity name
    this.drawActivityName(ctx, activityData.name, style);

    // Return as PNG buffer
    return canvas.toBuffer('image/png');
  }

  /**
   * Draw background image with proper scaling
   */
  private async drawBackgroundImage(ctx: CanvasRenderingContext2D, imagePath: string): Promise<void> {
    try {
      const image = await loadImage(imagePath);
      
      // Calculate scaling to cover the entire canvas while maintaining aspect ratio
      const scale = Math.max(
        this.STORY_WIDTH / image.width,
        this.STORY_HEIGHT / image.height
      );
      
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      // Center the image
      const x = (this.STORY_WIDTH - scaledWidth) / 2;
      const y = (this.STORY_HEIGHT - scaledHeight) / 2;
      
      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    } catch (error) {
      console.error('Failed to load background image:', error);
      this.drawDefaultBackground(ctx);
    }
  }

  /**
   * Draw default gradient background
   */
  private drawDefaultBackground(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.STORY_HEIGHT);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.STORY_WIDTH, this.STORY_HEIGHT);
  }

  /**
   * Draw activity statistics
   */
  private drawActivityStats(ctx: CanvasRenderingContext2D, activityData: ActivityData, style: OverlayStyle): void {
    const stats = [
      { label: 'Distance', value: this.formatDistance(activityData.distance) },
      { label: 'Duration', value: this.formatDuration(activityData.duration) },
      { label: 'Elevation', value: this.formatElevation(activityData.elevation) },
      { label: 'Pace', value: this.formatPace(activityData.pace) }
    ];

    const startY = style.position === 'top' ? 120 : this.STORY_HEIGHT - 400;
    const spacing = 80;

    stats.forEach((stat, index) => {
      const y = startY + (index * spacing);
      
      // Draw label
      ctx.fillStyle = style.secondaryColor;
      ctx.font = `400 ${style.fontSize * 0.6}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(stat.label, 60, y);
      
      // Draw value
      ctx.fillStyle = style.primaryColor;
      ctx.font = `600 ${style.fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillText(stat.value, 60, y + 45);
    });
  }

  /**
   * Draw route map
   */
  private drawRouteMap(ctx: CanvasRenderingContext2D, coordinates: Array<{ lat: number; lng: number }>, style: OverlayStyle): void {
    if (coordinates.length < 2) return;

    // Calculate bounds
    const bounds = this.calculateBounds(coordinates);
    const padding = 40;
    const mapWidth = this.STORY_WIDTH - (padding * 2);
    const mapHeight = 400;
    const mapY = style.position === 'top' ? 500 : 200;

    // Draw map background
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(padding, mapY, mapWidth, mapHeight);

    // Draw route line
    ctx.strokeStyle = style.primaryColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    coordinates.forEach((coord, index) => {
      const x = this.longitudeToX(coord.lng, bounds, padding, mapWidth);
      const y = this.latitudeToY(coord.lat, bounds, mapY, mapHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw start and end markers
    const startCoord = coordinates[0];
    const endCoord = coordinates[coordinates.length - 1];
    
    const startX = this.longitudeToX(startCoord.lng, bounds, padding, mapWidth);
    const startY = this.latitudeToY(startCoord.lat, bounds, mapY, mapHeight);
    const endX = this.longitudeToX(endCoord.lng, bounds, padding, mapWidth);
    const endY = this.latitudeToY(endCoord.lat, bounds, mapY, mapHeight);

    // Start marker (green)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // End marker (red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Draw activity name
   */
  private drawActivityName(ctx: CanvasRenderingContext2D, name: string, style: OverlayStyle): void {
    const maxWidth = this.STORY_WIDTH - 120;
    const fontSize = Math.min(style.fontSize * 1.2, 72);
    
    ctx.fillStyle = style.primaryColor;
    ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    
    // Truncate name if too long
    let displayName = name;
    if (ctx.measureText(name).width > maxWidth) {
      displayName = name.substring(0, 20) + '...';
    }
    
    const y = style.position === 'top' ? 60 : this.STORY_HEIGHT - 60;
    ctx.fillText(displayName, this.STORY_WIDTH / 2, y);
  }

  /**
   * Calculate bounds of coordinates
   */
  private calculateBounds(coordinates: Array<{ lat: number; lng: number }>) {
    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);
    
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  }

  /**
   * Convert longitude to X coordinate
   */
  private longitudeToX(lng: number, bounds: any, padding: number, mapWidth: number): number {
    return padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth;
  }

  /**
   * Convert latitude to Y coordinate
   */
  private latitudeToY(lat: number, bounds: any, mapY: number, mapHeight: number): number {
    return mapY + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight;
  }

  /**
   * Format distance for display
   */
  private formatDistance(distance: number): string {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  }

  /**
   * Format duration for display
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Format elevation for display
   */
  private formatElevation(meters: number): string {
    return `${Math.round(meters)} m`;
  }

  /**
   * Format pace for display
   */
  private formatPace(secondsPerKm: number): string {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.round(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
  }
}
