import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, query, and params
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');

        next(ApiError.badRequest(`Validation failed: ${errorMessages}`));
      } else {
        next(ApiError.badRequest('Invalid request data'));
      }
    }
  };
};

// Specialized validation for different parts of the request
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');

        next(ApiError.badRequest(`Invalid request body: ${errorMessages}`));
      } else {
        next(ApiError.badRequest('Invalid request body'));
      }
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');

        next(ApiError.badRequest(`Invalid query parameters: ${errorMessages}`));
      } else {
        next(ApiError.badRequest('Invalid query parameters'));
      }
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');

        next(ApiError.badRequest(`Invalid path parameters: ${errorMessages}`));
      } else {
        next(ApiError.badRequest('Invalid path parameters'));
      }
    }
  };
};
