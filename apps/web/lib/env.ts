/**
 * Demo mode runs the whole app with no database: mocked catalogue, cookie-based
 * cart, in-session orders. It is on when explicitly enabled or when no
 * DATABASE_URL is configured, so the app always boots somewhere.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.DATABASE_URL

export const siteConfig = {
  name: 'EpiHardware',
  tagline: 'Le hardware qui fait la différence',
  description:
    'Composants PC haut de gamme, cartes graphiques, processeurs et périphériques gaming. Livraison rapide, prix justes, sélection d’experts.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
} as const
