import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // Database
  DATABASE_URL: z.string(),
  DATABASE_POOL_MIN: z.string().transform(Number).default('2'),
  DATABASE_POOL_MAX: z.string().transform(Number).default('10'),
  
  // Redis
  REDIS_URL: z.string(),
  REDIS_PASSWORD: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string().email(),
  
  // Frontend
  FRONTEND_URL: z.string().url(),
  
  // External APIs
  GOOGLE_MAPS_API_KEY: z.string(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  GOOGLE_ACCOUNT_ID: z.string(),
  
  FACEBOOK_APP_ID: z.string(),
  FACEBOOK_APP_SECRET: z.string(),
  FACEBOOK_ACCESS_TOKEN: z.string(),
  
  // Storage
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET: z.string(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PLAN_STARTER: z.string(),
  STRIPE_PLAN_PROFESSIONAL: z.string(),
  STRIPE_PLAN_ENTERPRISE: z.string(),

  // Monitoring
  SENTRY_DSN: z.string().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  DATADOG_API_KEY: z.string().optional(),
  
  // Cache
  CACHE_TTL: z.string().transform(Number).default('3600'),
  CACHE_CHECK_PERIOD: z.string().transform(Number).default('120')
})

export type EnvConfig = z.infer<typeof envSchema>