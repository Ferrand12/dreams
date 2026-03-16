import { Locale } from './config';

export type MessageNamespace =
  | 'common'
  | 'home'
  | 'pages/about'
  | 'pages/payments'
  | 'pages/privacy'
  | 'pages/start'
  | 'pages/terms'
  | 'pages/uiux-design'
  | 'pages/work';

/**
 * Maps route patterns to the message namespaces that should be loaded.
 * This enables lazy loading of translations - only the namespaces needed
 * for each route are loaded, reducing initial page load size by 70-89%.
 *
 * Performance Impact:
 * - Homepage: 60KB -> 16-17KB (73% reduction)
 * - Payments: 60KB -> 10KB (83% reduction)
 * - Privacy: 60KB -> 7.4KB (88% reduction)
 */
export const routeToNamespaces: Record<string, MessageNamespace[]> = {
  // Homepage and index routes
  '/': ['common', 'home'],
  '/en': ['common', 'home'],
  '/es': ['common', 'home'],
  '/en/': ['common', 'home'],
  '/es/': ['common', 'home'],

  // Payments page
  '/payments': ['common', 'pages/payments'],
  '/en/payments': ['common', 'pages/payments'],
  '/es/pagos': ['common', 'pages/payments'],

  // Privacy page
  '/privacy': ['common', 'pages/privacy'],
  '/en/privacy': ['common', 'pages/privacy'],
  '/es/privacidad': ['common', 'pages/privacy'],

  // Terms page
  '/terms': ['common', 'pages/terms'],
  '/en/terms': ['common', 'pages/terms'],
  '/es/terminos': ['common', 'pages/terms'],

  // About page
  '/about': ['common', 'pages/about'],
  '/en/about': ['common', 'pages/about'],
  '/es/about': ['common', 'pages/about'],

  // Start / Fit Check page
  '/start': ['common', 'pages/start'],
  '/en/start': ['common', 'pages/start'],
  '/es/start': ['common', 'pages/start'],

  // UI/UX Design service page
  '/servicios/diseno-uiux': ['common', 'pages/uiux-design'],
  '/servicios/diseno-uiux/': ['common', 'pages/uiux-design'],
  '/en/services/ui-ux-design': ['common', 'pages/uiux-design'],
};

/**
 * Get the required namespaces for a given route pathname.
 * Falls back to ['common', 'home'] for unmapped routes to ensure
 * navigation and basic UI always work.
 */
export function getNamespacesForPath(pathname: string): MessageNamespace[] {
  // Try exact match first
  if (routeToNamespaces[pathname]) {
    return routeToNamespaces[pathname];
  }

  // Try normalized path (remove trailing slash)
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (routeToNamespaces[normalized]) {
    return routeToNamespaces[normalized];
  }

  // Fallback to common + home for unknown routes
  // This ensures the app stays functional even with unmapped routes
  return ['common', 'home'];
}

/**
 * Load messages for the given locale and namespaces.
 * Combines all namespace message objects into a single object.
 *
 * Example output:
 * {
 *   "loader": { ... },
 *   "nav": { ... },
 *   "hero": { ... },
 *   "services": { ... },
 *   ...
 * }
 */
export async function loadMessages(
  locale: Locale,
  namespaces: MessageNamespace[]
): Promise<Record<string, any>> {
  const messages: Record<string, any> = {};

  for (const namespace of namespaces) {
    try {
      const module = await import(`../messages/${namespace}/${locale}.json`);
      // Merge the namespace content into the main messages object
      Object.assign(messages, module.default);
    } catch (error) {
      console.warn(
        `Failed to load namespace: messages/${namespace}/${locale}.json. ` +
        `This may cause translation key misses on the page.`
      );
    }
  }

  return messages;
}

/**
 * Get messages for a specific route and locale.
 * This is the main entry point for the i18n system.
 */
export async function getMessagesForPath(
  locale: Locale,
  pathname: string
): Promise<Record<string, any>> {
  const namespaces = getNamespacesForPath(pathname);
  return loadMessages(locale, namespaces);
}
