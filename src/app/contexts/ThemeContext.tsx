import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type ThemeId = "red-gold" | "night-gold" | "low-vision" | "colorblind";
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
    id: "red-gold",
    nameKey: "settings.theme_red_gold",
    defaultName: "Rojo y Dorado (Tema Principal)",
    description: "Estilo de marca cálido para el hogar. Colores crema, terracota y dorado suave.",
    previewBg: "#FAF0E6",
    previewPrimary: "#8B2C1A",
    previewAccent: "#C68A3C",
  },
  {
    id: "night-gold",
    nameKey: "settings.theme_night_gold",
    defaultName: "Modo Noche (Descanso Visual)",
    description: "Para usar la app de noche sin cansar la vista mientras el bebé duerme.",
    previewBg: "#0B0B12",
    previewPrimary: "#F5C842",
    previewAccent: "#E53935",
  },
  {
    id: "low-vision",
    nameKey: "settings.theme_low_vision",
    defaultName: "Baja Visión (Alto Contraste)",
    description: "Texto más grande, bordes gruesos y máximo contraste para lectura fácil.",
    previewBg: "#0A0A0A",
    previewPrimary: "#FFD700",
    previewAccent: "#FF4444",
  },
  {
    id: "colorblind",
    nameKey: "settings.theme_colorblind",
    defaultName: "Daltonismo (Azul y Naranja)",
    description: "Colores seguros azul y naranja acompañados de iconos claros en cada estado.",
    previewBg: "#1A1A2E",
    previewPrimary: "#6AAAFF",
    previewAccent: "#FF8866",
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
      if (saved && ["red-gold", "night-gold", "low-vision", "colorblind"].includes(saved)) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return "red-gold";
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

  const applyThemeClasses = useCallback(
    (newTheme: ThemeId, newScale: TextScale) => {
      const root = document.documentElement;
      root.classList.remove(
        "dark",
        "theme-red-gold",
        "theme-night-gold",
        "theme-low-vision",
        "theme-colorblind",
        "theme-andean",
        "theme-sunset",
        "text-scale-normal",
        "text-scale-large",
        "text-scale-xlarge",
      );

      if (newTheme === "red-gold") {
        root.classList.add("theme-red-gold");
      } else if (newTheme === "night-gold") {
        root.classList.add("theme-night-gold");
      } else if (newTheme === "low-vision") {
        root.classList.add("theme-low-vision");
      } else if (newTheme === "colorblind") {
        root.classList.add("theme-colorblind");
      }

      root.classList.add(`text-scale-${newScale}`);
    },
    [],
  );

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
    [applyThemeClasses, textScale],
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
    [applyThemeClasses, theme],
  );

  useEffect(() => {
    applyThemeClasses(theme, textScale);
  }, [theme, textScale, applyThemeClasses]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: THEME_OPTIONS,
        textScale,
        setTextScale,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
