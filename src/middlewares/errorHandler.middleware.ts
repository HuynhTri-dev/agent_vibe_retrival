/**
 * @file errorHandler.middleware.ts
 * @description Centralized error handling middleware.
 */

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Global Express Error Handler.
 * @param {AppError} err - Error object.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 * @param {NextFunction} next - Express Next function.
 */
export function errorHandlerMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[ERROR] [${req.method} ${req.path}] - Status: ${statusCode} - Code: ${errorCode}`, {
    message: err.message,
    details: err.details || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred.',
      details: err.details || undefined,
    },
  });
}
