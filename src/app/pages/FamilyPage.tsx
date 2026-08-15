import { useState, useEffect } from "react";
import {
  Baby,
  Scale,
  Ruler,
  Activity,
  Home,
  MessageSquare,
  Calendar,
  RefreshCw,
  LogOut,
  X,
  WifiOff,
  Settings,
  Plus,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Hand,
  ChevronRight,
  QrCode,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Pill,
  Camera,
  Eye,
  Cpu,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { MeasurementWizard } from "../components/family/MeasurementWizard";
import { NutritionChatbot } from "../components/family/NutritionChatbot";
import { NutritionalTrivia } from "../components/family/NutritionalTrivia";
import { NutritionalDictionary } from "../components/family/NutritionalDictionary";
import { DailyTrackingModal } from "../components/family/DailyTrackingModal";
import { AlarmSignsModal } from "../components/family/AlarmSignsModal";
import { AddChildModal } from "../components/family/AddChildModal";
import { PlateScannerModal } from "../components/family/PlateScannerModal";
import { LockKeyGameModal } from "../components/family/LockKeyGameModal";
import { CostEffectivenessSimulator } from "../components/family/CostEffectivenessSimulator";
import { PublicHealthNews } from "../components/shared/PublicHealthNews";
import { AlertBadge } from "../components/shared/AlertBadge";
import { GrowthChart } from "../components/shared/GrowthChart";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
import { QRScannerModal } from "../components/shared/QRScannerModal";
import { ParentEngagementHub } from "../components/family/ParentEngagementHub";
import confetti from "canvas-confetti";
import { ALERT_CFG } from "../lib/constants";
import { getWHORef } from "../lib/who-refs";
import { postMeasurement, fetchAlerts } from "../lib/api";
import type {
  MeasureType,
  MeasurementResult,
  Child,
  GrowthPoint,
} from "../lib/types";

type FamilyTab = "home" | "history" | "help" | "play";

export default function FamilyPage() {
  const { user, logout } = useAuth();
  const {
    children,
    measurements,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    addMeasurementOffline,
    refreshData,
    isLoading,
    registerNewChild,
    addDailyTracking,
    dailyTracking,
  } = useData();
  const { t, languageInfo } = useTranslation();

  const [activeTab, setActiveTab] = useState<FamilyTab>("home");
  const [wizardType, setWizardType] = useState<MeasureType | null>(null);
  const [chartData, setChartData] = useState<GrowthPoint[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isPlateScannerOpen, setIsPlateScannerOpen] = useState(false);
  const [isLockGameOpen, setIsLockGameOpen] = useState(false);
  const [isNutritionChatbotOpen, setIsNutritionChatbotOpen] = useState(false);
  const [isDailyTrackingOpen, setIsDailyTrackingOpen] = useState(false);
  const [isAlarmSignsOpen, setIsAlarmSignsOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string | null>(null);


  // The family-view child is always the caregiver's assigned child
  const child: Child | undefined =
    (selectedChildId ? children.find((c) => c.id === selectedChildId) : null) ??
    children.find((c) => c.status !== "normal") ??
    children[0];

  const cfg = child ? ALERT_CFG[child.status] : null;
  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Build growth chart from measurements
  useEffect(() => {
    if (!child) return;
    const childMeasurements = measurements.filter(
      (m) => m.child_id === parseInt(child.id),
    );
    const weightMeasures = childMeasurements.filter((m) => m.type === "weight");
    const mapped = weightMeasures.slice(-6).map((m) => {
      const date = new Date(m.measurement_date);
      const label = date.toLocaleDateString("es-PE", {
        month: "short",
        day: "numeric",
      });
      const [median, sd] = getWHORef(child.ageMonths, child.sex);
      return {
        label,
        value: m.value,
        p3: median - 1.88 * sd,
        band: 3.76 * sd,
        p50: median,
      };
    });
    setChartData(mapped);
  }, [measurements, child]);

  const handleAddMeasurement = async (
    type: MeasureType,
    val: number,
  ): Promise<MeasurementResult> => {
    if (!child) throw new Error("No child selected");
    const childId = parseInt(child.id);

    if (!isOnline) {
      addMeasurementOffline({
        childId,
        child_id: childId,
        type,
        value: val,
        unit: type === "weight" ? "kg" : "cm",
        method: "self",
        measurement_date: new Date().toISOString(),
        sync_status: "pending",
      });

      let level: MeasurementResult["level"] = "normal";
      let message =
        "La medida fue guardada en el dispositivo y se enviará cuando tengas conexión.";

      if (type === "weight") {
        const [median, sd] = getWHORef(child.ageMonths, child.sex);
        const z = (val - median) / sd;
        if (z < -3) {
          level = "urgent";
          message =
            "Riesgo de desviación de peso crítica (Z-score < -3). Se sincronizará automáticamente.";
        } else if (z < -2) {
          level = "follow-up";
          message =
            "Riesgo de desviación de peso moderada (Z-score < -2). Se registrará para visita domiciliaria.";
        }
      } else if (type === "muac" && val < 11.5) {
        level = "urgent";
        message =
          "Perímetro braquial (MUAC) por debajo de 11.5 cm indica riesgo de desnutrición aguda severa.";
      }

      return { success: true, level, message };
    }

    try {
      const saved = await postMeasurement(childId, {
        type,
        value: val,
        unit: type === "weight" ? "kg" : "cm",
        method: "self",
      });

      await refreshData();

      let level: MeasurementResult["level"] = "normal";
      let message = "Medición registrada en base de datos central.";

      try {
        const alerts = await fetchAlerts(childId);
        const latestAlert = alerts[alerts.length - 1];
        if (latestAlert && latestAlert.measurement_id === saved.id) {
          level = latestAlert.level;
          message = latestAlert.comments;
        }
      } catch {
        /* ignore */
      }

      // UX: Gamificación Sensorial (Confeti) si el bebé está sano
      if (level === "normal") {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
          zIndex: 100,
        });
      }

      return { success: true, level, message };
    } catch {
      addMeasurementOffline({
        childId,
        child_id: childId,
        type,
        value: val,
        unit: type === "weight" ? "kg" : "cm",
        method: "self",
        measurement_date: new Date().toISOString(),
        sync_status: "pending",
      });
      return {
        success: true,
        level: "normal",
        message: "Guardado en cola local (Error de conexión).",
      };
    }
  };

  const offlineCount = offlineQueue.length;

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PlateScannerModal
        isOpen={isPlateScannerOpen}
        onClose={() => setIsPlateScannerOpen(false)}
      />

      <LockKeyGameModal
        isOpen={isLockGameOpen}
        onClose={() => setIsLockGameOpen(false)}
      />

      <NutritionChatbot
        isOpen={isNutritionChatbotOpen}
        onClose={() => {
          setIsNutritionChatbotOpen(false);
          setAssistantContext(null);
        }}
        initialContext={assistantContext}
      />

      <DailyTrackingModal
        isOpen={isDailyTrackingOpen}
        onClose={() => setIsDailyTrackingOpen(false)}
        onSubmit={(record) => {
          setIsDailyTrackingOpen(false);
          addDailyTracking({ ...record, child_id: child ? parseInt(child.id) : 0, date: new Date().toISOString() });
          alert("Seguimiento de suplemento registrado con éxito.");
        }}
      />

      <AlarmSignsModal
        isOpen={isAlarmSignsOpen}
        onClose={() => setIsAlarmSignsOpen(false)}
        onSubmit={(record) => {
          setIsAlarmSignsOpen(false);
          addDailyTracking({ ...record, child_id: child ? parseInt(child.id) : 0, date: new Date().toISOString() });
          if (record.has_alarms) {
            alert("ALERTA CRÍTICA: Se han detectado signos de alarma. Por favor, acuda al establecimiento de salud más cercano INMEDIATAMENTE.");
          }
        }}
      />

      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={(scanned) => {
          alert(`Carnet CRED detectado con éxito:\nNiño: ${scanned.childName}\nCódigo: ${scanned.credCode}`);
        }}
      />

      {isAddChildOpen && (
        <AddChildModal
          onClose={() => setIsAddChildOpen(false)}
          onSubmit={async (data) => {
            await registerNewChild(data);
          }}
        />
      )}

      {wizardType && child && (
        <MeasurementWizard
          type={wizardType}
          child={child}
          onClose={() => setWizardType(null)}
          onSubmit={(val) => handleAddMeasurement(wizardType, val)}
        />
      )}

      <div className="min-h-screen bg-gradient-flow relative flex flex-col">
        {/* Animated background blobs (hidden from scrolling) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        {/* PWA Main Container */}
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative z-10 animate-in fade-in duration-500 bg-background/40 dark:bg-background/20 backdrop-blur-3xl shadow-2xl xl:border-x border-white/10">
          {/* App Header */}
          <div className="px-5 pt-6 pb-3 flex items-center justify-between bg-card/95 backdrop-blur-xl border-b border-border shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Baby className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider leading-none">
                  NutriCRED
                </p>
                <p className="text-sm font-bold text-foreground leading-tight font-nunito">
                  {t("app.caregiver")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 flex items-center justify-center transition-all cursor-pointer"
                title="Búsqueda Rápida por Código QR"

              >

                <QrCode className="size-4" />
              </button>

              <HeaderActions
                onSettings={() => setIsSettingsOpen(true)}
                onRefresh={refreshData}
                isRefreshing={isLoading}
                onLogout={logout}
                hasOfflineData={offlineCount > 0}
                isOnline={isOnline}
              />
            </div>
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-20 space-y-4">
            {activeTab === "home" && (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-1">
                    <Calendar className="size-3.5" />
                    <span className="capitalize">{today}</span>
                  </div>
                  <h1 className="text-3xl font-black text-foreground font-nunito tracking-tight flex items-center gap-3">
                    {t("family.greeting", {
                      name: child?.caregiver
                        ? child.caregiver.split(" ")[0]
                        : (user?.username ?? ""),
                    })}
                    <Hand className="size-8 text-amber-500 animate-in fade-in zoom-in duration-500" />
                  </h1>
                </div>

                {/* Child Selector (only if multiple or adding) */}
                {children.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                    {children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChildId(c.id)}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                          child?.id === c.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-card/60 hover:bg-muted/80 backdrop-blur-md"
                        }`}
                      >
                        <div
                          className={`size-9 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-sm ${
                            child?.id === c.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.name?.charAt(0) ?? "?"}
                        </div>
                        <div className="text-left">
                          <p
                            className={`text-sm font-bold leading-tight ${child?.id === c.id ? "text-primary font-nunito" : "text-foreground"}`}
                          >
                            {c.shortName}
                          </p>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {c.age}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setIsAddChildOpen(true)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border-2 border-dashed border-primary/70 bg-card hover:bg-muted/40 transition-all shrink-0 cursor-pointer text-foreground shadow-sm"
                    >
                      <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                        <Plus className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black leading-tight font-nunito text-foreground">
                          Añadir
                        </p>
                        <p className="text-xs text-foreground/80 font-extrabold">
                          Nuevo Bebé
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!child ? (
                  <div className="bg-card/60 backdrop-blur-md border border-border rounded-3xl p-8 text-center space-y-4 shadow-sm mt-8">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <Baby className="size-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground font-nunito">
                        Bienvenida a NutriCRED
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Para comenzar a monitorear el crecimiento y recibir
                        orientación, registra a tu primer hijo/a.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddChildOpen(true)}
                      className="btn-gradient w-full py-3.5 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="size-5" /> Registrar a mi bebé
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mt-2">
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* Daily Tracking Card */}
                        {(() => {
                          const today = new Date().toDateString();
                          // Filter for supplement tracking today (not alarm reports)
                          const todayRecord = dailyTracking.find(r => r.child_id === (child ? parseInt(child.id) : -1) && new Date(r.date).toDateString() === today && !r.has_alarms);
                          const isCompleted = !!todayRecord;
                          return (
                            <div className={`border p-5 rounded-[2rem] shadow-sm flex items-center justify-between transition-all duration-500 ${
                              isCompleted 
                                ? "bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border-emerald-500/30" 
                                : "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
                            }`}>
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl shadow-inner text-white ${
                                  isCompleted ? "bg-emerald-500" : "bg-primary"
                                }`}>
                                  {isCompleted ? <CheckCircle2 className="size-6" /> : <Calendar className="size-6" />}
                                </div>
                                <div>
                                  <h3 className="font-black text-foreground text-lg tracking-tight">
                                    {isCompleted ? "✅ Suplemento Registrado" : "Control de Suplemento"}
                                  </h3>
                                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                                    {isCompleted 
                                      ? `Suplemento: ${todayRecord.supplement_taken ? todayRecord.supplement_type : "No tomó"}`
                                      : "Registrar si tu niño tomó su suplemento hoy"
                                    }
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setIsDailyTrackingOpen(true)}
                                className={`font-bold py-2.5 px-5 rounded-xl text-sm shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                                  isCompleted
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                    : "btn-gradient text-white"
                                }`}
                              >
                                {isCompleted ? "Actualizar" : "Completar Seguimiento"}
                              </button>
                            </div>
                          );
                        })()}

                      {/* CREDENCIAL VIRTUAL DEL APODERADO */}
                      <div className="rounded-[2.5rem] border-2 border-primary/30 p-6 space-y-5 shadow-xl relative overflow-hidden bg-card/95 backdrop-blur-xl">
                        
                        {/* Header Banner */}
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                              Credencial Virtual de Salud
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold">
                              Solo Lectura
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-muted-foreground">
                            DNI: {child.dni ? `${child.dni.slice(0, 4)}****` : "----****"}
                          </span>
                        </div>

                        {/* Child Summary */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="size-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-primary/20">
                              {child.name?.charAt(0) ?? "?"}
                            </div>
                            <div>
                              <h3 className="font-black text-foreground text-xl font-nunito leading-tight">
                                {child.name}
                              </h3>
                              <p className="text-xs text-muted-foreground font-bold mt-0.5">
                                {child.age} · {child.sex === "M" ? "Masculino" : "Femenino"}
                              </p>
                            </div>
                          </div>
                          <AlertBadge level={child.status} size="md" />
                        </div>

                        {/* Campaña Activa & Vigencia */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                              <Apple className="size-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider block">Campaña Activa</span>
                              <p className="text-xs font-black text-foreground font-nunito">
                                {child.campaign || "Campaña Hierro"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
                            Vigente hasta: {child.campaignExpiry || "31/12/2026"}
                          </span>
                        </div>

                        {/* Evolución de Peso & Tendencia */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-card p-3 rounded-2xl border border-border">
                            <span className="text-[9px] font-black text-muted-foreground uppercase block">Último Peso</span>
                            <span className="font-mono text-sm font-black text-foreground block mt-0.5">
                              {child.weight > 0 ? `${child.weight} kg` : "--"}
                            </span>
                          </div>
                          <div className="bg-card p-3 rounded-2xl border border-border">
                            <span className="text-[9px] font-black text-muted-foreground uppercase block">Última Talla</span>
                            <span className="font-mono text-sm font-black text-foreground block mt-0.5">
                              {child.height > 0 ? `${child.height} cm` : "--"}
                            </span>
                          </div>
                          <div className="bg-card p-3 rounded-2xl border border-border">
                            <span className="text-[9px] font-black text-muted-foreground uppercase block">Tendencia</span>
                            <span className={`font-extrabold text-xs block mt-0.5 ${
                              child.weightTrend === "down" 
                                ? "text-rose-600" 
                                : child.weightTrend === "up" 
                                  ? "text-emerald-600" 
                                  : "text-amber-600"
                            }`}>
                              {child.weightTrend === "down" ? "↓ Bajando" : child.weightTrend === "up" ? "↑ Subiendo" : "→ Estable"}
                            </span>
                          </div>
                        </div>

                        {/* Diagnóstico Actual del Médico */}
                        <div className="bg-card p-4 rounded-2xl border border-border space-y-1 text-xs">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                            Diagnóstico del Médico (Texto Libre)
                          </span>
                          <p className="font-medium text-foreground italic leading-relaxed">
                            "{child.doctorDiagnosis || "Diagnóstico registrado en consulta presencial."}"
                          </p>
                        </div>

                        {/* Alerta Semáforo & Acción Sugerida */}
                        <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start ${
                          child.status === "urgent"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                            : child.status === "follow-up"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                        }`}>
                          <div className="p-2 bg-card rounded-xl shrink-0 border border-border shadow-xs">
                            {child.status === "urgent" ? (
                              <ShieldAlert className="size-5 text-rose-600" />
                            ) : child.status === "follow-up" ? (
                              <AlertTriangle className="size-5 text-amber-600" />
                            ) : (
                              <ShieldCheck className="size-5 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-xs uppercase tracking-wide">
                              Alerta Activa: {child.status === "urgent" ? "🔴 URGENTE" : child.status === "follow-up" ? "🟡 VIGILANCIA" : "🟢 NORMAL"}
                            </p>
                            <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                              {child.status === "urgent"
                                ? "Acudir a emergencia o centro de salud en las próximas 24 horas. No esperar cita programada."
                                : child.status === "follow-up"
                                  ? "Acudir a control en los próximos 7 días. No suspender la alimentación."
                                  : "Evolución favorable. Continuar con el plan de alimentación y acudir en la fecha programada."}
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground text-center font-bold">
                          📌 Nota: Documento de consulta exclusivo del apoderado. El médico es el único facultado para actualizar los datos.
                        </p>
                      </div>

                    {/* Quick actions */}
                    <div className="space-y-3 mt-2">
                      <p className="text-xs font-black text-foreground uppercase tracking-wider pl-1">
                        {t("family.quick_actions")}
                      </p>
                      <div className="flex flex-col gap-3">
                        
                        {/* Botones de Mediciones Antropométricas */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4.5 mb-2">
                          <p className="text-xs text-primary font-bold leading-normal">
                            📌 <strong>Control Oficial CRED:</strong> Las mediciones de Peso y Talla son registradas y validadas exclusivamente por el personal médico durante su consulta para evitar datos inexactos.
                          </p>
                        </div>
                        {[
                          {
                            id: "muac" as MeasureType,
                            label: t("family.muac"),
                            desc: "Medir el bracito de mi wawa en casa (MUAC)",
                            icon: Activity,
                            iconBg: "bg-rose-600 text-white",
                            action: () => setWizardType("muac"),
                          },
                        ].map((act) => (
                          <button
                            key={act.id}
                            onClick={act.action}
                            className="group relative overflow-hidden bg-card hover:bg-muted/40 border border-border p-3.5 sm:p-4 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                            
                            <div
                              className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md shrink-0 ${act.iconBg} group-hover:scale-110 transition-transform duration-300 relative z-10`}
                            >
                              <act.icon className="size-5 sm:size-6 drop-shadow-sm shrink-0" />
                            </div>
                            <div className="text-left flex-1 min-w-0 relative z-10">
                              <span className="text-base sm:text-lg font-black text-foreground block font-nunito tracking-tight leading-snug">
                                {act.label}
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-foreground/90 block mt-0.5 leading-snug">
                                {act.desc}
                              </span>
                            </div>
                            <div className="bg-primary/10 text-primary p-2 sm:p-2.5 rounded-full relative z-10 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors transform group-hover:translate-x-1 duration-300 shadow-sm border border-primary/20">
                              <ChevronRight className="size-4 sm:size-5 shrink-0" />
                            </div>
                          </button>
                        ))}

                        {/* 🚨 PRIORITY 1: Botón S.O.S de Emergencia y Signos de Alarma */}
                        <button
                          onClick={() => {
                            setAssistantContext("S.O.S. Mi niño presenta signos de alarma (fiebre, vómitos, decaimiento). Necesito ayuda clínica urgente.");
                            setIsAlarmSignsOpen(true);
                          }}
                          className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-700 text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 transition-all duration-300 shadow-xl ring-2 ring-red-400 active:scale-[0.98] cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                          
                          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md shrink-0 bg-white text-red-600 group-hover:scale-110 transition-transform duration-300 relative z-10 animate-bounce">
                            <AlertTriangle className="size-5 sm:size-6 drop-shadow-sm shrink-0" />
                          </div>
                          <div className="text-left flex-1 min-w-0 relative z-10">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-base sm:text-lg font-black text-white font-nunito tracking-tight leading-snug">
                                Reportar Emergencia S.O.S
                              </span>
                              <span className="bg-white text-red-700 text-[10px] sm:text-[11px] font-black uppercase px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs shrink-0 flex items-center gap-1">
                                <ShieldAlert className="size-3 text-red-700 shrink-0" />
                                Alta Prioridad
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-red-100 block mt-0.5 leading-snug">
                              Signos de alarma clínica (Fiebre, desmayo, vómitos)
                            </span>
                          </div>
                          <div className="bg-white/30 text-white p-2 sm:p-2.5 rounded-full relative z-10 shrink-0 group-hover:bg-white group-hover:text-red-600 transition-colors transform group-hover:translate-x-1 duration-300 shadow-md">
                            <ChevronRight className="size-4 sm:size-5 shrink-0" />
                          </div>
                        </button>

                        {/* Botón 2: Evidencia Fotográfica de Suplemento */}
                        <button
                          onClick={() => setIsDailyTrackingOpen(true)}
                          className="group relative overflow-hidden bg-card hover:bg-muted/40 border-2 border-primary/60 p-3.5 sm:p-4 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                          
                          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md shrink-0 bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300 relative z-10">
                            <Pill className="size-5 sm:size-6 drop-shadow-sm shrink-0" />
                          </div>
                          <div className="text-left flex-1 min-w-0 relative z-10">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-base sm:text-lg font-black text-foreground font-nunito tracking-tight leading-snug">
                                Suplemento y Fotos de Evidencia
                              </span>
                              <span className="bg-emerald-600 text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider shrink-0 flex items-center gap-1">
                                <Camera className="size-3 text-white shrink-0" />
                                Cámara
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-foreground/90 block mt-0.5 leading-snug">
                              Registro diario de hierro y foto del frasco
                            </span>
                          </div>
                          <div className="bg-primary/10 text-primary p-2 sm:p-2.5 rounded-full relative z-10 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors transform group-hover:translate-x-1 duration-300 shadow-sm border border-primary/20">
                            <ChevronRight className="size-4 sm:size-5 shrink-0" />
                          </div>
                        </button>

                        {/* Botón 3: Semáforo del Plato AR 2D */}
                        <button
                          onClick={() => setIsPlateScannerOpen(true)}
                          className="group relative overflow-hidden bg-card hover:bg-muted/40 border-2 border-amber-500/60 p-3.5 sm:p-4 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                          
                          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md shrink-0 bg-amber-500 text-slate-950 group-hover:scale-110 transition-transform duration-300 relative z-10">
                            <Sparkles className="size-5 sm:size-6 drop-shadow-sm shrink-0" />
                          </div>
                          <div className="text-left flex-1 min-w-0 relative z-10">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-base sm:text-lg font-black text-foreground font-nunito tracking-tight leading-snug">
                                Semáforo del Plato AR 2D
                              </span>
                              <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider shrink-0 flex items-center gap-1">
                                <Sparkles className="size-3 text-slate-950 shrink-0" />
                                Visión AI
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-foreground/90 block mt-0.5 leading-snug">
                              Escanear plato para detectar sangrecita y citricos
                            </span>
                          </div>
                          <div className="bg-amber-500/10 text-amber-600 p-2 sm:p-2.5 rounded-full relative z-10 shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors transform group-hover:translate-x-1 duration-300 shadow-sm border border-amber-500/20">
                            <ChevronRight className="size-4 sm:size-5 shrink-0" />
                          </div>
                        </button>

                      </div>
                    </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      {/* Growth chart */}
                    <div className="bg-card/60 backdrop-blur-md border border-border rounded-3xl p-4 space-y-2 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {t("family.growth_evolution")}
                        </p>
                        <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                          {t("family.who_reference")}
                        </span>
                      </div>
                      <div className="pt-2 min-w-0">
                        <GrowthChart data={chartData} height={130} />
                      </div>
                    </div>

                    {/* Pediatra / Control Oficial de Salud */}
                    {child && measurements.filter(m => m.child_id === parseInt(child.id) && m.operator === "professional").length > 0 && (
                      <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-5 space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                          <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">
                            Control Oficial de Salud CRED (Validado)
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                          Su pediatra ha registrado y verificado el estado clínico de su wawa. Asegúrese de cumplir las siguientes recomendaciones:
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                          <div className="bg-card p-3 rounded-2xl border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Último Peso Registrado</span>
                            <span className="font-mono text-sm font-black text-foreground">
                              {measurements.filter(m => m.child_id === parseInt(child.id) && m.type === "weight" && m.operator === "professional").slice(-1)[0]?.value ?? child.weight} kg
                            </span>
                          </div>
                          <div className="bg-card p-3 rounded-2xl border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Hemoglobina Oficial</span>
                            <span className="font-mono text-sm font-black text-foreground">
                              {measurements.filter(m => m.child_id === parseInt(child.id) && m.type === "hemoglobin").slice(-1)[0]?.value ?? "No registrado"} g/dL
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-card rounded-2xl border border-border text-xs text-muted-foreground leading-relaxed font-bold">
                          <strong>Indicación Médica:</strong> {child.status === "urgent" || child.status === "follow-up" 
                            ? "Administrar suplemento de hierro diario (SRSI) y acudir a control en 30 días sin falta." 
                            : "Mantener lactancia materna complementaria y control CRED programado."}
                        </div>
                      </div>
                    )}

                    {/* Next CRED visit */}
                    <div className="relative overflow-hidden flex items-center gap-4 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-3xl p-5 shadow-sm mt-2">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="size-12 bg-white dark:bg-black/40 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
                        <Calendar className="size-6 text-primary" />
                      </div>
                      <div className="relative z-10 flex-1">
                        <p className="text-sm font-black text-foreground tracking-tight">
                          {t("family.next_cred")}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {t("family.cred_desc")}
                        </p>
                      </div>
                    </div>

                    {/* Medical Disclaimer */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-amber-500/10 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl p-4 mt-4 flex items-start gap-3 shadow-md backdrop-blur-md">
                      <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 shadow-sm">
                        <ShieldAlert className="size-4" />
                      </div>
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        <strong className="font-extrabold text-blue-700 dark:text-blue-300">Importante:</strong>{" "}
                        NutriCRED es una herramienta complementaria de prevención. Los estados nutricionales mostrados no reemplazan el diagnóstico clínico presencial de su Centro de Salud.
                      </p>
                    </div>
                    </div>
                  </div>
                )}

                {/* Hub de Crecimiento, Logros, Galeria & Percentiles */}
                {child && (
                  <div className="mt-6">
                    <ParentEngagementHub child={child} growthData={chartData} />
                  </div>
                )}

                <div className="mt-6">
                  <PublicHealthNews />
                </div>
              </>
            )}

            {activeTab === "history" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="size-11 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg text-white">
                    <Activity className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground font-nunito tracking-tight">
                      {t("family.history_title")}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">Diario clínico y registro de evaluaciones</p>
                  </div>
                </div>
                <div className="relative pl-6">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />

                  <div className="space-y-4">
                    {child &&
                    measurements.filter(
                      (m) => m.child_id === parseInt(child.id),
                    ).length > 0 ? (
                      measurements
                        .filter((m) => m.child_id === parseInt(child.id))
                        .slice()
                        .reverse()
                        .map((m, idx) => {
                          const date = new Date(
                            m.measurement_date,
                          ).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const iconMap = {
                            weight: Scale,
                            height: Ruler,
                            muac: Activity,
                          };
                          const Icon = iconMap[m.type as MeasureType] ?? Scale;
                          const isSynced = m.sync_status === "synced";

                          return (
                            <div
                              key={idx}
                              className="relative group bg-card hover:bg-card/90 border border-border hover:border-primary/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md ml-4"
                            >
                              {/* Timeline Node */}
                              <div className="absolute -left-8 top-1/2 -translate-y-1/2 size-8 bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-md z-10 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                                <Icon className="size-3.5 text-primary group-hover:text-primary-foreground" />
                              </div>

                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-sm font-black text-foreground capitalize tracking-tight">
                                    {m.type === "weight"
                                      ? "Pesar a mi bebé"
                                      : m.type === "height"
                                        ? "Medir su Alturita"
                                        : "Medir su Bracito (MUAC)"}
                                  </p>
                                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                                    {date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1.5">
                                <p className="text-lg font-mono font-black text-foreground">
                                  {m.value}{" "}
                                  <span className="text-xs text-muted-foreground font-bold">
                                    {m.unit}
                                  </span>
                                </p>
                                <span
                                  className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                    isSynced
                                      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/30"
                                      : "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/30"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${isSynced ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
                                  />
                                  {isSynced
                                    ? t("family.synced")
                                    : t("family.pending_sync")}
                                </span>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="bg-card/40 border border-border border-dashed rounded-2xl p-8 text-center ml-4 mt-4">
                        <Activity className="size-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-bold text-muted-foreground">
                          No hay registros todavía
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Realiza tu primera medición usando las acciones
                          rápidas del inicio.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SRSI Tracking History */}
                {child && dailyTracking.filter(r => r.child_id === parseInt(child.id)).length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg text-white">
                        <Pill className="size-5" />
                      </div>
                      <h2 className="text-xl font-black text-foreground font-nunito tracking-tight">
                        Historial de Suplementación
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {dailyTracking
                        .filter(r => r.child_id === parseInt(child.id))
                        .map((record, idx) => {
                          const date = new Date(record.date).toLocaleDateString("es-PE", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                          });
                          const isAlarmReport = record.has_alarms;
                          return (
                            <div key={idx} className={`bg-card/60 backdrop-blur-md border rounded-2xl p-4 flex items-center justify-between transition-all ${
                              isAlarmReport ? "border-rose-500/40 bg-rose-500/5 shadow-xs shadow-rose-500/5" : "border-border"
                            }`}>
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                                  isAlarmReport 
                                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                    : record.supplement_taken 
                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" 
                                      : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                }`}>
                                  {isAlarmReport ? <AlertTriangle className="size-5" /> : <Pill className="size-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-black text-foreground truncate">
                                    {isAlarmReport 
                                      ? "Reporte Clínico de Alarma" 
                                      : record.supplement_taken 
                                        ? record.supplement_type 
                                        : "No tomó suplemento"}
                                  </p>
                                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{date}</p>
                                  {isAlarmReport && record.alarm_signs && record.alarm_signs.length > 0 && (
                                    <p className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold mt-1 leading-relaxed bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                                      Signos: {record.alarm_signs.join(", ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1 shrink-0 ml-2">
                                {isAlarmReport ? (
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-rose-500/20 text-rose-900 dark:text-rose-100 border-rose-500/40">
                                    ⚠️ Emergencia
                                  </span>
                                ) : (
                                  <>
                                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                      record.supplement_taken
                                        ? "bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 border-emerald-500/40"
                                        : "bg-rose-500/20 text-rose-900 dark:text-rose-100 border-rose-500/40"
                                    }`}>
                                      {record.supplement_taken ? "Tomó" : "Faltó"}
                                    </span>
                                    <span className="text-[11px] font-semibold text-foreground/80 dark:text-foreground/90">
                                      Olvido: {record.forgets_frequency}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "help" && (
              <div className="space-y-4 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg text-white">
                    <HeartPulse className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground font-nunito tracking-tight">
                      {t("family.guidelines_title")}
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                      {t("family.guidelines_subtitle")}
                    </p>
                  </div>
                </div>


                {/* 💰 SIMULADOR DE COSTO-EFECTIVIDAD & TICKET DE COMPRA REGIONAL */}
                <CostEffectivenessSimulator onRequestAssistant={(ctx) => {
                  setAssistantContext(ctx);
                  setIsNutritionChatbotOpen(true);
                }} />

              </div>
            )}
            {activeTab === "play" && (
              <div className="space-y-4 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg text-white">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground font-nunito tracking-tight">
                      Jugar y Aprender
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                      Gana Puntos Yanapiri respondiendo trivias.
                    </p>
                  </div>
                </div>
                
                {/* 1. Trivia de Nutrición */}
                <NutritionalTrivia />

                <div className="h-px w-full bg-border my-6"></div>

                {/* 2. Diccionario de Alimentos (Pokédex Nutricional) */}
                <NutritionalDictionary />
              </div>
            )}
          </div>

          {/* Bottom tab bar */}
          <div className="border-t border-border mt-auto bg-card/90 backdrop-blur-md sticky bottom-0 z-20 pb-safe">
            <div className="grid grid-cols-4 max-w-lg mx-auto">
              {[
                { id: "home" as FamilyTab, Icon: Home, labelKey: "nav.home" },
                {
                  id: "history" as FamilyTab,
                  Icon: Activity,
                  labelKey: "nav.history",
                },
                {
                  id: "play" as FamilyTab,
                  Icon: Sparkles,
                  labelKey: "Jugar", // Hardcoded fallback if translation misses
                },
                {
                  id: "help" as FamilyTab,
                  Icon: MessageSquare,
                  labelKey: "nav.nutrition",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "text-primary border-t-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.Icon className="size-5" />
                  {tab.labelKey === "Jugar" ? "Jugar" : t(tab.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* Plate Scanner Modal (Semáforo del Plato AR 2D) */}
      <PlateScannerModal
        isOpen={isPlateScannerOpen}
        onClose={() => setIsPlateScannerOpen(false)}
      />
    </>
  );
}
