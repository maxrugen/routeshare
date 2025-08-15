import axios from 'axios';
import { StravaToken, StravaActivity, ActivityData } from '../types';

export class StravaService {
  private baseUrl = 'https://www.strava.com/api/v3';
  private authUrl = 'https://www.strava.com/oauth';

  constructor(
    private clientId: string,
    private clientSecret: string,
    private redirectUri: string
  ) {}

  /**
   * Generate Strava OAuth authorization URL
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      approval_prompt: 'force',
      scope: 'activity:read_all'
    });

    return `${this.authUrl}/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<StravaToken> {
    try {
      const response = await axios.post(`${this.authUrl}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code'
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<StravaToken> {
    try {
      const response = await axios.post(`${this.authUrl}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Get user's activities from Strava
   */
  async getActivities(accessToken: string, limit: number = 10): Promise<StravaActivity[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/athlete/activities`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          per_page: limit,
          page: 1
        }
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch activities');
    }
  }

  /**
   * Get detailed activity data including route coordinates
   */
  async getActivityDetails(accessToken: string, activityId: number): Promise<ActivityData> {
    try {
      const response = await axios.get(`${this.baseUrl}/activities/${activityId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const activity = response.data;
      
      // Convert Strava activity to our ActivityData format
      return {
        id: activity.id.toString(),
        name: activity.name,
        distance: activity.distance,
        duration: activity.moving_time,
        elevation: activity.total_elevation_gain,
        pace: this.calculatePace(activity.distance, activity.moving_time),
        coordinates: this.decodePolyline(activity.map.summary_polyline),
        startTime: activity.start_date,
        type: activity.type
      };
    } catch (error) {
      throw new Error('Failed to fetch activity details');
    }
  }

  /**
   * Calculate pace in seconds per kilometer
   */
  private calculatePace(distance: number, duration: number): number {
    const distanceKm = distance / 1000;
    return duration / distanceKm;
  }

  /**
   * Decode Strava polyline to coordinates
   * This is a simplified version - you might want to use a proper polyline library
   */
  private decodePolyline(polyline: string): Array<{ lat: number; lng: number }> {
    // This is a basic polyline decoder
    // For production, consider using a library like @mapbox/polyline
    const coordinates: Array<{ lat: number; lng: number }> = [];
    
    if (!polyline) return coordinates;

    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < polyline.length) {
      let shift = 0;
      let result = 0;

      do {
        let b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        let b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      coordinates.push({
        lat: lat / 1e5,
        lng: lng / 1e5
      });
    }

    return coordinates;
  }
}
