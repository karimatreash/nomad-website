export type Locale = 'en' | 'ar';

export const locales: Locale[] = ['en', 'ar'];

export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ar: '🇸🇦'
}; 