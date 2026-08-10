import { useState, useRef, useEffect } from "react";
import { Camera, X, CheckCircle2, QrCode, Sparkles, RefreshCw } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: { childId: string; childName: string; credCode: string }) => void;
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
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
    setIsScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } catch {
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleSimulatedScan = () => {
    // Simula escaneo exitoso instantáneo para demo
    onScanSuccess({
      childId: "3",
      childName: "Juan Quispe Mamani",
      credCode: "CRED-2026-8894",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-[2.5rem] max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <QrCode className="size-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg leading-tight font-nunito">Escáner de Carnet CRED</h3>
              <p className="text-xs font-semibold text-muted-foreground">Lectura rápida por cámara ($0 Costo)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Viewport de Cámara */}
        <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 border-dashed border-primary/40">
          {hasCameraPermission === false ? (
            <div className="text-center p-6 space-y-3">
              <Camera className="size-10 text-muted-foreground mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">
                Cámara en vivo lista o usando simulador inteligente.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Mira de Escaneo Animada */}
          <div className="absolute inset-8 border-2 border-primary rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            <div className="flex justify-between">
              <span className="size-4 border-t-2 border-l-2 border-primary"></span>
              <span className="size-4 border-t-2 border-r-2 border-primary"></span>
            </div>
            <div className="w-full h-0.5 bg-primary/80 animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <div className="flex justify-between">
              <span className="size-b-2 border-b-2 border-l-2 border-primary"></span>
              <span className="size-b-2 border-b-2 border-r-2 border-primary"></span>
            </div>
          </div>
        </div>

        {/* Botón de Demostración Instantánea */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSimulatedScan}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="size-4" />
            <span>Simular Lectura de QR "Juan Quispe"</span>
          </button>
          
          <p className="text-[11px] text-center text-muted-foreground font-medium">
            💡 Escanea códigos QR impresos en el carnet de vacunación física del niño.
          </p>
        </div>

      </div>
    </div>
  );
}
