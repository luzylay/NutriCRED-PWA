import React from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  HardDrive,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";

export function OfflineSystemNotifier() {
  const {
    isOnline,
    offlineQueue,
    syncProgress,
    toastNotice,
    isOfflineGuideOpen,
    setIsOfflineGuideOpen,
  } = useData();

  return (
    <>
      {/* 1. Sync Progress Bar (Barra de progreso de sincronización) */}
      {syncProgress.isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground py-2 px-4 shadow-lg animate-in slide-in-from-top-full duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 animate-spin shrink-0" />
              <span>
                Sincronizando registros offline ({syncProgress.current} de {syncProgress.total})...
              </span>
            </div>
            <div className="w-32 bg-primary-foreground/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((syncProgress.current / (syncProgress.total || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Visual Toast Notice (Feedback visual para acciones offline & Guardado local) */}
      {toastNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`p-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
              toastNotice.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100"
                : toastNotice.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/40 text-amber-100"
                  : "bg-slate-950/90 border-slate-700/50 text-slate-100"
            }`}
          >
            {toastNotice.type === "success" && <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />}
            {toastNotice.type === "warning" && <WifiOff className="size-5 text-amber-400 shrink-0" />}
            {toastNotice.type === "info" && <HardDrive className="size-5 text-sky-400 shrink-0" />}
            <span className="text-xs font-bold leading-tight">{toastNotice.text}</span>
          </div>
        </div>
      )}

      {/* 3. Quick Offline Guide Modal (Guía rápida offline) */}
      {isOfflineGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <HelpCircle className="size-6" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg leading-tight font-nunito">
                    Guía Rápida Offline
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Funcionamiento en zonas rurales sin internet
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOfflineGuideOpen(false)}
                className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  num: "1",
                  title: "Registra Datos Normalmente",
                  desc: "Puedes tomar fotos de suplementos, registrar peso, talla y vacunas sin señal celular.",
                  icon: HardDrive,
                },
                {
                  num: "2",
                  title: "Almacenamiento Local Garantizado (IndexedDB)",
                  desc: "Todos los cambios se guardan de forma segura en la memoria interna de tu dispositivo.",
                  icon: ShieldCheck,
                },
                {
                  num: "3",
                  title: "Auto-Sincronización Transparente",
                  desc: "Al conectar el celular a red WiFi o móvil en el pueblo, los registros se envían al servidor sin perder nada.",
                  icon: RefreshCw,
                },
                {
                  num: "4",
                  title: "IA y Visión por Computadora 100% CPU",
                  desc: "El Traductor de Lengua de Señas (LSP), el Semáforo del Plato AR y el Escáner QR corren localmente.",
                  icon: Cpu,
                },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.num} className="bg-muted/30 border border-border p-3.5 rounded-2xl flex gap-3 items-start">
                    <div className="size-8 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <StepIcon className="size-3.5 text-primary" /> {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsOfflineGuideOpen(false)}
                className="w-full py-3 rounded-2xl btn-gradient text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Entendido, continuar trabajando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
