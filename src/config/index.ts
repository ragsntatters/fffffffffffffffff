import { z } from 'zod'

const envSchema = z.object({
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API key is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_APP_URL: z.string().default('http://localhost:3000'),
})

const env = envSchema.parse({
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  NODE_ENV: import.meta.env.MODE,
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
})

export const config = {
  google: {
    apiKey: env.VITE_GOOGLE_MAPS_API_KEY,
    mapsLibraries: ['places', 'geometry', 'drawing', 'marker'],
    mapId: undefined, // Remove mapId to allow custom styling
    allowedOrigins: [env.VITE_APP_URL, 'https://stackblitz.com']
  },
  app: {
    url: env.VITE_APP_URL
  },
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const

export type Config = typeof config