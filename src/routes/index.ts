/**
 * @file index.ts
 * @description Main application router aggregating CSKH, Debt, and Voice modules.
 */

import { Router } from 'express';
import cskhRoutes from './cskh.routes';
import debtRoutes from './debt.routes';
import voiceRoutes from './voice.routes';

const rootRouter = Router();

// Health Check Endpoint
rootRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Agent Vibe Banking & Debt Voicebot Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount Sub-routers
rootRouter.use('/api/v1/cskh', cskhRoutes);
rootRouter.use('/api/v1/debt', debtRoutes);
rootRouter.use('/api/v1/voice', voiceRoutes);

export default rootRouter;
