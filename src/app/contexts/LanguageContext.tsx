import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  TRANSLATIONS,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageInfo,
} from "../lib/i18n/translations";

interface LanguageContextValue {
  language: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("yanapiri_language") as LanguageCode;
      if (saved && ["es", "qu", "ay", "en"].includes(saved)) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return "es";
  });

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("yanapiri_language", lang);
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.es;
      let text = dict[key] || TRANSLATIONS.es[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            String(paramVal),
          );
        });
      }

      return text;
    },
    [language],
  );

  const languageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageInfo,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useTranslation must be used within <LanguageProvider>");
  return ctx;
}
