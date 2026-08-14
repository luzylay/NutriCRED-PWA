import React, { useState, useEffect } from "react";
import { X, Globe, Maximize2 } from "lucide-react";
import { useA11y } from "../../contexts/A11yContext";
import { useLocation } from "react-router";
import { LspOverlay } from "./lsp/LspOverlay";

const LSP_CONTEXTS: Record<string, { title: string; signs: string[] }> = {
  "/admin": { title: "ADMINISTRACIÓN", signs: ["MÉDICO", "AYUDA", "USUARIO", "VER"] },
  "/professional": { title: "PROFESIONAL CRED", signs: ["NIÑO", "CRECER", "ALERTA", "SALUD"] },
  "/family": { title: "FAMILIA", signs: ["HIJO", "COMIDA", "TIEMPO", "CUIDAR"] },
  "/agent": { title: "ACTOR SOCIAL", signs: ["VISITA", "COMUNIDAD", "CASA", "HABLAR"] },
  "/nutrition": { title: "NUTRICIÓN", signs: ["SANGRE", "HIERRO", "COMER", "FUERTE"] },
  "default": { title: "YANAPIRI WAWA", signs: ["BIENVENIDO", "SALUD", "NIÑO", "AYUDA"] },
};

export function SignLanguagePanel() {
  const { a11y, setA11y } = useA11y();
  const location = useLocation();
  const [activeSign, setActiveSign] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto animate sign
  useEffect(() => {
    if (!a11y.signLang || showAdvanced) return;
    const interval = setInterval(() => {
      setActiveSign((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [a11y.signLang, showAdvanced]);

  if (!a11y.signLang) return null;

  if (showAdvanced) {
    // When advanced is active, we render the full screen overlay
    // The overlay has its own close button that will just set signLang false, 
    // but if we want it to just minimize, we could pass setShowAdvanced to it.
    // For now, LspOverlay uses `setA11y("signLang", false)` to close entirely. 
    // We'll wrap it to intercept the close if needed, but the original LspOverlay does it globally.
    // Let's just render the LspOverlay.
    return (
      <div className="z-50 relative">
        <LspOverlay onMinimize={() => setShowAdvanced(false)} />
      </div>
    );
  }

  const path = Object.keys(LSP_CONTEXTS).find(p => location.pathname.startsWith(p)) || "default";
  const ctx = LSP_CONTEXTS[path];

  return (
    <div
      role="complementary"
      aria-label="Panel intérprete Lengua de Señas Peruana"
      className="fixed bottom-24 right-6 w-56 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 z-40"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-3 flex justify-between items-center">
        <div>
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="size-3" /> Intérprete LSP
          </div>
          <div className="text-[9px] text-white/50 mt-0.5">Lengua de Señas Peruana</div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setShowAdvanced(true)}
            aria-label="Abrir panel avanzado"
            className="bg-amber-500/20 hover:bg-amber-500/30 p-1 rounded-md text-amber-400 transition-colors"
          >
            <Maximize2 className="size-4" />
          </button>
          <button 
            onClick={() => setA11y("signLang", false)} 
            aria-label="Cerrar panel LSP"
            className="bg-white/10 hover:bg-white/20 p-1 rounded-md text-white/70 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Avatar area */}
      <div className="p-4 flex flex-col items-center relative">
        {/* SVG Avatar signing figure */}
        <div className="relative w-[120px] h-[130px] mb-3">
          <svg width="120" height="130" viewBox="0 0 120 130" fill="none" aria-label="Avatar intérprete de lengua de señas">
            <ellipse cx="60" cy="100" rx="35" ry="20" fill="rgba(245, 158, 11, 0.08)" />
            <rect x="40" y="55" width="40" height="42" rx="8" fill="#1e293b" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" />
            <circle cx="60" cy="38" r="20" fill="#F5D9C0" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" />
            <circle cx="53" cy="36" r="2.5" fill="#0f172a" />
            <circle cx="67" cy="36" r="2.5" fill="#0f172a" />
            <path d="M52 44 Q60 50 68 44" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M40 35 Q40 18 60 18 Q80 18 80 35" fill="#3D2B1A" />
            <path d={activeSign % 2 === 0 ? "M40 65 Q18 52 14 38" : "M40 65 Q20 55 16 45"} stroke="#F5D9C0" strokeWidth="9" strokeLinecap="round" className="transition-all duration-300" />
            <path d={activeSign % 2 === 0 ? "M80 65 Q102 52 106 38" : "M80 65 Q100 55 104 45"} stroke="#F5D9C0" strokeWidth="9" strokeLinecap="round" className="transition-all duration-300" />
            <circle cx={activeSign % 2 === 0 ? 14 : 16} cy={activeSign % 2 === 0 ? 36 : 43} r="7" fill="#F5D9C0" className="transition-all duration-300" />
            <circle cx={activeSign % 2 === 0 ? 106 : 104} cy={activeSign % 2 === 0 ? 36 : 43} r="7" fill="#F5D9C0" className="transition-all duration-300" />
            <path d="M50 97 L46 125" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            <path d="M70 97 L74 125" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            <circle cx="60" cy="70" r="4" fill="rgba(245, 158, 11, 0.5)" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-500/10 rounded-full animate-pulse" />
        </div>

        {/* Current context */}
        <div className="text-[10px] text-white/50 mb-2 text-center leading-tight">
          {ctx.title}
        </div>

        {/* Active sign word */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1 font-mono text-sm font-bold text-amber-400 tracking-wider mb-3">
          {ctx.signs[activeSign % ctx.signs.length]}
        </div>

        {/* Sign navigation */}
        <div className="flex gap-1.5">
          {ctx.signs.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSign(i)}
              aria-label={`Seña ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeSign % ctx.signs.length ? "bg-amber-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={() => setShowAdvanced(true)}
        className="w-full p-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-400/80 font-bold tracking-wider transition-colors border-t border-white/5 flex items-center justify-center gap-2"
      >
        VER MODO AVANZADO <Maximize2 className="size-3" />
      </button>
    </div>
  );
}
