import { useState, useEffect } from "react";
import {
  X,
  Pill,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import type { SupplementType, DailyTrackingRecord } from "../../lib/types";
import { SupplementPhotoCapture } from "./SupplementPhotoCapture";

interface DailyTrackingModalProps {
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

export function DailyTrackingModal({ isOpen, onClose, onSubmit }: DailyTrackingModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: SRSI, Step 2: Alarms
  
  // SRSI State
  const [supplementTaken, setSupplementTaken] = useState<boolean | null>(null);
  const [supplementType, setSupplementType] = useState<SupplementType>("Hierro");
  const [takesEveryDay, setTakesEveryDay] = useState<boolean>(true);
  const [forgetsFrequency, setForgetsFrequency] = useState<"Nunca" | "A veces" | "Muchas veces">("Nunca");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isPhotoCaptureOpen, setIsPhotoCaptureOpen] = useState(false);

  // Alarms State
  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleAlarm = (sign: string) => {
    setSelectedAlarms(prev => 
      prev.includes(sign) ? prev.filter(s => s !== sign) : [...prev, sign]
    );
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
  };

  const handleSubmit = () => {
    onSubmit({
      supplement_taken: supplementTaken || false,
      supplement_type: supplementType,
      takes_every_day: takesEveryDay,
      forgets_frequency: forgetsFrequency,
      photo_proof_url: photoDataUrl ?? undefined,
      has_alarms: selectedAlarms.length > 0,
      alarm_signs: selectedAlarms
    });
  };

  const handlePhotoAccepted = (dataUrl: string) => {
    setPhotoDataUrl(dataUrl);
    setIsPhotoCaptureOpen(false);
  };

  const handlePhotoCleared = () => {
    setPhotoDataUrl(null);
    setIsPhotoCaptureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-5 relative shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-full transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2.5 rounded-2xl backdrop-blur-sm border border-primary-foreground/30">
              {step === 1 ? <Pill className="size-6 text-primary-foreground" /> : <AlertTriangle className="size-6 text-primary-foreground" />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight font-nunito text-primary-foreground">
                {step === 1 ? "Seguimiento Diario" : "Signos de Alarma"}
              </h2>
              <span className="inline-block mt-1 bg-primary-foreground/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-extrabold text-primary-foreground shadow-xs border border-primary-foreground/30">
                {step === 1 ? "Paso 1 de 2: Suplementación" : "Paso 2 de 2: Evaluación Clínica"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground block">
                  ¿Su niño tomó su suplemento hoy?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSupplementTaken(true)}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer ${
                      supplementTaken === true 
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                      : "border-border bg-card hover:bg-muted text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="size-5" /> Sí, tomó
                  </button>
                  <button
                    onClick={() => setSupplementTaken(false)}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer ${
                      supplementTaken === false 
                      ? "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/20" 
                      : "border-border bg-card hover:bg-muted text-foreground"
                    }`}
                  >
                    <X className="size-5" /> No tomó
                  </button>
                </div>
              </div>

              {supplementTaken && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-border/50 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">¿Qué suplemento toma?</label>
                    <select
                      value={supplementType}
                      onChange={(e) => setSupplementType(e.target.value as SupplementType)}
                      className="w-full bg-input-background border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    >
                      <option value="Hierro">Hierro</option>
                      <option value="Micronutrientes en polvo (MNP)">Micronutrientes en polvo (MNP)</option>
                      <option value="Vitamina A">Vitamina A</option>
                      <option value="Zinc">Zinc</option>
                      <option value="Vitamina D">Vitamina D</option>
                      <option value="No toma suplementos">No toma suplementos</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground">Evidencia (Opcional)</label>
                    {photoDataUrl && !isPhotoCaptureOpen ? (
                      <div className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/50">
                          <img
                            src={photoDataUrl}
                            alt="Evidencia de suplemento"
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Evidencia adjunta
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setPhotoDataUrl(null); setIsPhotoCaptureOpen(true); }}
                          className="w-full text-xs text-muted-foreground hover:text-foreground font-semibold py-1 cursor-pointer"
                        >
                          Cambiar foto
                        </button>
                      </div>
                    ) : isPhotoCaptureOpen ? (
                      <SupplementPhotoCapture
                        active={isPhotoCaptureOpen}
                        onPhotoAccepted={handlePhotoAccepted}
                        onPhotoCleared={handlePhotoCleared}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPhotoCaptureOpen(true)}
                        className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed bg-background border-border hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                      >
                        <Camera className="size-6 mb-1 text-primary/70" />
                        <span className="text-xs font-semibold">Tomar foto del suplemento</span>
                        <span className="text-[10px] text-muted-foreground/80">Solo frasco o gotero — sin rostros</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground block">
                    ¿Lo toma todos los días?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg pr-4 border border-border">
                      <input type="radio" checked={takesEveryDay} onChange={() => setTakesEveryDay(true)} className="accent-primary size-4" />
                      <span className="font-semibold">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-lg pr-4 border border-border">
                      <input type="radio" checked={!takesEveryDay} onChange={() => setTakesEveryDay(false)} className="accent-rose-500 size-4" />
                      <span className="font-semibold">No</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground block">
                    ¿Se olvida de darle el suplemento?
                  </label>
                  <select
                    value={forgetsFrequency}
                    onChange={(e) => setForgetsFrequency(e.target.value as any)}
                    className="w-full bg-input-background border border-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  >
                    <option value="Nunca">Nunca (O casi nunca)</option>
                    <option value="A veces">A veces (1-2 veces por semana)</option>
                    <option value="Muchas veces">Muchas veces (Constantemente)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-rose-500/15 border-2 border-rose-500/30 p-4 rounded-2xl flex gap-3 shadow-xs">
                <AlertCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-sm font-black text-rose-950 dark:text-rose-100">Importante (Signos de Alarma)</h4>
                  <p className="text-xs text-rose-900 dark:text-rose-200 font-semibold mt-1 leading-relaxed">
                    Marque si su niño tiene alguno de estos problemas ahora mismo. Si no tiene ninguno, puede continuar.
                  </p>
                </div>
              </div>

              <div className="relative">
                {/* Scroll fade indicator */}
                <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none rounded-b-xl" />
                
                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar pb-14">
                  {ALARM_SIGNS.map((sign, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleAlarm(sign)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all text-left ${
                        selectedAlarms.includes(sign)
                        ? "border-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/10"
                        : "border-transparent bg-muted/50 hover:bg-muted active:scale-[0.98]"
                      }`}
                    >
                      <div className={`size-7 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                        selectedAlarms.includes(sign)
                        ? "bg-rose-500 border-rose-500 text-white"
                        : "border-border bg-background"
                      }`}>
                        {selectedAlarms.includes(sign) && (
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm leading-snug font-medium ${selectedAlarms.includes(sign) ? "text-rose-700 dark:text-rose-300 font-bold" : "text-foreground"}`}>
                        {sign}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/10 flex justify-between gap-3">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center gap-2 border border-border"
            >
              <ChevronLeft className="size-4" /> Atrás
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              onClick={handleNext}
              disabled={supplementTaken === null}
              className="px-6 py-3 rounded-xl font-black text-sm btn-gradient text-white shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              Continuar <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-xl font-black text-sm text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                selectedAlarms.length > 0 
                ? "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20" 
                : "btn-gradient shadow-primary/20"
              }`}
            >
              Finalizar Reporte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
