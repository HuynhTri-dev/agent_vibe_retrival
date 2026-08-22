/**
 * @file notification.service.ts
 * @description Service for triggering instant SMS Brandname and Zalo ZNS notifications.
 */

import { env } from '../config/environment';

export interface NotificationPayload {
  phoneNumber: string;
  templateType: 'CARD_LOCKED' | 'PTP_CONFIRMATION' | 'BALANCE_STATEMENT' | 'DISPUTE_ACK';
  params: Record<string, string | number>;
}

export interface NotificationResult {
  success: boolean;
  messageId: string;
  sentAt: string;
}

/**
 * Sends automated transactional SMS/ZNS to the customer.
 * @param {NotificationPayload} payload - Details for the notification message.
 * @returns {Promise<NotificationResult>} Result containing messageId and status.
 */
export async function sendInstantNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  // In production, this calls the Bank's SMS Brandname / Zalo ZNS Gateway API.
  const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const sentAt = new Date().toISOString();

  console.log(`[NOTIFICATION_GATEWAY] [${env.SMS_BRANDNAME}] Sent ${payload.templateType} to ${payload.phoneNumber}`, {
    messageId,
    params: payload.params,
  });

  return {
    success: true,
    messageId,
    sentAt,
  };
}
