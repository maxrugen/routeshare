import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
}

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';

  // If it's our custom ApiError, use its properties
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    // Handle validation errors (e.g., from Zod)
    statusCode = 400;
    message = error.message;
  } else if (error.name === 'MulterError') {
    // Handle file upload errors
    statusCode = 400;
    message = `File upload error: ${error.message}`;
  } else if (error.name === 'CastError') {
    // Handle MongoDB casting errors
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    // Handle expired JWT tokens
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error for debugging (in production, you might want to use a proper logging service)
  console.error(`[${new Date().toISOString()}] Error ${statusCode}: ${message}`);
  console.error(`Path: ${req.path}`);
  console.error(`Method: ${req.method}`);
  if (error.stack && process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', error.stack);
  }

  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper for controllers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
