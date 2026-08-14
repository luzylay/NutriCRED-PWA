import { Camera, CheckCircle2, RefreshCw, X, AlertTriangle, Shield } from "lucide-react";
import { usePhotoCapture } from "../../hooks/usePhotoCapture";

interface SupplementPhotoCaptureProps {
  active: boolean;
  onPhotoAccepted: (dataUrl: string) => void;
  onPhotoCleared: () => void;
}

export function SupplementPhotoCapture({
  active,
  onPhotoAccepted,
  onPhotoCleared,
}: SupplementPhotoCaptureProps) {
  const {
    videoRef,
    canvasRef,
    status,
    errorMessage,
    captured,
    startCamera,
    capturePhoto,
    retake,
    clearPhoto,
    acceptDespiteValidation,
  } = usePhotoCapture(active);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo?.validation.isValid) {
      onPhotoAccepted(photo.dataUrl);
    }
  };

  const handleAcceptManual = () => {
    if (!captured?.validation.privacyOk) return;
    acceptDespiteValidation();
    onPhotoAccepted(captured.dataUrl);
  };

  const handleClear = () => {
    clearPhoto();
    onPhotoCleared();
  };

  // Foto ya confirmada y guardada
  if (captured?.validation.isValid && status === "preview") {
    return (
      <div className="space-y-2">
        <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-emerald-500/5">
          <img
            src={captured.dataUrl}
            alt="Evidencia de suplemento"
            className="w-full h-36 object-cover"
          />
          <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="size-3" /> Guardada
          </div>
        </div>
        <p className="text-[10px] text-emerald-600 font-semibold text-center">
          {captured.validation.message}
        </p>
        <button
          type="button"
          onClick={() => { handleClear(); startCamera(); }}
          className="w-full text-xs text-muted-foreground hover:text-foreground font-semibold py-1 cursor-pointer"
        >
          Tomar otra foto
        </button>
      </div>
    );
  }

  // Preview con validación fallida
  if (captured && status === "preview" && !captured.validation.isValid) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40">
          <img src={captured.dataUrl} alt="Vista previa" className="w-full h-36 object-cover opacity-80" />
        </div>
        <div className={`flex gap-2 p-3 rounded-xl text-xs font-semibold ${
          captured.validation.privacyOk
            ? "bg-amber-500/10 text-amber-700 border border-amber-500/30"
            : "bg-rose-500/10 text-rose-700 border border-rose-500/30"
        }`}>
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span>{captured.validation.message}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={retake}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs font-bold cursor-pointer hover:bg-muted"
          >
            <RefreshCw className="size-3.5" /> Reintentar
          </button>
          {captured.validation.privacyOk && (
            <button
              type="button"
              onClick={handleAcceptManual}
              className="py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer hover:bg-amber-400"
            >
              Usar de todos modos
            </button>
          )}
        </div>
      </div>
    );
  }

  // Cámara en vivo o estados de carga/error
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Shield className="size-3.5 text-primary" />
          Solo el suplemento — sin rostros
        </span>
        <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono text-[9px]">
          100% CPU Local
        </span>
      </div>

      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-dashed border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: status === "live" || status === "processing" ? "block" : "none" }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {(status === "idle" || status === "requesting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Activando cámara...</p>
          </div>
        )}

        {(status === "denied" || status === "unavailable") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4 text-center">
            <Camera className="size-8 text-muted-foreground mx-auto" />
            <p className="text-xs text-rose-400 font-bold">{errorMessage}</p>
            <div className="flex flex-col gap-2 w-full max-w-[220px]">
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-black cursor-pointer shadow-sm"
              >
                Reintentar Cámara Web
              </button>
              
              {/* Fallback a Cámara Nativa del Celular / Archivo */}
              <label className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                <Camera className="size-3.5" />
                <span>Usar Cámara Nativa</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const url = evt.target?.result as string;
                        if (url) onPhotoAccepted(url);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {status === "live" && (
          <>
            {/* Guía AR: recuadro central */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[55%] h-[45%] border-2 border-dashed border-white/70 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="bg-black/60 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                Coloca el frasco o gotero dentro del recuadro
              </span>
            </div>
          </>
        )}

        {status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="size-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {status === "live" && (
        <button
          type="button"
          onClick={handleCapture}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Camera className="size-5" />
          Capturar evidencia
        </button>
      )}

      {active && status !== "denied" && status !== "unavailable" && (
        <button
          type="button"
          onClick={handleClear}
          className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium py-1 cursor-pointer"
        >
          <X className="size-3" /> Cancelar foto
        </button>
      )}
    </div>
  );
}
