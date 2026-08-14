import React, { useState } from "react";
import { Eye, Type, Activity, Star, Zap, Users, Globe, ChevronRight, Accessibility, X } from "lucide-react";
import { useA11y, type A11yState } from "../../contexts/A11yContext";

export function AccessibilityHub() {
  const { a11y, setA11y } = useA11y();
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(a11y).filter(Boolean).length;

  const options: { key: keyof A11yState; label: string; desc: string; icon: React.ElementType; tag?: string }[] = [
    { key: "highContrast", label: "Alto contraste", desc: "WCAG AAA · Para baja visión", icon: Eye },
    { key: "largeText", label: "Texto grande", desc: "Fuente 19px · Mayor legibilidad", icon: Type },
    { key: "dyslexia", label: "Modo dislexia", desc: "Fuente Lexend + espaciado amplio", icon: Activity, tag: "Lexend" },
    { key: "colorBlind", label: "Daltonismo", desc: "Paleta segura para deuteranopía", icon: Star },
    { key: "reducedMotion", label: "Reducir movimiento", desc: "Sin animaciones · Epilepsia", icon: Zap },
    { key: "signLang", label: "Intérprete LSP", desc: "Lengua de Señas Peruana", icon: Users, tag: "Beta" },
    { key: "simpleMode", label: "Lenguaje sencillo", desc: "Sin jerga médica", icon: Globe },
    { key: "showQuechua", label: "Etiquetas quechua", desc: "Bilingüe español / quechua", icon: Globe },
    { key: "keyboardMode", label: "Navegación teclado", desc: "Atajos visibles", icon: ChevronRight },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir opciones de accesibilidad"
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 rounded-full shadow-lg shadow-primary/20 transition-all ${
          activeCount > 0 ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
      >
        <Accessibility className="size-6" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Hub Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-muted p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Accessibility className="size-5 text-primary" />
              <h2 className="font-bold text-foreground">
                {a11y.showQuechua ? "Yaykuna Wasi (Accesibilidad)" : a11y.simpleMode ? "Opciones para Todos" : "Centro de Accesibilidad"}
              </h2>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground relative flex items-center gap-2">
              {a11y.keyboardMode && <kbd className="hidden sm:inline-block bg-muted-foreground/20 px-1.5 py-0.5 rounded text-[10px] font-mono">ESC</kbd>}
              <X className="size-5" />
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = a11y[opt.key];
              
              return (
                <div 
                  key={opt.key}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isActive ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{opt.label}</span>
                        {opt.tag && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block leading-tight">{opt.desc}</span>
                    </div>
                  </div>
                  
                  <button
                    role="switch"
                    aria-checked={isActive}
                    aria-label={opt.label}
                    onClick={() => setA11y(opt.key, !isActive)}
                    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                      isActive ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                        isActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
