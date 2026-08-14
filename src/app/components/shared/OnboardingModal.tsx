import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  WifiOff,
  ChevronRight,
  ChevronLeft,
  X,
  HeartPulse,
  Brain,
  Camera,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "¡Bienvenido a Yanapiri Wawa!",
      subtitle: "Plataforma Inteligente de Nutrición Infantil y Salud CRED",
      icon: HeartPulse,
      color: "from-blue-600 to-indigo-600",
      content:
        "Yanapiri Wawa es tu asistente médico y nutricional para cuidar el crecimiento de tu bebé con inteligencia artificial 100% local en tu teléfono.",
      badge: "Edición Perú · MINSA",
    },
    {
      title: "IA en Lengua de Señas (LSP)",
      subtitle: "Inclusión Accesible 100% CPU Local",
      icon: Brain,
      color: "from-purple-600 to-indigo-600",
      content:
        "Nuestro traductor usa visión por computadora en tiempo real para interpretar señas de salud sin consumir datos ni depender de la nube.",
      badge: "MediaPipe WASM",
    },
    {
      title: "Semáforo del Plato AR y Evidencia",
      subtitle: "Escáner de Nutrición y Protección Infantil",
      icon: Camera,
      color: "from-emerald-600 to-teal-600",
      content:
        "Escanea platos de comida y frascos de sulfato ferroso. La IA clasifica alimentos ricos en hierro y protege la privacidad del rostro infantil.",
      badge: "Privacidad Garantizada",
    },
    {
      title: "Operación 100% Offline Rural",
      subtitle: "Guarda todo sin internet y sincroniza al conectar",
      icon: WifiOff,
      color: "from-amber-600 to-orange-600",
      content:
        "Todos los registros de peso, talla, vacunas y fotos se guardan en la memoria de tu celular. Nunca perderás información por falta de señal.",
      badge: "Resiliencia Offline",
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("yanapiri_onboarding_done", "true");
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${current.color} opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-all duration-500`} />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black">
            {current.badge}
          </span>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="space-y-4 relative z-10 text-center py-2">
          <div className={`size-16 rounded-3xl bg-gradient-to-br ${current.color} text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/20`}>
            <Icon className="size-8" />
          </div>
          <div>
            <h3 className="font-black text-xl text-foreground font-nunito tracking-tight">{current.title}</h3>
            <p className="text-xs font-bold text-primary mt-1">{current.subtitle}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            {current.content}
          </p>
        </div>

        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-1.5 relative z-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-3 relative z-10 pt-2 border-t border-border/50">
          {step > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="size-4" /> Anterior
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl btn-gradient text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
          >
            <span>{step === steps.length - 1 ? "¡Empezar Ahora!" : "Siguiente"}</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
