/**
 * @file dataMasking.middleware.ts
 * @description PCI-DSS and PII Data Masking utility and Express middleware.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Regex patterns for identifying sensitive banking data.
 */
const PATTERNS = {
  // 16-digit card number (with or without spaces/dashes)
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}(\d{4})\b/g,
  // 12-digit Vietnamese CCCD (National ID)
  CCCD: /\b\d{8}(\d{4})\b/g,
  // 3 or 4 digit CVV/CVC
  CVV: /\b(cvv|cvc|security code)[\s:=]+(\d{3,4})\b/gi,
  // 6-digit OTP code
  OTP: /\b(otp|verification code)[\s:=]+(\d{4,6})\b/gi,
};

/**
 * Recursively masks sensitive fields in any object or string.
 * @param {any} data - The data structure to mask.
 * @returns {any} The masked data structure.
 */
export function maskSensitiveData(data: any): any {
  if (typeof data === 'string') {
    return data
      .replace(PATTERNS.CREDIT_CARD, 'XXXX-XXXX-XXXX-$1')
      .replace(PATTERNS.CCCD, 'XXXXXXXX$1')
      .replace(PATTERNS.CVV, '$1: [REDACTED_CVV]')
      .replace(PATTERNS.OTP, '$1: [REDACTED_OTP]');
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  if (data !== null && typeof data === 'object') {
    const maskedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('cvv') || lowerKey.includes('cvc')) {
        maskedObj[key] = '[REDACTED_CVV]';
      } else if (lowerKey.includes('otp') || lowerKey.includes('pin')) {
        maskedObj[key] = '[REDACTED_OTP]';
      } else if (lowerKey.includes('cardnumber') && typeof value === 'string') {
        maskedObj[key] = value.replace(PATTERNS.CREDIT_CARD, 'XXXX-XXXX-XXXX-$1');
      } else {
        maskedObj[key] = maskSensitiveData(value);
      }
    }
    return maskedObj;
  }

  return data;
}

/**
 * Express middleware that intercepts and masks sensitive data in request logging.
 */
export function dataMaskingMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.body && Object.keys(req.body).length > 0) {
    const maskedLog = maskSensitiveData(req.body);
    // Attach masked body for safe logging
    (req as any).maskedBody = maskedLog;
  }
  next();
}
