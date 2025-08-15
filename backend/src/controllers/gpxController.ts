import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { GPXService } from '../services/gpxService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../utils/ApiError';
import { ActivityData } from '../schemas/overlaySchema';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Only allow GPX files
  if (file.mimetype === 'application/gpx+xml' || 
      file.originalname.toLowerCase().endsWith('.gpx')) {
    cb(null, true);
  } else {
    cb(new Error('Only GPX files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

export class GPXController {
  private gpxService: GPXService;

  constructor() {
    this.gpxService = new GPXService();
  }

  /**
   * Upload and parse GPX file
   */
  uploadGPX = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Use multer middleware with promise-based approach
    await new Promise<void>((resolve, reject) => {
      upload.single('gpxFile')(req, res, async (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              reject(ApiError.badRequest('File too large. Maximum size is 10MB.'));
            } else {
              reject(ApiError.badRequest(`Upload error: ${err.message}`));
            }
          } else {
            reject(ApiError.badRequest(err.message));
          }
          return;
        }

        if (!req.file) {
          reject(ApiError.badRequest('No file uploaded'));
          return;
        }

        try {
          // Parse the GPX file
          const activityData = await this.gpxService.parseGPXFile(req.file.path);
          
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: 'GPX file parsed successfully',
            activityData
          });
          resolve();
        } catch (parseError) {
          // Clean up uploaded file on error
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          
          reject(ApiError.badRequest(
            `Failed to parse GPX file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
          ));
        }
      });
    });
  });

  // (Sample endpoint removed)
}
