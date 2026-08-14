import { Camera, X, Sparkles, AlertCircle, CheckCircle2, Zap, Clock, RefreshCw, Eye, Sun } from "lucide-react";
import { usePlateScanner } from "../../hooks/usePlateScanner";
import type { FoodDetection, PlateFoodId } from "../../lib/vision/types";

interface PlateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOOD_BUTTONS: { id: PlateFoodId; label: string; color: string }[] = [
  { id: "sangrecita", label: "Sangrecita / Hígado", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  { id: "limon", label: "Limón / Vitamina C", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { id: "leche", label: "Leche / Lácteos", color: "bg-red-500/10 text-red-600 border-red-500/30" },
  { id: "cafe", label: "Té / Infusiones", color: "bg-red-500/10 text-red-600 border-red-500/30" },
];

function CategoryBadge({ detection }: { detection: FoodDetection }) {
  if (detection.category === "heme") {
    return (
      <div className="bg-amber-500/90 text-black border-2 border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg animate-pulse flex items-center gap-1.5">
        <Zap className="size-4 shrink-0" />
        <span>DORADO: {detection.label} (Hierro HEM - Pase Libre) {detection.confidence}%</span>
      </div>
    );
  }
  if (detection.category === "enhancer") {
    return (
      <div className="bg-emerald-500/90 text-white border-2 border-emerald-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>VERDE: {detection.label} (Potenciador x5) {detection.confidence}%</span>
      </div>
    );
  }
  return (
    <div className="bg-red-500/90 text-white border-2 border-red-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5">
      <AlertCircle className="size-4 shrink-0" />
      <span>ROJO: {detection.label} (Inhibidor - Bloquea absorción) {detection.confidence}%</span>
    </div>
  );
}

export function PlateScannerModal({ isOpen, onClose }: PlateScannerModalProps) {
  const {
    videoRef,
    canvasRef,
    cameraStatus,
    detections,
    isScanning,
    isLowLight,
    fps,
    deviceTier,
    errorMessage,
    startCamera,
    setManualOverride,
    manualOverrides,
  } = usePlateScanner(isOpen);

  if (!isOpen) return null;

  const hasHeme = detections.some((d) => d.category === "heme");
  const hasEnhancer = detections.some((d) => d.category === "enhancer");
  const hasInhibitor = detections.some((d) => d.category === "inhibitor");

  const GROUP_MAP: Partial<Record<PlateFoodId, PlateFoodId[]>> = {
    sangrecita: ["sangrecita", "higado"],
    limon: ["limon", "naranja"],
    leche: ["leche"],
    cafe: ["cafe"],
  };

  const isItemActive = (id: PlateFoodId) => {
    const group = GROUP_MAP[id] ?? [id];
    return detections.some((d) => group.includes(d.id));
  };

  const toggleItem = (id: PlateFoodId) => {
    const active = isItemActive(id);
    if (active) {
      setManualOverride(id, "off");
      // También apagar variantes detectadas automáticamente
      if (id === "sangrecita") setManualOverride("higado", "off");
      if (id === "limon") setManualOverride("naranja", "off");
    } else {
      setManualOverride(id, "on");
    }
  };

  const cameraError = cameraStatus === "denied" || cameraStatus === "unavailable";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-[2.5rem] max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Camera className="size-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-base leading-tight font-nunito flex items-center gap-1.5">
                Semáforo Metabólico del Plato
                <Sparkles className="size-3.5 text-amber-500" />
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">
                Visión por computadora · CPU · Open Source
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-dashed border-amber-500/40 shadow-inner">
          {/* Video oculto + canvas de análisis */}
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-90" style={{ display: cameraStatus === "active" ? "block" : "none" }} />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" />

          {cameraStatus === "requesting" && (
            <div className="text-center p-6 space-y-3 z-10">
              <div className="size-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">Solicitando acceso a la cámara...</p>
            </div>
          )}

          {cameraError && (
            <div className="text-center p-6 space-y-3 z-10">
              <Camera className="size-10 text-muted-foreground mx-auto" />
              <p className="text-xs font-medium text-red-400">{errorMessage}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="size-3.5" /> Reintentar
              </button>
            </div>
          )}

          {cameraStatus === "active" && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1">
                  <span className="bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-amber-300 flex items-center gap-1.5 w-fit">
                    <Eye className="size-3" />
                    {isScanning ? "Analizando plato..." : "Escaneando..."}
                  </span>
                  {isLowLight && (
                    <span className="bg-yellow-600/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                      <Sun className="size-3" /> Poca luz — acerca una lámpara
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-amber-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    CV Activo
                  </span>
                  <span className="bg-black/60 text-white/70 px-2 py-0.5 rounded text-[9px] font-mono">
                    {fps} fps · CPU · {deviceTier.tier}
                  </span>
                </div>
              </div>

              {/* Badges de detección en tiempo real */}
              <div className="flex flex-wrap gap-2 justify-center my-auto">
                {detections.length === 0 ? (
                  <span className="bg-black/60 backdrop-blur-md text-white/80 px-4 py-2 rounded-2xl text-xs font-semibold border border-white/10">
                    Apunta la cámara al plato con alimentos
                  </span>
                ) : (
                  detections.map((d) => <CategoryBadge key={d.id} detection={d} />)
                )}
              </div>
            </div>
          )}
        </div>

        {/* Corrección manual */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Corregir detección manualmente:</span>
            <span className="text-[10px] font-normal normal-case text-muted-foreground/70">Toca para añadir o quitar</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FOOD_BUTTONS.map((item) => {
              const active = isItemActive(item.id);
              const isManual = manualOverrides[item.id] === "on";
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    active
                      ? item.color + " shadow-sm font-black border-2"
                      : "bg-muted/40 border-border text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {active && !isManual && (
                    <span className="block text-[9px] font-normal opacity-70 mt-0.5">auto</span>
                  )}
                  {isManual && (
                    <span className="block text-[9px] font-normal opacity-70 mt-0.5">manual</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consejo metabólico */}
        <div className="space-y-2 pt-1 border-t border-border">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
              <Clock className="size-4" />
              <span>Regla de Oro de la Nutricionista:</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {hasInhibitor
                ? "⚠️ ¡Atención! Los lácteos o infusiones contienen calcio y fitatos que bloquean la absorción de hierro. Espera 2 horas entre la sangrecita y la leche."
                : hasHeme && hasEnhancer
                  ? "✅ ¡Excelente combinación! La Vitamina C abre los receptores intestinales permitiendo que el hierro ingrese 5 veces más rápido al cuerpo del bebé."
                  : hasHeme
                    ? "💡 Tienes hierro hemo en el plato. Añade limón o naranja para potenciar la absorción hasta 5 veces."
                    : "📸 Coloca el plato bajo buena luz. El escáner detectará sangrecita, cítricos, lácteos e infusiones automáticamente."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlateScannerModal;
