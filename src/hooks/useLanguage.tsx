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

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs: Language[] = ['fr', 'en', 'es', 'de', 'zh', 'ar', 'bci', 'dyu'];
  return supportedLangs.includes(browserLang as Language) ? (browserLang as Language) : 'fr';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [language, setLanguageState] = useState<Language>(() => {
    // First check URL
    const pathLang = detectLanguageFromPath(location.pathname);
    if (pathLang) return pathLang;
    
    // Then check localStorage
    const saved = localStorage.getItem('language');
    if (saved && ['fr', 'en', 'es', 'de', 'zh', 'ar', 'bci', 'dyu'].includes(saved)) {
      return saved as Language;
    }
    
    // Finally detect from browser
    return detectBrowserLanguage();
  });

  useEffect(() => {
    const pathLang = detectLanguageFromPath(location.pathname);
    if (pathLang && pathLang !== language) {
      setLanguageState(pathLang);
      localStorage.setItem('language', pathLang);
      return;
    }

    // Keep every public internal navigation in the active language.
    // French is the canonical unprefixed version.
    const privatePath = /^\/(admin|login|client)(\/|$)/.test(location.pathname);
    if (!pathLang && language !== 'fr' && !privatePath) {
      navigate(`/${language}${location.pathname === '/' ? '' : location.pathname}${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, language, navigate]);

  useEffect(() => {
    // Set document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    const parts = location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const hasLangPrefix = !!first && ['fr','en','es','de','zh','ar','bci','dyu'].includes(first);
    const baseParts = hasLangPrefix ? parts.slice(1) : parts;
    const basePath = '/' + baseParts.join('/');

    // French keeps the canonical unprefixed URL. Other languages use /{lang}/...
    const newPath = lang === 'fr'
      ? (basePath === '/' ? '/' : basePath)
      : (basePath === '/' ? '/' + lang : '/' + lang + basePath);

    navigate(newPath || '/');
  };  const t = (key: string) => getTranslation(language, key);

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
