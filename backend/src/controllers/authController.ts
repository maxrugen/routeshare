import { Request, Response } from 'express';
import { StravaService } from '../services/stravaService';

export class AuthController {
  private stravaService: StravaService;

  constructor() {
    this.stravaService = new StravaService(
      process.env.STRAVA_CLIENT_ID!,
      process.env.STRAVA_CLIENT_SECRET!,
      process.env.REDIRECT_URI!
    );
  }

  /**
   * Initiate Strava OAuth flow
   */
  async initiateStravaAuth(req: Request, res: Response): Promise<void> {
    try {
      const authUrl = this.stravaService.getAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      res.status(500).json({ error: 'Failed to initiate Strava authentication' });
    }
  }

  /**
   * Handle Strava OAuth callback
   */
  async handleStravaCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
      }

      // Exchange code for access token
      const tokenData = await this.stravaService.exchangeCodeForToken(code);

      // In a real app, you'd store this in a database
      // For MVP, we'll store it in memory (not recommended for production)
      req.session = req.session || {};
      req.session.stravaToken = tokenData;

      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?auth=success`);
    } catch (error) {
      console.error('Strava callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?auth=error`);
    }
  }

  /**
   * Get current user's Strava profile
   */
  async getStravaProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.session?.stravaToken;
      
      if (!token) {
        res.status(401).json({ error: 'Not authenticated with Strava' });
        return;
      }

      // Check if token is expired
      if (Date.now() >= token.expires_at * 1000) {
        // Token expired, try to refresh
        try {
          const newToken = await this.stravaService.refreshToken(token.refresh_token);
          req.session!.stravaToken = newToken;
          
          res.json({
            athlete: newToken.athlete,
            isAuthenticated: true
          });
        } catch (refreshError) {
          // Refresh failed, user needs to re-authenticate
          delete req.session!.stravaToken;
          res.status(401).json({ error: 'Token expired, please re-authenticate' });
        }
        return;
      }

      res.json({
        athlete: token.athlete,
        isAuthenticated: true
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get Strava profile' });
    }
  }

  /**
   * Logout from Strava
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      delete req.session!.stravaToken;
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to logout' });
    }
  }
}
