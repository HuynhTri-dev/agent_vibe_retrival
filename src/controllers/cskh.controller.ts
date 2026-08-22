/**
 * @file cskh.controller.ts
 * @description Controller handling Banking CSKH operations (authentication, emergency lock, balance inquiry).
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as coreBankingService from '../services/coreBanking.service';

const fastTrackLockSchema = z.object({
  phoneNumber: z.string().min(10),
  nationalIdLast4: z.string().length(4),
  cardId: z.string().optional(),
  reason: z.string().default('LOST_CARD_EMERGENCY'),
});

const standardVerifySchema = z.object({
  phoneNumber: z.string().min(10),
  nationalIdLast4: z.string().length(4),
  birthYear: z.number().int().min(1900).max(2010),
});

/**
 * Handles fast-track emergency identity verification and instant card locking.
 */
export async function handleEmergencyLockCard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { phoneNumber, nationalIdLast4, cardId, reason } = fastTrackLockSchema.parse(req.body);

    const customer = coreBankingService.fastTrackVerify(phoneNumber, nationalIdLast4);
    if (!customer) {
      res.status(401).json({
        success: false,
        code: 'AUTH_FAILED',
        message: 'Thông tin 4 số cuối CCCD không khớp với số điện thoại đăng ký.',
      });
      return;
    }

    const targetCardId = cardId || customer.cards[0]?.cardId;
    if (!targetCardId) {
      res.status(404).json({
        success: false,
        code: 'CARD_NOT_FOUND',
        message: 'Không tìm thấy thẻ hoạt động nào thuộc khách hàng.',
      });
      return;
    }

    const result = await coreBankingService.emergencyLockCard(phoneNumber, targetCardId, reason);

    res.status(200).json({
      success: true,
      code: 'CARD_LOCKED_SUCCESSFULLY',
      data: {
        customerName: customer.fullName,
        cardLast4: result.cardLast4,
        lockedAt: result.lockedAt,
        spokenMessage: `Dạ thẻ của chị ${customer.fullName} đuôi ${result.cardLast4} đã được khóa thành công an toàn lúc ${new Date().toLocaleTimeString('vi-VN')}. Mọi giao dịch phát sinh từ thời điểm này đều sẽ bị từ chối an toàn ạ.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles multi-factor verification for standard banking inquiries.
 */
export function handleStandardAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const { phoneNumber, nationalIdLast4, birthYear } = standardVerifySchema.parse(req.body);
    const customer = coreBankingService.standardVerify(phoneNumber, nationalIdLast4, birthYear);

    if (!customer) {
      res.status(401).json({
        success: false,
        code: 'AUTH_FAILED',
        message: 'Xác thực thông tin không thành công.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        customerId: customer.customerId,
        fullName: customer.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles account balance inquiry with natural spoken text.
 */
export function handleGetBalance(req: Request, res: Response, next: NextFunction): void {
  try {
    const customerId = req.query.customerId as string;
    if (!customerId) {
      res.status(400).json({ success: false, message: 'customerId is required' });
      return;
    }

    const balanceInfo = coreBankingService.getAccountBalanceInfo(customerId);

    res.status(200).json({
      success: true,
      data: balanceInfo,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles recent transaction history inquiry.
 */
export function handleGetTransactions(req: Request, res: Response, next: NextFunction): void {
  try {
    const customerId = req.query.customerId as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;

    if (!customerId) {
      res.status(400).json({ success: false, message: 'customerId is required' });
      return;
    }

    const transactions = coreBankingService.getRecentTransactionsInfo(customerId, limit);

    res.status(200).json({
      success: true,
      data: {
        total: transactions.length,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
}
