/**
 * @file server.ts
 * @description Main application entry point initializing Express, WebSocket server, and security middlewares.
 */

import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment';
import rootRouter from './routes';
import { dataMaskingMiddleware } from './middlewares/dataMasking.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { setupVoiceStreamingServer } from './services/voiceStream.service';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing & Data Masking
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dataMaskingMiddleware);

// Mount API Routes
app.use(rootRouter);

// Centralized Error Handling
app.use(errorHandlerMiddleware);

// Create HTTP Server & Attach WebSocket Voice Pipeline
const server = http.createServer(app);
setupVoiceStreamingServer(server);

// Start Server
server.listen(env.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Banking CSKH & Debt Collection Backend is running!`);
  console.log(`📍 HTTP Endpoint: http://localhost:${env.PORT}`);
  console.log(`🎙️ WebSocket Voice Stream: ws://localhost:${env.PORT}/ws/voice-stream`);
  console.log(`🔒 Environment: ${env.NODE_ENV}`);
  console.log('====================================================');
});

export { app, server };
