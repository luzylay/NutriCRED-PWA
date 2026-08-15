import { useState } from "react";
import { X, AlertTriangle, AlertCircle, Check, Phone, Ambulance, HeartPulse, ShieldAlert, PhoneCall } from "lucide-react";
import type { DailyTrackingRecord } from "../../lib/types";

interface AlarmSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<DailyTrackingRecord, "id" | "child_id" | "date">) => void;
}

const ALARM_SIGNS = [
  "Está muy pálido.",
  "Está muy débil o no quiere jugar.",
  "Duerme demasiado y cuesta despertarlo.",
  "No quiere comer ni tomar agua/leche.",
  "Respira muy rápido o le cuesta respirar.",
  "Se desmaya.",
  "Tiene ataques o convulsiones.",
  "Vomita todo lo que come o toma.",
  "Tiene diarrea muchas veces.",
  "Está muy delgadito o ha bajado mucho de peso.",
  "Tiene los pies hinchados.",
  "Tiene fiebre y está muy decaído."
];

export function AlarmSignsModal({ isOpen, onClose, onSubmit }: AlarmSignsModalProps) {
  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleAlarm = (sign: string) => {
    setSelectedAlarms(prev =>
      prev.includes(sign) ? prev.filter(s => s !== sign) : [...prev, sign]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      supplement_taken: false,
      supplement_type: "No toma suplementos",
      takes_every_day: false,
      forgets_frequency: "Nunca",
      has_alarms: selectedAlarms.length > 0,
      alarm_signs: selectedAlarms,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 relative shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/35">
              <AlertTriangle className="size-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight font-nunito text-white">
                Reportar Signos de Alarma
              </h2>
              <span className="inline-block mt-1 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-extrabold text-white shadow-xs border border-white/30">
                Evaluación Clínica de Emergencia
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Directorio Telefónico de Emergencia Rápida */}
          <div className="bg-gradient-to-r from-red-500/10 via-rose-500/10 to-amber-500/10 border-2 border-red-500/30 p-3.5 sm:p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="size-4 text-red-600" /> Directorio de Emergencias Médicas
              </span>
              <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">Llamada Gratuita</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:106"
                className="bg-red-600 text-white hover:bg-red-700 font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px] shadow-sm transition-all text-sm cursor-pointer active:scale-95"
              >
                <Ambulance className="size-4 shrink-0" />
                <span>SAMU 106</span>
              </a>
              <a
                href="tel:113"
                className="bg-blue-600 text-white hover:bg-blue-700 font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px] shadow-sm transition-all text-sm cursor-pointer active:scale-95"
              >
                <HeartPulse className="size-4 shrink-0" />
                <span>MINSA 113</span>
              </a>
              <a
                href="tel:116"
                className="bg-amber-600 text-white hover:bg-amber-700 font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px] shadow-sm transition-all text-sm cursor-pointer active:scale-95"
              >
                <ShieldAlert className="size-4 shrink-0" />
                <span>Bomberos 116</span>
              </a>
              <a
                href="tel:105"
                className="bg-slate-700 text-white hover:bg-slate-800 font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 min-h-[44px] shadow-sm transition-all text-sm cursor-pointer active:scale-95"
              >
                <PhoneCall className="size-4 shrink-0" />
                <span>Policía 105</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-rose-500/15 border-2 border-rose-500/30 p-3.5 sm:p-4 rounded-2xl flex gap-3 shadow-xs">
              <AlertCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-rose-950 dark:text-rose-100">
                  ¡Atención Urgente!
                </h4>
                <p className="text-xs text-rose-900 dark:text-rose-200 font-semibold mt-1 leading-relaxed">
                  Marque los signos que presenta su niño actualmente. Si no tiene ninguno de estos síntomas graves, puede cerrar este formulario.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Scroll fade indicator */}
              <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none rounded-b-xl" />

              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar pb-14">
                {ALARM_SIGNS.map((sign, idx) => {
                  const isSelected = selectedAlarms.includes(sign);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleAlarm(sign)}
                      className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all text-left min-h-[44px] ${
                        isSelected
                          ? "border-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/10"
                          : "border-transparent bg-muted/50 hover:bg-muted active:scale-[0.98]"
                      }`}
                    >
                      <div
                        className={`size-6 sm:size-7 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                          isSelected ? "bg-rose-500 border-rose-500 text-white" : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="size-4 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-sm leading-snug font-medium ${
                          isSelected ? "text-rose-700 dark:text-rose-300 font-bold" : "text-foreground"
                        }`}
                      >
                        {sign}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border bg-muted/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-3 rounded-xl font-bold text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center gap-2 border border-border cursor-pointer min-h-[44px]"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedAlarms.length === 0}
            className="px-5 sm:px-6 py-3 rounded-xl font-black text-sm text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20 cursor-pointer min-h-[44px]"
          >
            Reportar Emergencia
          </button>
        </div>
      </div>
    </div>
  );
}
