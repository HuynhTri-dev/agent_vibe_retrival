/**
 * @file coreBanking.service.ts
 * @description Core Banking integration service for account inquiry, card locking, and balance formatting.
 */

import { sendInstantNotification } from './notification.service';

export interface BankCustomer {
  customerId: string;
  fullName: string;
  phoneNumber: string;
  nationalIdLast4: string;
  birthYear: number;
  cards: Array<{
    cardId: string;
    cardType: 'CREDIT' | 'DEBIT';
    cardLast4: string;
    status: 'ACTIVE' | 'LOCKED' | 'EXPIRED';
    brand: 'VISA' | 'MASTERCARD' | 'NAPAS';
  }>;
  account: {
    accountNumber: string;
    availableBalance: number;
    currency: string;
  };
}

export interface TransactionRecord {
  transactionId: string;
  timestamp: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  description: string;
}

// In-memory mock customer database for banking operations
const MOCK_CUSTOMERS: Record<string, BankCustomer> = {
  '0912345678': {
    customerId: 'CUST_88910',
    fullName: 'Nguyễn Thị Mai',
    phoneNumber: '0912345678',
    nationalIdLast4: '7892',
    birthYear: 1990,
    cards: [
      {
        cardId: 'CARD_VISA_4568',
        cardType: 'CREDIT',
        cardLast4: '4568',
        status: 'ACTIVE',
        brand: 'VISA',
      },
    ],
    account: {
      accountNumber: '10988776655',
      availableBalance: 45000000,
      currency: 'VND',
    },
  },
  '0987654321': {
    customerId: 'CUST_11203',
    fullName: 'Trần Văn Nam',
    phoneNumber: '0987654321',
    nationalIdLast4: '3456',
    birthYear: 1988,
    cards: [
      {
        cardId: 'CARD_NAPAS_9912',
        cardType: 'DEBIT',
        cardLast4: '9912',
        status: 'ACTIVE',
        brand: 'NAPAS',
      },
    ],
    account: {
      accountNumber: '19033445566',
      availableBalance: 25400000,
      currency: 'VND',
    },
  },
};

const MOCK_TRANSACTIONS: Record<string, TransactionRecord[]> = {
  CUST_11203: [
    {
      transactionId: 'TXN_001',
      timestamp: '14:30 21/08/2026',
      amount: 3000000,
      type: 'CREDIT',
      description: 'Nhận chuyển khoản từ Công ty ABC',
    },
    {
      transactionId: 'TXN_002',
      timestamp: '10:15 21/08/2026',
      amount: 500000,
      type: 'DEBIT',
      description: 'Thanh toán tiền điện EVN',
    },
    {
      transactionId: 'TXN_003',
      timestamp: '18:20 20/08/2026',
      amount: 120000,
      type: 'DEBIT',
      description: 'Thanh toán GrabFood',
    },
  ],
};

/**
 * Converts numbers into natural Vietnamese spoken text for TTS.
 * @param {number} amount - Numeric amount in VND.
 * @returns {string} Natural Vietnamese text representation.
 */
export function formatVNDSpokenText(amount: number): string {
  if (amount === 0) return 'không đồng';

  const units = ['', 'nghìn', 'triệu', 'tỷ'];
  const chunks: number[] = [];
  let temp = amount;

  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const readThreeDigits = (num: number, isHighestChunk: boolean): string => {
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    const parts: string[] = [];

    if (h > 0 || !isHighestChunk) {
      parts.push(`${digits[h]} trăm`);
    }

    if (t > 1) {
      parts.push(`${digits[t]} mươi`);
      if (o === 1) parts.push('mốt');
      else if (o === 5) parts.push('lăm');
      else if (o > 0) parts.push(digits[o]);
    } else if (t === 1) {
      parts.push('mười');
      if (o === 5) parts.push('lăm');
      else if (o > 0) parts.push(digits[o]);
    } else if (o > 0) {
      if (h > 0 || !isHighestChunk) parts.push('linh');
      parts.push(digits[o]);
    }

    return parts.join(' ');
  };

  const spokenParts: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunkVal = chunks[i];
    if (chunkVal > 0) {
      const chunkText = readThreeDigits(chunkVal, i === chunks.length - 1);
      spokenParts.push(`${chunkText} ${units[i]}`.trim());
    }
  }

  return `${spokenParts.join(' ')} đồng`.trim();
}

/**
 * Fast-track emergency identity verification using caller phone and last 4 ID digits.
 * @param {string} phoneNumber - Incoming phone number.
 * @param {string} nationalIdLast4 - Last 4 digits of CCCD.
 * @returns {BankCustomer | null} Matched customer profile or null.
 */
export function fastTrackVerify(
  phoneNumber: string,
  nationalIdLast4: string
): BankCustomer | null {
  const customer = MOCK_CUSTOMERS[phoneNumber];
  if (customer && customer.nationalIdLast4 === nationalIdLast4) {
    return customer;
  }
  return null;
}

/**
 * Standard multi-factor identity verification for balance and policy inquiries.
 * @param {string} phoneNumber - Phone number.
 * @param {string} nationalIdLast4 - Last 4 digits of CCCD.
 * @param {number} birthYear - Birth year.
 * @returns {BankCustomer | null} Verified customer profile or null.
 */
export function standardVerify(
  phoneNumber: string,
  nationalIdLast4: string,
  birthYear: number
): BankCustomer | null {
  const customer = MOCK_CUSTOMERS[phoneNumber];
  if (
    customer &&
    customer.nationalIdLast4 === nationalIdLast4 &&
    customer.birthYear === birthYear
  ) {
    return customer;
  }
  return null;
}

/**
 * Instantly locks a customer's debit or credit card.
 * @param {string} phoneNumber - Customer phone number.
 * @param {string} cardId - ID of the card to lock.
 * @param {string} reason - Reason for locking (e.g. LOST, FRAUD_SUSPECT).
 * @returns {Promise<{ success: boolean; cardLast4: string; lockedAt: string }>}
 */
export async function emergencyLockCard(
  phoneNumber: string,
  cardId: string,
  reason: string
): Promise<{ success: boolean; cardLast4: string; lockedAt: string }> {
  const customer = MOCK_CUSTOMERS[phoneNumber];
  if (!customer) {
    throw new Error('Customer not found for phone number');
  }

  const card = customer.cards.find((c) => c.cardId === cardId || c.cardLast4 === cardId);
  if (!card) {
    throw new Error('Card not found in customer profile');
  }

  // Update card status in Core Banking
  card.status = 'LOCKED';
  const lockedAt = new Date().toISOString();

  // Send instant confirmation SMS
  await sendInstantNotification({
    phoneNumber: customer.phoneNumber,
    templateType: 'CARD_LOCKED',
    params: {
      cardLast4: card.cardLast4,
      cardBrand: card.brand,
      reason,
      lockedAt,
    },
  });

  return {
    success: true,
    cardLast4: card.cardLast4,
    lockedAt,
  };
}

/**
 * Retrieves account balance with spoken text formatting.
 * @param {string} customerId - ID of the customer.
 */
export function getAccountBalanceInfo(customerId: string): {
  accountNumber: string;
  balance: number;
  currency: string;
  spokenBalance: string;
} {
  const customer = Object.values(MOCK_CUSTOMERS).find((c) => c.customerId === customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  return {
    accountNumber: customer.account.accountNumber,
    balance: customer.account.availableBalance,
    currency: customer.account.currency,
    spokenBalance: formatVNDSpokenText(customer.account.availableBalance),
  };
}

/**
 * Retrieves the recent transaction history.
 * @param {string} customerId - ID of the customer.
 * @param {number} limit - Number of transactions to return.
 */
export function getRecentTransactionsInfo(
  customerId: string,
  limit: number = 3
): TransactionRecord[] {
  const txns = MOCK_TRANSACTIONS[customerId] || [];
  return txns.slice(0, limit);
}
