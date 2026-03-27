/**
 * Application Constants
 * Centralized constants to avoid magic numbers and strings
 */

// Rate Limiting
export const RATE_LIMIT = {
  REQUESTS: 3,
  WINDOW: '1 m',
  WINDOW_MS: 60_000,
} as const;

// Animation Timings
export const ANIMATION = {
  TYPING_DELAY: 150,
  MESSAGE_DELAY: 800,
  PAGE_LOAD_MIN_DELAY: 500,
  MENU_TRANSITION_DELAY: 300,
} as const;

// Cache Durations (in seconds)
export const CACHE = {
  STATIC_ASSETS: 31536000, // 1 year
  FAVICON: 86400, // 1 day
} as const;

// External URLs
export const SOCIAL_MEDIA = {
  INSTAGRAM: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/dreamstudio',
  LINKEDIN: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/dreamstudio',
  TWITTER: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/dreamstudio',
  EMAIL: process.env.NEXT_PUBLIC_EMAIL || 'contact@dreeeams.com',
  WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP || '',
} as const;

// CDN — Supabase (existing assets)
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || '';
const CDN_CONTENT_PREFIX = CDN_BASE
  ? `${CDN_BASE}/storage/v1/object/public/content`
  : '';

/** Build a full Supabase CDN asset URL. Returns empty string if CDN is not configured. */
export function cdnAssetUrl(path: string): string {
  return CDN_CONTENT_PREFIX ? `${CDN_CONTENT_PREFIX}/${path}` : '';
}

// CDN — UploadThing (new uploads + future assets)
const UT_CDN = 'https://njcx3bqt2s.ufs.sh/f';

/** Build an UploadThing CDN URL from a file key. Returns empty string if key is empty. */
export function utAssetUrl(key: string): string {
  return key ? `${UT_CDN}/${key}` : '';
}

// Cal.com
export const CAL_EVENT_LINK =
  process.env.NEXT_PUBLIC_CAL_EVENT_LINK || 'luis-fernandez-ezzzmp/30min';

// Form Steps
export const FORM_STEPS = {
  CONTACT: 1,
  COMPANY: 2,
  PROJECT: 3,
  TOTAL: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  INTAKE: '/api/intake',
  LEAD: '/api/lead',
  HEALTH: '/api/health',
} as const;

// Phone Prefixes by Country Code (ISO 3166-1 alpha-2)
export const COUNTRY_PHONE_PREFIXES: Record<string, string> = {
  CO: '+57',
  US: '+1',
  CA: '+1',
  MX: '+52',
  AR: '+54',
  BR: '+55',
  CL: '+56',
  PE: '+51',
  EC: '+593',
  VE: '+58',
  GB: '+44',
  FR: '+33',
  DE: '+49',
  ES: '+34',
  IT: '+39',
  PT: '+351',
  NL: '+31',
  AU: '+61',
  IN: '+91',
  JP: '+81',
};

export const DEFAULT_PHONE_PREFIX = '+1';

// SEO
export const SEO = {
  DEFAULT_TITLE: 'Dreeeams - Web & Mobile App Development Experts',
  DEFAULT_DESCRIPTION:
    'Dreeeams builds scalable web and mobile apps. Expert developers in React, Next.js & React Native.',
  SITE_NAME: 'Dreeeams',
  TWITTER_HANDLE: '@dreamstudio',
} as const;

// Validation Limits
export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 100,
  COMPANY_MAX: 100,
  ROLE_MAX: 100,
  SUMMARY_MAX: 500,
} as const;

// Web Vitals Thresholds
export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  LCP: { good: 2500, poor: 4000 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;
