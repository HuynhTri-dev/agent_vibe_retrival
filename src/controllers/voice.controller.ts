/**
 * @file voice.controller.ts
 * @description Controller for Telephony Webhooks (SIP/Twilio/Stringee) and Live Call Management.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Handles incoming call webhooks from SIP Trunk providers.
 */
export function handleIncomingCallWebhook(req: Request, res: Response, next: NextFunction): void {
  try {
    const callerNumber = req.body.From || req.body.caller || '0912345678';
    const callSid = req.body.CallSid || `CALL_${Date.now()}`;

    console.log(`[SIP_WEBHOOK] Inbound call received from: ${callerNumber} (CallSid: ${callSid})`);

    // In a Twilio/SIP environment, respond with TwiML or WebSocket Media Stream instructions
    res.type('text/xml').send(`
      <Response>
        <Connect>
          <Stream url="wss://${req.headers.host}/ws/voice-stream">
            <Parameter name="callerNumber" value="${callerNumber}" />
            <Parameter name="callSid" value="${callSid}" />
          </Stream>
        </Connect>
      </Response>
    `);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles call status updates (ringing, answered, completed).
 */
export function handleCallStatusWebhook(req: Request, res: Response, next: NextFunction): void {
  try {
    const { CallSid, CallStatus, Duration } = req.body;
    console.log(`[SIP_STATUS] CallSid: ${CallSid} Status: ${CallStatus} Duration: ${Duration || 0}s`);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
