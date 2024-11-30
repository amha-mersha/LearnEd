export type Locale = (typeof locales)[number];

export const locales = ['en', 'fr', 'am'] as const;
export const defaultLocale: Locale = 'en';
export const defaultTimezone = 'UTC';