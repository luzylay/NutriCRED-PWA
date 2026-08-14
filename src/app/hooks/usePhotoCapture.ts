import { useCallback, useEffect, useRef, useState } from "react";
import {
  canvasToDataUrl,
  validateSupplementPhoto,
  type PhotoValidationResult,
} from "../lib/vision/supplementPhotoValidator";

export type PhotoCaptureStatus =
  | "idle"
  | "requesting"
  | "live"
  | "processing"
  | "preview"
  | "denied"
  | "unavailable";

export interface CapturedPhoto {
  dataUrl: string;
  validation: PhotoValidationResult;
  capturedAt: string;
}

async function getCameraStream(): Promise<MediaStream> {
  const constraints: MediaStreamConstraints[] = [
    { video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } },
    { video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } },
    { video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } } },
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

export function usePhotoCapture(active: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<PhotoCaptureStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captured, setCaptured] = useState<CapturedPhoto | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) video.srcObject = null;
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      setErrorMessage("Tu navegador no soporta la cámara.");
      return;
    }

    setStatus("requesting");
    setErrorMessage("");

    try {
      const stream = await getCameraStream();
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video no disponible");
      video.srcObject = stream;
      await video.play();
      setStatus("live");
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      stopCamera();
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStatus("denied");
        setErrorMessage("Permiso de cámara denegado.");
      } else if (err.name === "NotFoundError") {
        setStatus("unavailable");
        setErrorMessage("No se encontró cámara en este dispositivo.");
      } else {
        setStatus("unavailable");
        setErrorMessage(err.message || "Error al acceder a la cámara.");
      }
    }
  }, [stopCamera]);

  const capturePhoto = useCallback(async (): Promise<CapturedPhoto | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    setStatus("processing");

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const validation = validateSupplementPhoto(imageData);

    try {
      const dataUrl = await canvasToDataUrl(canvas);
      const photo: CapturedPhoto = {
        dataUrl,
        validation,
        capturedAt: new Date().toISOString(),
      };
      setCaptured(photo);
      stopCamera();
      setStatus("preview");
      return photo;
    } catch {
      setStatus("live");
      setErrorMessage("No se pudo procesar la foto.");
      return null;
    }
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCaptured(null);
    setErrorMessage("");
    startCamera();
  }, [startCamera]);

  const clearPhoto = useCallback(() => {
    setCaptured(null);
    setErrorMessage("");
    setStatus("idle");
    stopCamera();
  }, [stopCamera]);

  const acceptDespiteValidation = useCallback(() => {
    if (!captured || !captured.validation.privacyOk) return;
    setCaptured((prev) =>
      prev
        ? {
            ...prev,
            validation: { ...prev.validation, isValid: true, message: "Foto aceptada manualmente." },
          }
        : null,
    );
  }, [captured]);

  useEffect(() => {
    if (active && status === "idle" && !captured) {
      startCamera();
    }
    if (!active) {
      clearPhoto();
    }
    return () => stopCamera();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    videoRef,
    canvasRef,
    status,
    errorMessage,
    captured,
    startCamera,
    stopCamera,
    capturePhoto,
    retake,
    clearPhoto,
    acceptDespiteValidation,
  };
}
