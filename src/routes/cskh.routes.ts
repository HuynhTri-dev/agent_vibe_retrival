/**
 * @file cskh.routes.ts
 * @description Express routing for Banking CSKH operations.
 */

import { Router } from 'express';
import * as cskhController from '../controllers/cskh.controller';
import { guardrailMiddleware } from '../middlewares/guardrail.middleware';

const router = Router();

// Apply Prompt Injection & Security Guardrails
router.use(guardrailMiddleware);

// Fast-track Emergency Card Lock
router.post('/cards/lock-emergency', cskhController.handleEmergencyLockCard);

// Standard Multi-factor Auth
router.post('/auth/verify', cskhController.handleStandardAuth);

// Account Balance Inquiry
router.get('/account/balance', cskhController.handleGetBalance);

// Recent Transactions Inquiry
router.get('/account/transactions', cskhController.handleGetTransactions);

export default router;
