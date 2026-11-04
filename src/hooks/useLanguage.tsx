import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, getTranslation, languages } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectLanguageFromPath = (pathname: string): Language | null => {
  const firstPart = pathname.split('/').filter(Boolean)[0];
  const langCodes: Language[] = ['fr', 'en', 'es', 'de', 'zh', 'ar', 'bci', 'dyu'];
  return firstPart && langCodes.includes(firstPart as Language) ? firstPart as Language : null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(() => {
    // An explicit language in the URL always takes precedence.
    const pathLang = detectLanguageFromPath(location.pathname);
    if (pathLang) return pathLang;

    // The unprefixed site is always French, regardless of a stale browser
    // preference. Other languages remain available through their URL prefix.
    return 'fr';
  });

  useEffect(() => {
    const pathLang = detectLanguageFromPath(location.pathname);
    if (pathLang && pathLang !== language) {
      setLanguageState(pathLang);
      localStorage.setItem('language', pathLang);
      return;
    }

    // French is the canonical unprefixed version. Non-French languages use
    // their explicit /{lang}/ URL, which preserves the visitor's selection.
    const firstPathSegment = location.pathname.split('/').filter(Boolean)[0] ?? '';
    const privatePath = ['admin', 'login', 'client'].includes(firstPathSegment);
    if (!pathLang && language !== 'fr' && !privatePath) {
      navigate(`/${language}${location.pathname === '/' ? '' : location.pathname}${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, language, navigate]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    const parts = location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const hasLangPrefix = !!first && ['fr', 'en', 'es', 'de', 'zh', 'ar', 'bci', 'dyu'].includes(first);
    const baseParts = hasLangPrefix ? parts.slice(1) : parts;
    const basePath = '/' + baseParts.join('/');

    // French keeps the canonical unprefixed URL. Other languages use /{lang}/...
    const newPath = lang === 'fr'
      ? (basePath === '/' ? '/' : basePath)
      : (basePath === '/' ? '/' + lang : '/' + lang + basePath);

    navigate(newPath || '/');
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
