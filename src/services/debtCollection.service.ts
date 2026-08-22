/**
 * @file debtCollection.service.ts
 * @description Debt Collection management service handling outbound campaigns, PTP commitments, and CRM disposition codes.
 */

import { sendInstantNotification } from './notification.service';
import { formatVNDSpokenText } from './coreBanking.service';

export interface DebtContract {
  contractId: string;
  debtorName: string;
  phoneNumber: string;
  nationalIdLast4: string;
  overdueDays: number;
  totalDebtAmount: number;
  minPaymentAmount: number;
  dispositionStatus: 'NEW' | 'PTP' | 'NO_ANSWER' | 'WRONG_PERSON' | 'DISPUTE_PAYMENT' | 'REFUSAL';
  ptpDetails?: {
    ptpDate: string;
    ptpAmount: number;
    paymentChannel: string;
    committedAt: string;
  };
}

// In-memory mock Debt Collection CRM database
const MOCK_DEBT_CONTRACTS: Record<string, DebtContract> = {
  '0901234567': {
    contractId: 'LD-8890',
    debtorName: 'Lê Hoàng Long',
    phoneNumber: '0901234567',
    nationalIdLast4: '1109',
    overdueDays: 5,
    totalDebtAmount: 2350000,
    minPaymentAmount: 2350000,
    dispositionStatus: 'NEW',
  },
  '0933445566': {
    contractId: 'CC-4421',
    debtorName: 'Phạm Quốc Tuấn',
    phoneNumber: '0933445566',
    nationalIdLast4: '5567',
    overdueDays: 14,
    totalDebtAmount: 10200000,
    minPaymentAmount: 5000000,
    dispositionStatus: 'NEW',
  },
};

/**
 * Checks whether the current local time is within the legal outbound calling window (08:00 - 21:00).
 * @returns {boolean} True if within permitted hours.
 */
export function isWithinLegalCallingHours(): boolean {
  const currentHour = new Date().getHours();
  // Legal window: 8 AM to 9 PM (21:00)
  return currentHour >= 8 && currentHour < 21;
}

/**
 * Retrieves outbound debt campaign contract by phone number.
 * @param {string} phoneNumber - Customer phone number.
 */
export function getDebtContractByPhone(phoneNumber: string): DebtContract | null {
  return MOCK_DEBT_CONTRACTS[phoneNumber] || null;
}

/**
 * Verifies if the person on the call is the primary debtor before disclosing debt information.
 * @param {string} phoneNumber - Debtor phone number.
 * @param {string} claimedName - Name confirmed by caller.
 * @returns {boolean} True if identity matches.
 */
export function verifyPrimaryDebtor(phoneNumber: string, claimedName: string): boolean {
  const contract = MOCK_DEBT_CONTRACTS[phoneNumber];
  if (!contract) return false;

  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  return normalize(contract.debtorName) === normalize(claimedName);
}

/**
 * Records a Promise-to-Pay (PTP) commitment and dispatches instant SMS/ZNS confirmation.
 * @param {string} contractId - The debt contract ID.
 * @param {string} ptpDate - Promised payment date (YYYY-MM-DD).
 * @param {number} ptpAmount - Promised payment amount.
 * @param {string} paymentChannel - Payment method (e.g. Bank Transfer, App, Counter).
 */
export async function commitPromiseToPay(
  contractId: string,
  ptpDate: string,
  ptpAmount: number,
  paymentChannel: string = 'CHUYEN_KHOAN'
): Promise<{ success: boolean; contractId: string; disposition: string; spokenAmount: string }> {
  const contract = Object.values(MOCK_DEBT_CONTRACTS).find((c) => c.contractId === contractId);
  if (!contract) {
    throw new Error(`Debt contract ${contractId} not found`);
  }

  // Update CRM contract state
  contract.dispositionStatus = 'PTP';
  contract.ptpDetails = {
    ptpDate,
    ptpAmount,
    paymentChannel,
    committedAt: new Date().toISOString(),
  };

  // Dispatch instant SMS/ZNS confirmation with payment details
  await sendInstantNotification({
    phoneNumber: contract.phoneNumber,
    templateType: 'PTP_CONFIRMATION',
    params: {
      contractId: contract.contractId,
      debtorName: contract.debtorName,
      ptpDate,
      ptpAmount,
      spokenAmount: formatVNDSpokenText(ptpAmount),
    },
  });

  return {
    success: true,
    contractId: contract.contractId,
    disposition: 'PTP',
    spokenAmount: formatVNDSpokenText(ptpAmount),
  };
}

/**
 * Updates the CRM disposition code for a call (e.g., WRONG_PERSON, NO_ANSWER, DISPUTE_PAYMENT).
 * @param {string} contractId - Debt contract ID.
 * @param {DebtContract['dispositionStatus']} status - Target disposition code.
 * @param {string} notes - Call agent notes.
 */
export function updateDispositionStatus(
  contractId: string,
  status: DebtContract['dispositionStatus'],
  notes?: string
): { success: boolean; contractId: string; status: string } {
  const contract = Object.values(MOCK_DEBT_CONTRACTS).find((c) => c.contractId === contractId);
  if (!contract) {
    throw new Error(`Debt contract ${contractId} not found`);
  }

  contract.dispositionStatus = status;
  console.log(`[CRM_DISPOSITION_LOG] Contract ${contractId} updated to ${status}. Note: ${notes || 'N/A'}`);

  return {
    success: true,
    contractId: contract.contractId,
    status: contract.dispositionStatus,
  };
}
