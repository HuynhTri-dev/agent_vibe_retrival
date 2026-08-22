/**
 * @file debt.controller.ts
 * @description Controller handling Debt Collection outbound campaigns, debtor verification, PTP commitments, and CRM disposition codes.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as debtService from '../services/debtCollection.service';
import { formatVNDSpokenText } from '../services/coreBanking.service';

const debtorVerifySchema = z.object({
  phoneNumber: z.string().min(10),
  claimedName: z.string().min(2),
});

const ptpCommitSchema = z.object({
  contractId: z.string().min(3),
  ptpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ptpAmount: z.number().positive(),
  paymentChannel: z.string().default('CHUYEN_KHOAN'),
});

const dispositionUpdateSchema = z.object({
  contractId: z.string().min(3),
  status: z.enum(['PTP', 'NO_ANSWER', 'WRONG_PERSON', 'DISPUTE_PAYMENT', 'REFUSAL']),
  notes: z.string().optional(),
});

/**
 * Retrieves debt campaign details for an outbound call (validates legal calling hours).
 */
export function handleGetCampaignDetails(req: Request, res: Response, next: NextFunction): void {
  try {
    const phoneNumber = req.query.phoneNumber as string;
    if (!phoneNumber) {
      res.status(400).json({ success: false, message: 'phoneNumber is required' });
      return;
    }

    const isLegalHours = debtService.isWithinLegalCallingHours();
    if (!isLegalHours) {
      res.status(403).json({
        success: false,
        code: 'OUT_OF_LEGAL_CALLING_HOURS',
        message: 'Hiện tại nằm ngoài khung giờ gọi nhắc nợ theo quy định (08:00 - 21:00).',
      });
      return;
    }

    const contract = debtService.getDebtContractByPhone(phoneNumber);
    if (!contract) {
      res.status(404).json({
        success: false,
        code: 'CONTRACT_NOT_FOUND',
        message: 'Không tìm thấy hồ sơ quá hạn cho số điện thoại này.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        contractId: contract.contractId,
        debtorName: contract.debtorName,
        overdueDays: contract.overdueDays,
        totalDebtAmount: contract.totalDebtAmount,
        spokenAmount: formatVNDSpokenText(contract.totalDebtAmount),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verifies if caller matches the primary debtor before disclosing debt information.
 */
export function handleVerifyDebtor(req: Request, res: Response, next: NextFunction): void {
  try {
    const { phoneNumber, claimedName } = debtorVerifySchema.parse(req.body);
    const isMatched = debtService.verifyPrimaryDebtor(phoneNumber, claimedName);

    if (!isMatched) {
      res.status(200).json({
        success: true,
        isPrimaryDebtor: false,
        action: 'DO_NOT_DISCLOSE_DEBT',
        spokenGuidance: 'Dạ em cảm ơn anh/chị. Nhờ anh/chị chuyển lời giúp chủ hợp đồng vui lòng liên hệ lại tổng đài Ngân hàng An Bình sớm nhất giúp em nhé ạ.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      isPrimaryDebtor: true,
      action: 'PROCEED_TO_DEBT_DISCLOSURE',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Records a Promise-to-Pay (PTP) commitment and triggers instant SMS/ZNS.
 */
export async function handleCommitPTP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { contractId, ptpDate, ptpAmount, paymentChannel } = ptpCommitSchema.parse(req.body);

    const result = await debtService.commitPromiseToPay(
      contractId,
      ptpDate,
      ptpAmount,
      paymentChannel
    );

    res.status(200).json({
      success: true,
      code: 'PTP_RECORDED_SUCCESSFULLY',
      data: {
        contractId: result.contractId,
        disposition: result.disposition,
        spokenConfirmation: `Dạ em đã ghi nhận lịch hẹn thanh toán của anh/chị là ngày ${ptpDate} với số tiền là ${result.spokenAmount}. Tin nhắn SMS xác nhận và số tài khoản nộp tiền đã được gửi ngay đến máy của anh/chị rồi ạ.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates CRM disposition code based on call outcome.
 */
export function handleUpdateDisposition(req: Request, res: Response, next: NextFunction): void {
  try {
    const { contractId, status, notes } = dispositionUpdateSchema.parse(req.body);
    const result = debtService.updateDispositionStatus(contractId, status, notes);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
