/**
 * @file guardrail.middleware.ts
 * @description Security filter detecting prompt injection, system overrides, and unauthorized commands.
 */

import { Request, Response, NextFunction } from 'express';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /bỏ\s+qua\s+(hết\s+)?(các\s+)?(lệnh|quy\s+tắc|chỉ\s+thị)/i,
  /you\s+are\s+now\s+(the\s+)?(ceo|boss|admin|system)/i,
  /bạn\s+bây\s+giờ\s+là\s+(tổng\s+giám\s+đốc|chủ\s+tịch|admin)/i,
  /xóa\s+toàn\s+bộ\s+(khoản\s+)?nợ/i,
  /delete\s+all\s+(debts|records)/i,
  /system\s+prompt\s+override/i,
];

/**
 * Validates text inputs against prompt injection patterns.
 * @param {string} input - User message text.
 * @returns {boolean} True if injection pattern detected.
 */
export function checkPromptInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Express middleware that checks incoming text prompts for injection attempts.
 */
export function guardrailMiddleware(req: Request, res: Response, next: NextFunction): void {
  const textToCheck = req.body?.message || req.body?.prompt || req.body?.transcript;

  if (typeof textToCheck === 'string' && checkPromptInjection(textToCheck)) {
    res.status(403).json({
      success: false,
      code: 'PROMPT_INJECTION_DETECTED',
      message: 'Dạ em là trợ lý ảo hỗ trợ thông tin theo quy định của Ngân hàng An Bình, em không có thẩm quyền thực hiện yêu cầu này ạ.',
    });
    return;
  }

  next();
}
