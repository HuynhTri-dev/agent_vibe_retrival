/**
 * @file voice.routes.ts
 * @description Express routing for Telephony SIP Webhooks and Voice Bridge.
 */

import { Router } from 'express';
import * as voiceController from '../controllers/voice.controller';

const router = Router();

// Inbound SIP Call Webhook
router.post('/webhook/incoming-call', voiceController.handleIncomingCallWebhook);

// Call status updates (Ringing, Answered, Completed)
router.post('/webhook/status', voiceController.handleCallStatusWebhook);

export default router;
