import { Request, Response, NextFunction } from 'express';
import { StravaService } from '../services/stravaService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../utils/ApiError';

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
  initiateStravaAuth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUrl = this.stravaService.getAuthUrl();
    res.redirect(authUrl);
  });

  /**
   * Handle Strava OAuth callback
   */
  handleStravaCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      throw ApiError.badRequest('Authorization code is required');
    }

    // Exchange code for access token
    const tokenData = await this.stravaService.exchangeCodeForToken(code);

    // In a real app, you'd store this in a database
    // For MVP, we'll store it in memory (not recommended for production)
    req.session = req.session || {};
    req.session.stravaToken = tokenData;

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?auth=success`);
  });

  /**
   * Get current user's Strava profile
   */
  getStravaProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = req.session?.stravaToken;
    
    if (!token) {
      throw ApiError.unauthorized('Not authenticated with Strava');
    }

    // Check if token is expired
    if (Date.now() >= token.expires_at * 1000) {
      // Token expired, try to refresh
      try {
        const newToken = await this.stravaService.refreshToken(token.refresh_token);
        req.session!.stravaToken = newToken;
        
        res.json({
          success: true,
          athlete: newToken.athlete,
          isAuthenticated: true
        });
      } catch (refreshError) {
        // Refresh failed, user needs to re-authenticate
        delete req.session!.stravaToken;
        throw ApiError.unauthorized('Token expired, please re-authenticate');
      }
      return;
    }

    res.json({
      success: true,
      athlete: token.athlete,
      isAuthenticated: true
    });
  });

  /**
   * Logout from Strava
   */
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    delete req.session!.stravaToken;
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  });
}
