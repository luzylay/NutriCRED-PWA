import type { LanguageCode } from "./translations";

export interface SpeakOptions {
  language?: LanguageCode;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

class TTSHelper {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  public isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public speak(text: string, options: SpeakOptions = {}): boolean {
    if (!this.isSupported()) {
      console.warn(
        "SpeechSynthesis API not supported in this browser environment.",
      );
      return false;
    }

    this.stop();

    try {
      const cleanText = text.replace(/[*#_~`]/g, "").trim();
      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      const lang = options.language || "es";
      if (lang === "en") {
        utterance.lang = "en-US";
      } else if (lang === "qu" || lang === "ay") {
        // Quechua and Aymara use Spanish phonetics engine with slightly slower cadence for clear pronunciation
        utterance.lang = "es-PE";
        utterance.rate = options.rate || 0.88;
        utterance.pitch = options.pitch || 1.05;
      } else {
        utterance.lang = "es-PE";
        utterance.rate = options.rate || 0.95;
        utterance.pitch = options.pitch || 1.0;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("TTS Error:", e);
        this.isSpeaking = false;
        this.currentUtterance = null;
        options.onError?.();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn("Failed to invoke SpeechSynthesis:", e);
      return false;
    }
  }

  public stop(): void {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const tts = new TTSHelper();
