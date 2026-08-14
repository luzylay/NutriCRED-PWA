import { useState, useEffect } from "react";
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
  Type,
  Activity,
  Star,
  Zap,
  Users,
  ChevronRight,
  HardDrive,
  Wifi,
  WifiOff,
  Database,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";
import { useA11y, type A11yState } from "../../contexts/A11yContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useData } from "../../contexts/DataContext";
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
  const { a11y, setA11y } = useA11y();
  const { isOnline, offlineQueue, syncOfflineQueue } = useData();
  const [activeTab, setActiveTab] = useState<
    "language" | "theme" | "a11y" | "ai" | "offline"
  >("language");
  const [isTestingTTS, setIsTestingTTS] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageStats, setStorageStats] = useState<{ usedMB: string; quotaMB: string }>({
    usedMB: "1.2",
    quotaMB: "50",
  });

  useEffect(() => {
    if ("storage" in navigator && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const used = ((est.usage || 1200000) / (1024 * 1024)).toFixed(1);
        const quota = ((est.quota || 52428800) / (1024 * 1024 * 1024)).toFixed(1) + " GB";
        setStorageStats({ usedMB: used, quotaMB: quota });
      }).catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncOfflineQueue();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleTestTTS = () => {
    setIsTestingTTS(true);
    let sampleText =
      "¡Hola! Yanapiri Wawa te ayuda a cuidar el crecimiento de tu bebé.";
    if (language === "qu") {
      sampleText =
        "Allillanchu! Yanapiri Wawa wawaykipa sumaq wiñayninta qhawan.";
    } else if (language === "ay") {
      sampleText = "Kamisaki! Yanapiri Wawa wawanakan suma jilawip sum uñji.";
    } else if (language === "en") {
      sampleText =
        "Hello! Yanapiri Wawa helps you monitor your child's healthy growth.";
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
              <h2
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {t("settings.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                Personalización, Datos y Conexión
              </p>
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
        <div className="flex border-b border-border/50 bg-muted/20 px-2 pt-2 overflow-x-auto">
          {[
            { id: "language" as const, label: "Idioma", icon: Globe },
            { id: "theme" as const, label: "Tema", icon: Palette },
            { id: "a11y" as const, label: "Accesibilidad", icon: Eye },
            { id: "ai" as const, label: "IA", icon: BrainCircuit },
            { id: "offline" as const, label: "Offline", icon: HardDrive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold border-b-2 transition-all duration-300 ${
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
                        <div
                          className={`size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          {lang.abbrev}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {lang.nativeName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lang.region}
                          </p>
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
                      <p className="text-xs font-bold text-foreground">
                        {t(tItem.nameKey)}
                      </p>
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
                    <span className="text-muted-foreground">
                      Entiende términos andinos como sangrecita, bazo, api y
                      signos de alarma.
                    </span>
                  </div>
                  <div className="bg-card border rounded-xl p-2.5 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-foreground mb-1">
                      <AlertTriangle className="size-3.5 text-red-500" />
                      Triaje Clínico
                    </span>
                    <span className="text-muted-foreground">
                      Detecta urgencias (fiebre, deshidratación) y recomienda
                      atención médica.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY TAB */}
          {activeTab === "a11y" && (
            <div className="space-y-4">
              {/* Accessibility Toggles */}
              <div className="bg-muted/10 border border-border rounded-2xl p-2 space-y-1">
                {[
                  { key: "highContrast" as keyof A11yState, label: "Alto contraste", desc: "WCAG AAA · Baja visión", icon: Eye },
                  { key: "largeText" as keyof A11yState, label: "Texto grande", desc: "Fuente 19px · Legibilidad", icon: Type },
                  { key: "dyslexia" as keyof A11yState, label: "Modo dislexia", desc: "Fuente Lexend + espaciado", icon: Activity, tag: "Lexend" },
                  { key: "colorBlind" as keyof A11yState, label: "Daltonismo", desc: "Filtro deuteranopía", icon: Star },
                  { key: "reducedMotion" as keyof A11yState, label: "Reducir movimiento", desc: "Sin animaciones", icon: Zap },
                  { key: "signLang" as keyof A11yState, label: "Intérprete LSP", desc: "Lengua de Señas Peruana", icon: Users, tag: "Beta" },
                  { key: "simpleMode" as keyof A11yState, label: "Lenguaje sencillo", desc: "Sin jerga médica", icon: Globe },
                  { key: "showQuechua" as keyof A11yState, label: "Etiquetas quechua", desc: "Español / Quechua", icon: Globe },
                  { key: "keyboardMode" as keyof A11yState, label: "Navegación teclado", desc: "Atajos visibles", icon: ChevronRight },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isActive = a11y[opt.key];
                  
                  return (
                    <div 
                      key={opt.key}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{opt.label}</span>
                            {opt.tag && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md">
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground block leading-tight">{opt.desc}</span>
                        </div>
                      </div>
                      
                      <button
                        role="switch"
                        aria-checked={isActive}
                        onClick={() => setA11y(opt.key, !isActive)}
                        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                          isActive ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Text Scaling */}
              <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <ZoomIn className="size-4 text-primary" />
                  <span>Tamaño de la Interfaz</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aumenta el tamaño de las letras y botones de toda la
                  aplicación para facilitar la lectura.
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
                        <span className="font-bold text-sm">
                          {option.label}
                        </span>
                        <span
                          className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                        >
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
                  <Volume2
                    className={`size-4 ${isTestingTTS ? "animate-pulse text-accent" : ""}`}
                  />
                  <span>
                    {isTestingTTS
                      ? "Reproduciendo audio..."
                      : "Probar Síntesis de Voz"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* OFFLINE & STORAGE TAB */}
          {activeTab === "offline" && (
            <div className="space-y-4">
              {/* Connection Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isOnline ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isOnline ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {isOnline ? <Wifi className="size-5" /> : <WifiOff className="size-5 animate-pulse" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{isOnline ? "Conexión Activa" : "Modo Sin Conexión"}</h4>
                    <p className="text-xs opacity-90">
                      {isOnline ? "Sincronización en tiempo real habilitada" : "Guardando cambios en cola local (IndexedDB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sync Queue Control */}
              <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                    <Database className="size-4 text-primary" />
                    <span>Cola de Sincronización</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    offlineQueue.length > 0 ? "bg-amber-500 text-white" : "bg-emerald-500/20 text-emerald-600"
                  }`}>
                    {offlineQueue.length} pendientes
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Los registros de peso, talla y fotos tomadas sin internet se acumulan en IndexedDB y se envían al servidor automáticamente.
                </p>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing || !isOnline || offlineQueue.length === 0}
                  className="w-full btn-gradient text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <RefreshCw className={`size-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Sincronizando..." : "Sincronizar Cola Ahora"}</span>
                </button>
              </div>

              {/* Storage Metrics */}
              <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <HardDrive className="size-4 text-primary" />
                  <span>Métricas de Almacenamiento</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-card border p-3 rounded-xl">
                    <span className="text-muted-foreground block text-[10px]">Uso Actual</span>
                    <span className="font-mono font-black text-sm text-primary">{storageStats.usedMB} MB</span>
                  </div>
                  <div className="bg-card border p-3 rounded-xl">
                    <span className="text-muted-foreground block text-[10px]">Cuota Disponible</span>
                    <span className="font-mono font-black text-sm text-foreground">{storageStats.quotaMB}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  💡 Fotos comprimidas automáticamente a 640px JPEG 72% (~40KB por foto).
                </p>
              </div>

              {/* Conflict Resolution & Offline Auth */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider">
                  <ShieldCheck className="size-4" />
                  <span>Garantías de Datos en Zonas Rurales</span>
                </div>
                <ul className="space-y-1.5 text-muted-foreground list-disc list-inside pt-1">
                  <li><strong className="text-foreground">Service Worker PWA:</strong> Carga la app sin internet.</li>
                  <li><strong className="text-foreground">Resolución de Conflictos:</strong> Política LWW con marcas de tiempo.</li>
                  <li><strong className="text-foreground">Autenticación Offline:</strong> Mantiene la sesión iniciada sin red.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/10 border-t border-border/50 px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-sm">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3 text-primary" /> Yanapiri Multilingüe
            v1.2
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
