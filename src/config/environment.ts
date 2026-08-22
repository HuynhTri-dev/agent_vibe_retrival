/**
 * @file environment.ts
 * @description Environment configuration loader and validation using Zod.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ELEVENLABS_API_KEY: z.string().optional().default(''),
  ELEVENLABS_VOICE_ID: z.string().optional().default('eleven_flash_vi_v2'),
  TELEPHONY_SIP_PROVIDER: z.string().default('twilio'),
  TELEPHONY_WEBHOOK_SECRET: z.string().default('default_secret'),
  CORE_BANKING_API_URL: z.string().default('https://api.internal-bank.com/v1'),
  CORE_BANKING_API_KEY: z.string().default('mock_banking_key'),
  COLLECTION_CRM_API_URL: z.string().default('https://crm.internal-bank.com/v1'),
  COLLECTION_CRM_API_KEY: z.string().default('mock_crm_key'),
  SMS_GATEWAY_URL: z.string().default('https://sms.internal-bank.com/v1'),
  SMS_BRANDNAME: z.string().default('ANBINHBANK'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
