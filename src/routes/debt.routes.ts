/**
 * @file debt.routes.ts
 * @description Express routing for Debt Collection and Recovery operations.
 */

import { Router } from 'express';
import * as debtController from '../controllers/debt.controller';
import { guardrailMiddleware } from '../middlewares/guardrail.middleware';

const router = Router();

// Apply Prompt Injection & Security Guardrails
router.use(guardrailMiddleware);

// Get Outbound Campaign details (checks legal hours)
router.get('/campaigns/details', debtController.handleGetCampaignDetails);

// Verify Primary Debtor before disclosure
router.post('/verify-debtor', debtController.handleVerifyDebtor);

// Commit Promise-to-Pay (PTP)
router.post('/ptp/commit', debtController.handleCommitPTP);

// Update CRM Disposition status
router.post('/disposition/update', debtController.handleUpdateDisposition);

export default router;
