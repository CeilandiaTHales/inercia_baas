
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.tables': 'Table Editor',
    'nav.auth': 'Authentication',
    'nav.sql': 'SQL Editor',
    'nav.rls': 'RLS Policies',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
  },
  pt: {
    'nav.dashboard': 'Painel',
    'nav.tables': 'Editor de Tabelas',
    'nav.auth': 'Autenticação',
    'nav.sql': 'Editor SQL',
    'nav.rls': 'Políticas RLS',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
