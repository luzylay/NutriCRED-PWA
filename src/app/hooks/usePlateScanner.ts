import { useCallback, useEffect, useRef, useState } from "react";
import { detectDeviceTier } from "../lib/vision/deviceCapabilities";
import { analyzeFrame, resetVisionState } from "../lib/vision/plateVisionEngine";
import type { DeviceTier, FoodDetection, PlateFoodId } from "../lib/vision/types";
import { FOOD_CATALOG } from "../lib/vision/types";

export type CameraStatus = "idle" | "requesting" | "active" | "denied" | "unavailable";
export type ManualOverride = "on" | "off";

export interface UsePlateScannerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraStatus: CameraStatus;
  detections: FoodDetection[];
  isScanning: boolean;
  isLowLight: boolean;
  fps: number;
  deviceTier: DeviceTier;
  errorMessage: string;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  setManualOverride: (id: PlateFoodId, override: ManualOverride | null) => void;
  manualOverrides: Partial<Record<PlateFoodId, ManualOverride>>;
}

function mergeDetections(
  auto: FoodDetection[],
  overrides: Partial<Record<PlateFoodId, ManualOverride>>,
): FoodDetection[] {
  const resultMap = new Map<PlateFoodId, FoodDetection>();

  for (const d of auto) {
    if (overrides[d.id] === "off") continue;
    resultMap.set(d.id, d);
  }

  for (const [id, override] of Object.entries(overrides) as [PlateFoodId, ManualOverride][]) {
    if (override === "on") {
      const meta = FOOD_CATALOG[id];
      resultMap.set(id, {
        id,
        label: meta.label,
        category: meta.category,
        confidence: 100,
        source: "manual",
      });
    }
  }

  return Array.from(resultMap.values());
}

async function getCameraStream(): Promise<MediaStream> {
  const constraints: MediaStreamConstraints[] = [
    { video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } },
    { video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } },
    { video: { width: { ideal: 640 }, height: { ideal: 480 } } },
    { video: true },
  ];

  let lastError: unknown;
  for (const c of constraints) {
    try {
      return await navigator.mediaDevices.getUserMedia(c);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

export function usePlateScanner(isOpen: boolean): UsePlateScannerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);
  const activeRef = useRef(false);
  const lastAnalyzeRef = useRef(0);
  const autoDetectionsRef = useRef<FoodDetection[]>([]);
  const manualOverridesRef = useRef<Partial<Record<PlateFoodId, ManualOverride>>>({});

  const deviceTier = useRef(detectDeviceTier()).current;

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [detections, setDetections] = useState<FoodDetection[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLowLight, setIsLowLight] = useState(false);
  const [fps, setFps] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<PlateFoodId, ManualOverride>>>({});

  const applyMerged = useCallback((auto: FoodDetection[]) => {
    autoDetectionsRef.current = auto;
    setDetections(mergeDetections(auto, manualOverridesRef.current));
  }, []);

  const setManualOverride = useCallback((id: PlateFoodId, override: ManualOverride | null) => {
    setManualOverrides((prev) => {
      const next = { ...prev };
      if (override === null) {
        delete next[id];
      } else {
        next[id] = override;
      }
      manualOverridesRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    manualOverridesRef.current = manualOverrides;
    setDetections(mergeDetections(autoDetectionsRef.current, manualOverrides));
  }, [manualOverrides]);

  const stopCamera = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) video.srcObject = null;
    resetVisionState();
    setCameraStatus("idle");
    setIsScanning(false);
    setDetections([]);
    autoDetectionsRef.current = [];
    setFps(0);
    setIsLowLight(false);
  }, []);

  const startAnalysisLoop = useCallback(() => {
    const interval = 1000 / deviceTier.targetFps;

    const loop = (timestamp: number) => {
      if (!activeRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      if (timestamp - lastAnalyzeRef.current >= interval) {
        lastAnalyzeRef.current = timestamp;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          try {
            const result = analyzeFrame(video, canvas, ctx, deviceTier);
            applyMerged(result.detections);
            setIsLowLight(result.isLowLight);
            setFps(result.fps);
          } catch {
            // skip frame
          }
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  }, [applyMerged, deviceTier]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      setErrorMessage("Tu navegador no soporta acceso a la cámara.");
      return;
    }

    setCameraStatus("requesting");
    setErrorMessage("");

    try {
      const stream = await getCameraStream();
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("Video element not ready");

      video.srcObject = stream;
      await video.play();

      activeRef.current = true;
      setCameraStatus("active");
      setIsScanning(true);
      startAnalysisLoop();
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      activeRef.current = false;
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraStatus("denied");
        setErrorMessage("Permiso de cámara denegado. Autoriza el acceso en tu navegador.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraStatus("unavailable");
        setErrorMessage("No se encontró ninguna cámara en este dispositivo.");
      } else {
        setCameraStatus("unavailable");
        setErrorMessage(err.message || "Error al acceder a la cámara.");
      }
    }
  }, [startAnalysisLoop]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setManualOverrides({});
      manualOverridesRef.current = {};
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return {
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
    stopCamera,
    setManualOverride,
    manualOverrides,
  };
}
