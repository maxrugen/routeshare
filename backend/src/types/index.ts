// Activity data types - now imported from schemas
export interface ActivityData {
  id: string;
  name: string;
  distance: number; // in meters
  duration: number; // in seconds
  elevation: number; // in meters
  pace: number; // in seconds per kilometer
  coordinates: Coordinate[];
  startTime: string;
  type: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: string;
}

// Strava API types
export interface StravaToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
  };
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  type: string;
  map: {
    summary_polyline: string;
  };
}

// Overlay generation types
export interface OverlayRequest {
  activityData: ActivityData;
  backgroundImage?: string;
  overlayStyle: OverlayStyle;
}

export interface OverlayStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontSize: number;
  position: 'top' | 'center' | 'bottom';
  showMap: boolean;
  showStats: boolean;
}

// File upload types
export interface GPXData {
  tracks: Array<{
    name: string;
    segments: Array<{
      points: Array<{
        lat: number;
        lon: number;
        elevation?: number;
        time?: string;
      }>;
    }>;
  }>;
}

// Session types for Express
declare module 'express-session' {
  interface SessionData {
    stravaToken?: StravaToken;
  }
}
