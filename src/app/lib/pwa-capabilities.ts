/**
 * Módulo de Capacidades PWA y Web APIs Nativas (Proyecto Fugu) - Costo $0
 */

// ─── 1. APP BADGING API ────────────────────────────────────────────────────────

interface NavigatorWithBadging extends Navigator {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
}

/**
 * Actualiza el contador de notificación (Badge) en el icono instalado de la PWA.
 * Soportado en iOS 16.4+, Android Chrome, Edge y Desktop.
 * Costo: $0 (API Nativa)
 */
export async function updateAppBadge(count: number): Promise<void> {
  if (typeof navigator !== "undefined" && "setAppBadge" in navigator) {
    try {
      const nav = navigator as NavigatorWithBadging;
      if (count > 0 && nav.setAppBadge) {
        await nav.setAppBadge(count);
      } else if (nav.clearAppBadge) {
        await nav.clearAppBadge();
      }
    } catch (err) {
      console.warn("App Badging no soportado o denegado:", err);
    }
  }
}

/**
 * Limpia el badge del icono de la PWA.
 */
export async function clearAppBadge(): Promise<void> {
  if (typeof navigator !== "undefined" && "clearAppBadge" in navigator) {
    try {
      const nav = navigator as NavigatorWithBadging;
      if (nav.clearAppBadge) {
        await nav.clearAppBadge();
      }
    } catch (err) {
      console.warn("Fallo al limpiar App Badge:", err);
    }
  }
}


// ─── 2. SPEECH RECOGNITION (VOZ A TEXTO) ───────────────────────────────────────

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

/**
 * Inicia la escucha por voz nativa del dispositivo.
 * Costo: $0 (Nativo del Navegador)
 */
export function startSpeechRecognition(
  onResult: (res: SpeechRecognitionResult) => void,
  onError: (err: string) => void,
  onEnd?: () => void,
): { stop: () => void } | null {
  const windowObj = window as any;
  const SpeechRecognition =
    windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Tu navegador no soporta reconocimiento de voz nativo.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-PE"; // Español de Perú
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let transcript = "";
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isFinal = true;
      }
    }

    onResult({ transcript, isFinal });
  };

  recognition.onerror = (event: any) => {
    onError(event.error || "Error al escuchar la voz.");
  };

  if (onEnd) {
    recognition.onend = onEnd;
  }

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
}

// ─── 3. SPEECH SYNTHESIS (TEXTO A VOZ HABLADA) ────────────────────────────────

/**
 * Sintetiza y habla un texto en español nativo usando las voces del SO.
 * Costo: $0 (Nativo del Navegador)
 */
export function speakText(
  text: string,
  onEnd?: () => void,
): { stop: () => void } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel(); // Cancelar locuciones previas

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-PE";
  utterance.rate = 1.0; // Velocidad natural
  utterance.pitch = 1.0;

  // Seleccionar la mejor voz en español disponible
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(
    (v) => v.lang.startsWith("es") && (v.name.includes("Natural") || v.name.includes("Sabina") || v.name.includes("Helena") || v.name.includes("Google")),
  ) || voices.find((v) => v.lang.startsWith("es"));

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
    },
  };
}

// ─── 4. WEB SHARE API ─────────────────────────────────────────────────────────

/**
 * Comparte datos nativamente a través de WhatsApp, SMS u otras apps.
 * Costo: $0 (Nativo)
 */
export async function shareNative(data: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (err) {
      console.warn("Error o cancelación de Web Share:", err);
    }
  }
  return false;
}
