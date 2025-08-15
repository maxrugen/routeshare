import { parseStringPromise } from 'xml2js';
import { GPXData, Coordinate } from '../types';
import { ActivityData } from '../schemas/overlaySchema';
import * as fs from 'fs';

export class GPXService {
  /**
   * Parse GPX file and convert to ActivityData
   */
  async parseGPXFile(filePath: string): Promise<ActivityData> {
    try {
      const xmlData = fs.readFileSync(filePath, 'utf8');
      const result = await parseStringPromise(xmlData);
      
      const gpxData = this.parseGPXResult(result);
      return this.convertToActivityData(gpxData);
    } catch (error) {
      throw new Error(`Failed to parse GPX file: ${error}`);
    }
  }

  /**
   * Parse GPX XML result into structured data
   */
  private parseGPXResult(result: any): GPXData {
    const gpx = result.gpx;
    if (!gpx) {
      throw new Error('Invalid GPX file structure');
    }

    const tracks = gpx.trk || [];
    if (tracks.length === 0) {
      throw new Error('No tracks found in GPX file');
    }

    const parsedTracks = tracks.map((track: any) => ({
      name: track.name?.[0] || 'Unknown Activity',
      segments: (track.trkseg || []).map((segment: any) => ({
        points: (segment.trkpt || []).map((point: any) => ({
          lat: parseFloat(point.$.lat),
          lon: parseFloat(point.$.lon),
          elevation: point.ele ? parseFloat(point.ele[0]) : undefined,
          time: point.time ? point.time[0] : undefined
        }))
      }))
    }));

    return { tracks: parsedTracks };
  }

  /**
   * Convert GPX data to ActivityData format
   */
  private convertToActivityData(gpxData: GPXData): ActivityData {
    const track = gpxData.tracks[0];
    const segment = track.segments[0];
    const points = segment.points;

    if (points.length < 2) {
      throw new Error('Insufficient track points in GPX file');
    }

    // Calculate total distance
    const distance = this.calculateTotalDistance(points);
    
    // Calculate total elevation gain
    const elevation = this.calculateTotalElevation(points);
    
    // Calculate duration from timestamps if available
    const duration = this.calculateDuration(points);
    
    // Calculate pace
    const pace = this.calculatePace(distance, duration);

    return {
      id: this.generateId(),
      name: track.name,
      distance,
      duration,
      elevation,
      pace,
      coordinates: points.map(p => ({ lat: p.lat, lng: p.lon, elevation: p.elevation, timestamp: p.time })),
      startTime: points[0].time || new Date().toISOString(),
      type: 'Unknown'
    };
  }

  /**
   * Calculate total distance from track points
   */
  private calculateTotalDistance(points: Array<{ lat: number; lon: number }>): number {
    let totalDistance = 0;
    
    for (let i = 1; i < points.length; i++) {
      totalDistance += this.calculateDistance(
        points[i - 1].lat,
        points[i - 1].lon,
        points[i].lat,
        points[i].lon
      );
    }
    
    return totalDistance;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  /**
   * Calculate total elevation gain
   */
  private calculateTotalElevation(points: Array<{ elevation?: number }>): number {
    let totalElevation = 0;
    
    for (let i = 1; i < points.length; i++) {
      const currentElevation = points[i].elevation || 0;
      const previousElevation = points[i - 1].elevation || 0;
      
      if (currentElevation > previousElevation) {
        totalElevation += currentElevation - previousElevation;
      }
    }
    
    return totalElevation;
  }

  /**
   * Calculate duration from timestamps if available
   */
  private calculateDuration(points: Array<{ lat: number; lon: number; elevation?: number; time?: string }>): number {
    if (points.length < 2) return 0;
    
    const firstPoint = points.find(p => p.time);
    const lastPoint = points.findLast(p => p.time);
    
    if (!firstPoint?.time || !lastPoint?.time) return 0;
    
    const startTime = new Date(firstPoint.time).getTime();
    const endTime = new Date(lastPoint.time).getTime();
    
    return Math.max(0, Math.round((endTime - startTime) / 1000));
  }

  /**
   * Calculate pace in seconds per kilometer
   */
  private calculatePace(distance: number, duration: number): number {
    if (distance === 0) return 0;
    const distanceKm = distance / 1000;
    return duration / distanceKm;
  }

  /**
   * Generate unique ID for activity
   */
  private generateId(): string {
    return `gpx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
