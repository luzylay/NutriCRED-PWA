import React, { createContext, useContext, useState, ReactNode } from "react";

export interface A11yState {
  highContrast: boolean;
  largeText: boolean;
  showQuechua: boolean;
  dyslexia: boolean;
  colorBlind: boolean;
  reducedMotion: boolean;
  signLang: boolean;
  simpleMode: boolean;
  keyboardMode: boolean;
}

interface A11yContextType {
  a11y: A11yState;
  setA11y: (key: keyof A11yState, value: boolean) => void;
}

const defaultState: A11yState = {
  highContrast: false,
  largeText: false,
  showQuechua: false,
  dyslexia: false,
  colorBlind: false,
  reducedMotion: false,
  signLang: false,
  simpleMode: false,
  keyboardMode: false,
};

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [a11y, setA11yState] = useState<A11yState>(defaultState);

  const setA11y = (key: keyof A11yState, value: boolean) => {
    setA11yState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <A11yContext.Provider value={{ a11y, setA11y }}>
      <div className={`
        ${a11y.highContrast ? "contrast-125" : ""} 
        ${a11y.largeText ? "text-lg" : "text-base"} 
        ${a11y.dyslexia ? "font-['Lexend'] tracking-wide" : "font-sans"}
        ${a11y.reducedMotion ? "scroll-smooth motion-reduce" : ""}
      `}>
        {/* SVG Filter for Deuteranopia Simulation */}
        {a11y.colorBlind && (
          <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
            <filter id="deuteranopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.367322 0.860646 -0.227968 0 0
                        0.280085 0.672501 0.047413 0 0
                        -0.01182 0.04294 0.968881 0 0
                        0 0 0 1 0"
              />
            </filter>
          </svg>
        )}
        <div style={{ filter: a11y.colorBlind ? "url(#deuteranopia-filter)" : "none" }}>
          {children}
        </div>
      </div>
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const context = useContext(A11yContext);
  if (context === undefined) {
    throw new Error("useA11y must be used within an A11yProvider");
  }
  return context;
}
