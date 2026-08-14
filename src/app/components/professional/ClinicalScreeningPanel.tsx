import React, { useState } from "react";
import { Brain, HeartPulse, AlertTriangle, Plus, Activity, CheckCircle2 } from "lucide-react";

export function ClinicalScreeningPanel() {
  const [mchatDone, setMchatDone] = useState(false);
  const [phq2Done, setPhq2Done] = useState(false);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mb-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2.5 rounded-xl bg-indigo-500/10">
          <Brain className="size-6 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-foreground font-nunito">Tamizaje Clínico Avanzado</h3>
          <p className="text-xs text-muted-foreground mt-0.5">M-CHAT-R/F (Autismo) y PHQ-2 (Salud Mental Cuidador)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* M-CHAT-R/F Panel */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none">
            <Brain className="size-24 text-primary" />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md border border-primary/20 uppercase tracking-wider">
                TEA (24 Meses)
              </span>
            </div>
            {!mchatDone && (
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 text-[10px] font-bold">
                <AlertTriangle className="size-3" />
                Pendiente
              </div>
            )}
            {mchatDone && (
              <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-[10px] font-bold">
                <CheckCircle2 className="size-3" />
                Completado
              </div>
            )}
          </div>
          
          <h4 className="font-bold text-foreground text-sm mb-1.5 relative z-10">Tamizaje TEA — M-CHAT-R/F</h4>
          <p className="text-xs text-muted-foreground mb-5 relative z-10 line-clamp-2">
            Obligatorio a los 24 meses. Detección temprana de signos de trastorno del espectro autista (TEA). NTS N° 238-MINSA/DGIESP-2025.
          </p>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setMchatDone(true)}
              disabled={mchatDone}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                mchatDone ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
              }`}
            >
              <Plus className="size-3.5" />
              Aplicar Test
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20">
              <Activity className="size-3.5" />
              Historial
            </button>
          </div>
        </div>

        {/* PHQ-2 Panel */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none">
            <HeartPulse className="size-24 text-rose-500" />
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-500/20 uppercase tracking-wider">
                Cuidador
              </span>
            </div>
            {!phq2Done && (
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 text-[10px] font-bold">
                <AlertTriangle className="size-3" />
                Sugerido
              </div>
            )}
            {phq2Done && (
              <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-[10px] font-bold">
                <CheckCircle2 className="size-3" />
                Completado
              </div>
            )}
          </div>
          
          <h4 className="font-bold text-foreground text-sm mb-1.5 relative z-10">Salud Mental del Cuidador — PHQ-2</h4>
          <p className="text-xs text-muted-foreground mb-5 relative z-10 line-clamp-2">
            Detección rápida de signos de depresión, ansiedad o violencia familiar en el entorno directo del niño.
          </p>
          
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setPhq2Done(true)}
              disabled={phq2Done}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                phq2Done ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md"
              }`}
            >
              <Plus className="size-3.5" />
              Aplicar PHQ-2
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20">
              <Activity className="size-3.5" />
              Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
