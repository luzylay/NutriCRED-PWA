import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type ThemeId = "light" | "dark" | "andean" | "sunset";
export type TextScale = "normal" | "large" | "xlarge";

export interface ThemeOption {
  id: ThemeId;
  nameKey: string;
  defaultName: string;
  description: string;
  previewBg: string;
  previewPrimary: string;
  previewAccent: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    nameKey: "settings.theme_light",
    defaultName: "Yanapiri Clásico",
    description: "Paleta médica vibrante con azul profundo y cian",
    previewBg: "#FAFAFA",
    previewPrimary: "#12B1E7",
    previewAccent: "#EC2088",
  },
  {
    id: "dark",
    nameKey: "settings.theme_dark",
    defaultName: "Oscuro Cuida-Vista",
    description: "Modo noche para ahorro de batería y baja fatiga",
    previewBg: "#18182B",
    previewPrimary: "#4DD0E1",
    previewAccent: "#FF8A80",
  },
  {
    id: "andean",
    nameKey: "settings.theme_andean",
    defaultName: "Andino Esmeralda",
    description: "Alto contraste verde naturaleza para exteriores soleados",
    previewBg: "#F4F9F5",
    previewPrimary: "#059669",
    previewAccent: "#D97706",
  },
  {
    id: "sunset",
    nameKey: "settings.theme_sunset",
    defaultName: "Cálido Atardecer",
    description: "Tonos ámbar y terracota de alto contraste",
    previewBg: "#FCF8F5",
    previewPrimary: "#EA580C",
    previewAccent: "#BE185D",
  },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: ThemeOption[];
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem("yanapiri_theme") as ThemeId;
      if (saved && ["light", "dark", "andean", "sunset"].includes(saved)) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return "light";
  });

  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    try {
      const saved = localStorage.getItem("yanapiri_text_scale") as TextScale;
      if (saved && ["normal", "large", "xlarge"].includes(saved)) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return "normal";
  });

  const applyThemeClasses = useCallback((newTheme: ThemeId, newScale: TextScale) => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-andean", "theme-sunset", "text-scale-normal", "text-scale-large", "text-scale-xlarge");

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "andean") {
      root.classList.add("theme-andean");
    } else if (newTheme === "sunset") {
      root.classList.add("theme-sunset");
    }
    
    root.classList.add(`text-scale-${newScale}`);
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeId) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem("yanapiri_theme", newTheme);
      } catch {
        /* ignore */
      }
      applyThemeClasses(newTheme, textScale);
    },
    [applyThemeClasses, textScale]
  );

  const setTextScale = useCallback(
    (newScale: TextScale) => {
      setTextScaleState(newScale);
      try {
        localStorage.setItem("yanapiri_text_scale", newScale);
      } catch {
        /* ignore */
      }
      applyThemeClasses(theme, newScale);
    },
    [applyThemeClasses, theme]
  );

  useEffect(() => {
    applyThemeClasses(theme, textScale);
  }, [theme, textScale, applyThemeClasses]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_OPTIONS, textScale, setTextScale }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
