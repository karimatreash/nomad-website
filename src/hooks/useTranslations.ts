'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Locale, locales, defaultLocale } from '@/i18n/config';
import { getTranslations, getLocaleFromPathname, addLocaleToPathname, removeLocaleFromPathname } from '@/i18n/utils';

export function useTranslations() {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = useMemo(() => getLocaleFromPathname(pathname), [pathname]);
  const translations = useMemo(() => getTranslations(currentLocale), [currentLocale]);
  
  const changeLocale = useCallback((newLocale: Locale) => {
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(pathWithoutLocale, newLocale);
    router.push(newPath);
  }, [pathname, router]);
  
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    if (params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        return str.replace(new RegExp(`{${key}}`, 'g'), String(val));
      }, value);
    }
    
    return value;
  }, [translations]);
  
  return {
    t,
    locale: currentLocale,
    locales,
    changeLocale,
    isRTL: currentLocale === 'ar'
  };
} 