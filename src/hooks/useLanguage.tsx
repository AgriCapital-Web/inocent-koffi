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
  const pathParts = pathname.split('/').filter(Boolean);
  const langCodes: Language[] = ['fr', 'en', 'es', 'de', 'zh', 'ar'];
  
  // Check if last segment is a language code
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart && langCodes.includes(lastPart as Language)) {
    return lastPart as Language;
  }
  
  // Check if first segment is a language code
  const firstPart = pathParts[0];
  if (firstPart && langCodes.includes(firstPart as Language)) {
    return firstPart as Language;
  }
  
  return null;
};

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs: Language[] = ['fr', 'en', 'es', 'de', 'zh', 'ar'];
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
    if (saved && ['fr', 'en', 'es', 'de', 'zh', 'ar'].includes(saved)) {
      return saved as Language;
    }
    
    // Finally detect from browser
    return detectBrowserLanguage();
  });

  useEffect(() => {
    // Update language from URL changes
    const pathLang = detectLanguageFromPath(location.pathname);
    if (pathLang && pathLang !== language) {
      setLanguageState(pathLang);
      localStorage.setItem('language', pathLang);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Set document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update URL to include language
    const currentPath = location.pathname;
    const pathLang = detectLanguageFromPath(currentPath);
    
    let newPath: string;
    if (pathLang) {
      // Replace existing language in path
      newPath = currentPath.replace(new RegExp(`/${pathLang}$`), `/${lang}`);
      newPath = newPath.replace(new RegExp(`^/${pathLang}(/|$)`), `/${lang}$1`);
    } else {
      // Add language to path
      if (currentPath === '/') {
        newPath = `/${lang}`;
      } else {
        newPath = `${currentPath}/${lang}`;
      }
    }
    
    navigate(newPath);
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
