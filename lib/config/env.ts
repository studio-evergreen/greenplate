import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SENTRY_DSN: z.string().url("Invalid Sentry DSN").optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url("Invalid Sentry DSN").optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_ENABLED: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      NEXT_PUBLIC_SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
      NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    });
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw new Error("Invalid environment configuration");
  }
}

export const env = validateEnv();