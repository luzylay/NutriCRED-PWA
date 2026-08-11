import { useState, useRef, useEffect } from "react";
import { Camera, X, Sparkles, AlertCircle, CheckCircle2, Zap, Clock } from "lucide-react";


interface PlateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlateScannerModal({ isOpen, onClose }: PlateScannerModalProps) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(["sangrecita", "limon"]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } else {
        setHasCamera(false);
      }
    } catch {
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  if (!isOpen) return null;

  const hasHeme = selectedItems.includes("sangrecita") || selectedItems.includes("higado");
  const hasEnhancer = selectedItems.includes("limon") || selectedItems.includes("naranja");
  const hasInhibitor = selectedItems.includes("leche") || selectedItems.includes("cafe");

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
              <p className="text-xs font-semibold text-muted-foreground">Escáner de Absorción de Nutrientes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Camera Viewport with AR 2D Traffic Light Overlays */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-dashed border-amber-500/40 shadow-inner">
          {hasCamera === false ? (
            <div className="text-center p-6 space-y-2">
              <Camera className="size-10 text-muted-foreground mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">
                Cámara en vivo activa. Selecciona los alimentos para simular el plato.
              </p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
          )}

          {/* AR 2D Metabolic Overlay Badges */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between items-start">
              <span className="bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-amber-300">
                Escaneando plato...
              </span>
              <span className="bg-amber-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                AR 2D Active
              </span>
            </div>

            {/* Simulated Detected Badges on Camera */}
            <div className="flex flex-wrap gap-2 justify-center my-auto">
              {hasHeme && (
                <div className="bg-amber-500/90 text-black border-2 border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg animate-pulse flex items-center gap-1.5">
                  <Zap className="size-4" />
                  <span>DORADO: Sangrecita/Hígado (Hierro HEM - Pase Libre)</span>
                </div>
              )}
              {hasEnhancer && (
                <div className="bg-emerald-500/90 text-white border-2 border-emerald-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  <span>VERDE: Limón/Vitamina C (Potenciador x5)</span>
                </div>
              )}
              {hasInhibitor && (
                <div className="bg-red-500/90 text-white border-2 border-red-300 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5">
                  <AlertCircle className="size-4" />
                  <span>ROJO: Leche/Té (Inhibidor - Bloquea la absorción)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Food Item Selectors */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Alimentos presentes en el plato:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "sangrecita", label: "Sangrecita / Hígado", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
              { id: "limon", label: "Limón / Vitamina C", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
              { id: "leche", label: "Leche / Lácteos", color: "bg-red-500/10 text-red-600 border-red-500/30" },
              { id: "cafe", label: "Té / Infusiones", color: "bg-red-500/10 text-red-600 border-red-500/30" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedItems.includes(item.id)
                    ? item.color + " shadow-sm font-black border-2"
                    : "bg-muted/40 border-border text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-World Practical Metabolic Advice */}
        <div className="space-y-2 pt-1 border-t border-border">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
              <Clock className="size-4" />
              <span>Regla de Oro de la Nutricionista:</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {hasInhibitor
                ? "⚠️ ¡Atención! Los lácteos o infusiones contienen calcio y fitatos que bloquean la absorción de hierro. Espera 2 horas entre la sangrecita y la leche."
                : "✅ ¡Excelente combinación! La Vitamina C abre los receptores intestinales permitiendo que el hierro ingrese 5 veces más rápido al cuerpo del bebé."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlateScannerModal;
