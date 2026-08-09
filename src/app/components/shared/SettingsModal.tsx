import { useState } from "react";
import {
  Globe,
  Palette,
  Volume2,
  BrainCircuit,
  Check,
  X,
  Sparkles,
  MountainSnow,
  AlertTriangle,
  Eye,
  ZoomIn,
} from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { tts } from "../../lib/i18n/tts-helper";
import type { LanguageCode } from "../../lib/i18n/translations";
import type { ThemeId } from "../../contexts/ThemeContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage, t, supportedLanguages } = useTranslation();
  const { theme, setTheme, themes, textScale, setTextScale } = useTheme();
  const [activeTab, setActiveTab] = useState<"language" | "theme" | "a11y" | "ai">("language");
  const [isTestingTTS, setIsTestingTTS] = useState(false);

  if (!isOpen) return null;

  const handleTestTTS = () => {
    setIsTestingTTS(true);
    let sampleText = "¡Hola! Yanapiri Wawa te ayuda a cuidar el crecimiento de tu bebé.";
    if (language === "qu") {
      sampleText = "Allillanchu! Yanapiri Wawa wawaykipa sumaq wiñayninta qhawan.";
    } else if (language === "ay") {
      sampleText = "Kamisaki! Yanapiri Wawa wawanakan suma jilawip sum uñji.";
    } else if (language === "en") {
      sampleText = "Hello! Yanapiri Wawa helps you monitor your child's healthy growth.";
    }

    tts.speak(sampleText, {
      language,
      onEnd: () => setIsTestingTTS(false),
      onError: () => setIsTestingTTS(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md glass-panel rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-primary/10 border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Globe className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
                {t("settings.title")}
              </h2>
              <p className="text-xs text-muted-foreground">Personalización e Idiomas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-muted/80 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab switcher inside settings */}
        <div className="flex border-b border-border/50 bg-muted/20 px-3 pt-2">
          {[
            { id: "language" as const, label: t("settings.language"), icon: Globe },
            { id: "theme" as const, label: t("settings.theme"), icon: Palette },
            { id: "a11y" as const, label: "Accesibilidad", icon: Eye },
            { id: "ai" as const, label: "IA Médica", icon: BrainCircuit },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold border-b-2 transition-all duration-300 ${
                  isActive
                    ? "border-primary text-primary bg-card/50 rounded-t-xl shadow-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-xl"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* LANGUAGE TAB */}
          {activeTab === "language" && (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("settings.language_desc")}
                </h3>
              </div>

              <div className="space-y-2">
                {supportedLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as LanguageCode)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between hover:scale-[1.02] ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-card/50 border-border/50 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {lang.abbrev}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{lang.nativeName}</p>
                          <p className="text-xs text-muted-foreground">{lang.region}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === "theme" && (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("settings.theme_desc")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themes.map((tItem) => {
                  const isSelected = theme === tItem.id;
                  return (
                    <button
                      key={tItem.id}
                      onClick={() => setTheme(tItem.id as ThemeId)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden hover:scale-[1.02] ${
                        isSelected
                          ? "ring-2 ring-primary border-primary shadow-md bg-card/80"
                          : "border-border/50 hover:border-primary/40 bg-card/40"
                      }`}
                    >
                      {/* Theme preview swatch */}
                      <div
                        className="h-10 rounded-xl mb-2.5 p-2 flex items-center justify-between border"
                        style={{ backgroundColor: tItem.previewBg }}
                      >
                        <span
                          className="size-4 rounded-full shadow-sm"
                          style={{ backgroundColor: tItem.previewPrimary }}
                        />
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: tItem.previewAccent }}
                        />
                      </div>
                      <p className="text-xs font-bold text-foreground">{t(tItem.nameKey)}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {tItem.description}
                      </p>
                      {isSelected && (
                        <span className="absolute top-2 right-2 size-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                          <Check className="size-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI NLU & TTS TAB */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              {/* NLU Description */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <BrainCircuit className="size-4" />
                  <span>{t("settings.nlu_title")}</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {t("settings.nlu_desc")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-card border rounded-xl p-2.5 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-foreground mb-1">
                      <MountainSnow className="size-3.5 text-blue-500" />
                      Quechua / Aymara
                    </span>
                    <span className="text-muted-foreground">Entiende términos andinos como sangrecita, bazo, api y signos de alarma.</span>
                  </div>
                  <div className="bg-card border rounded-xl p-2.5 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-foreground mb-1">
                      <AlertTriangle className="size-3.5 text-red-500" />
                      Triaje Clínico
                    </span>
                    <span className="text-muted-foreground">Detecta urgencias (fiebre, deshidratación) y recomienda atención médica.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY TAB */}
          {activeTab === "a11y" && (
            <div className="space-y-4">
              {/* Text Scaling */}
              <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <ZoomIn className="size-4 text-primary" />
                  <span>Tamaño de la Interfaz</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aumenta el tamaño de las letras y botones de toda la aplicación para facilitar la lectura.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "normal", label: "Normal", scale: "100%" },
                    { id: "large", label: "Grande", scale: "115%" },
                    { id: "xlarge", label: "Muy Grande", scale: "130%" },
                  ].map((option) => {
                    const isSelected = textScale === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setTextScale(option.id as any)}
                        className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm ring-1 ring-primary/50"
                            : "bg-card border-border hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span className="font-bold text-sm">{option.label}</span>
                        <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {option.scale}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TTS Voice Speaker Test */}
              <div className="bg-secondary/20 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Volume2 className="size-4 text-accent" />
                  <span>{t("settings.tts_title")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("settings.tts_desc")}
                </p>
                <button
                  onClick={handleTestTTS}
                  disabled={isTestingTTS}
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Volume2 className={`size-4 ${isTestingTTS ? "animate-pulse text-accent" : ""}`} />
                  <span>{isTestingTTS ? "Reproduciendo audio..." : "Probar Síntesis de Voz"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/10 border-t border-border/50 px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-sm">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3 text-primary" /> Yanapiri Multilingüe v1.2
          </span>
          <button
            onClick={onClose}
            className="btn-gradient text-primary-foreground font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm cursor-pointer"
          >
            {t("settings.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
