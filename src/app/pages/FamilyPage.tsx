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
  WifiOff,
  Settings,
  Plus,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Hand,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { MeasurementWizard } from "../components/family/MeasurementWizard";
import { NutritionChatbot } from "../components/family/NutritionChatbot";
import { NutritionalTrivia } from "../components/family/NutritionalTrivia";
import { AddChildModal } from "../components/family/AddChildModal";
import { AlertBadge } from "../components/shared/AlertBadge";
import { GrowthChart } from "../components/shared/GrowthChart";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
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
  } = useData();
  const { t, languageInfo } = useTranslation();

  const [activeTab, setActiveTab] = useState<FamilyTab>("home");
  const [wizardType, setWizardType] = useState<MeasureType | null>(null);
  const [chartData, setChartData] = useState<GrowthPoint[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

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
                  Yanapiri Wawa
                </p>
                <p className="text-sm font-bold text-foreground leading-tight font-nunito">
                  {t("app.caregiver")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all shrink-0 cursor-pointer text-primary"
                    >
                      <div className="size-9 rounded-xl border border-dashed border-primary/50 flex items-center justify-center shadow-sm bg-white dark:bg-black/20">
                        <Plus className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold leading-tight font-nunito">
                          Añadir
                        </p>
                        <p className="text-xs opacity-80 font-semibold">
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
                        Bienvenida a Yanapiri Wawa
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
                      {/* Child status card */}
                    <div
                      className={`rounded-[2rem] border p-6 space-y-5 shadow-lg relative overflow-hidden transition-all duration-500 hover:shadow-xl ${cfg.bgClass} ${cfg.borderClass}`}
                    >
                      {/* Emotive Icon Background */}
                      <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none transform rotate-12 scale-110">
                        {child.status === "normal" ? (
                          <ShieldCheck className="size-48" />
                        ) : (
                          <ShieldAlert className="size-48" />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="size-14 bg-white/90 dark:bg-black/50 rounded-2xl flex items-center justify-center font-black text-foreground text-2xl shadow-md border border-white/20">
                            {child.name?.charAt(0) ?? "?"}
                          </div>
                          <div>
                            <p className="font-black text-foreground text-xl font-nunito leading-tight">
                              {child.shortName ?? "Bebé"}
                            </p>
                            <p className="text-[13px] text-muted-foreground font-bold mt-1 tracking-tight">
                              {child.age} · {child.weight} kg · {child.height}{" "}
                              cm
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-4 flex gap-3.5 items-start relative z-10 shadow-sm border border-white/30">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 shadow-inner ${child.status === "normal" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : child.status === "follow-up" ? "bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-red-500/20 text-red-700 dark:text-red-300"}`}
                        >
                          {child.status === "normal" ? (
                            <HeartPulse className="size-6" />
                          ) : (
                            <ShieldAlert className="size-6" />
                          )}
                        </div>
                        <div className="pt-0.5">
                          <p className="font-black text-sm text-foreground mb-1 tracking-tight">
                            {child.status === "normal"
                              ? "¡Creciendo fuerte y sano!"
                              : child.status === "follow-up"
                                ? "Atención al crecimiento"
                                : "Requiere Atención Médica"}
                          </p>
                          <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">
                            {child.status === "urgent"
                              ? "Hemos identificado una señal importante. Por favor, visita la posta médica más cercana."
                              : child.status === "follow-up"
                                ? "Su ganancia de peso es un poco baja. Un actor social coordinará una visita pronto."
                                : "El peso y talla de tu bebé están perfectos según la Organización Mundial de la Salud."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-3 mt-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                        {t("family.quick_actions")}
                      </p>
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            id: "weight" as MeasureType,
                            label: t("family.weight"),
                            desc: "Sube a tu bebé a la balanza",
                            icon: Scale,
                            bg: "from-cyan-500/20 to-blue-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
                            iconBg: "bg-cyan-500",
                          },
                          {
                            id: "height" as MeasureType,
                            label: t("family.height"),
                            desc: "Mide su alturita acostado",
                            icon: Ruler,
                            bg: "from-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                            iconBg: "bg-emerald-500",
                          },
                          {
                            id: "muac" as MeasureType,
                            label: t("family.muac"),
                            desc: "Cinta especial del bracito",
                            icon: Activity,
                            bg: "from-rose-500/20 to-pink-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
                            iconBg: "bg-rose-500",
                          },
                        ].map((act) => (
                          <button
                            key={act.id}
                            onClick={() => setWizardType(act.id)}
                            className={`group relative overflow-hidden bg-gradient-to-br ${act.bg} backdrop-blur-xl border p-4 rounded-[2rem] flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 active:scale-[0.98] cursor-pointer`}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
                            
                            <div
                              className={`p-3.5 rounded-2xl shadow-md shrink-0 ${act.iconBg} text-white group-hover:scale-110 transition-transform duration-300 relative z-10`}
                            >
                              <act.icon className="size-6 drop-shadow-sm" />
                            </div>
                            <div className="text-left flex-1 relative z-10">
                              <span className="text-lg font-black text-foreground block font-nunito tracking-tight drop-shadow-sm">
                                {act.label}
                              </span>
                              <span className="text-sm font-bold opacity-80 block mt-0.5 leading-snug group-hover:opacity-100 transition-opacity">
                                {act.desc}
                              </span>
                            </div>
                            <div className="bg-white/40 dark:bg-black/20 p-2 rounded-full relative z-10 text-foreground group-hover:bg-white group-hover:text-black transition-colors transform group-hover:translate-x-1 duration-300 shadow-sm border border-white/30">
                              <ChevronRight className="size-5" />
                            </div>
                          </button>
                        ))}
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
                    <div className="bg-card/40 border border-border rounded-2xl p-4 mt-4 flex items-start gap-3 shadow-sm">
                      <div className="p-1.5 bg-muted rounded-lg shrink-0">
                        <ShieldAlert className="size-4 text-muted-foreground" />
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        <strong className="text-foreground">Importante:</strong>{" "}
                        Yanapiri Wawa es una herramienta complementaria de
                        prevención. Los estados nutricionales mostrados no
                        reemplazan el diagnóstico clínico presencial de su
                        Centro de Salud.
                      </p>
                    </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "history" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg text-white">
                    <Activity className="size-5" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground font-nunito tracking-tight">
                    {t("family.history_title")}
                  </h2>
                </div>
                <div className="relative pl-6">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-[1.15rem] top-4 bottom-4 w-px bg-border" />

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
                              className="relative group bg-card/60 hover:bg-card backdrop-blur-md border border-border hover:border-primary/30 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md ml-4"
                            >
                              {/* Timeline Node */}
                              <div className="absolute -left-8 top-1/2 -translate-y-1/2 size-8 bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-sm z-10 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                                <Icon className="size-3.5 text-primary group-hover:text-primary-foreground" />
                              </div>

                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-sm font-black text-foreground capitalize tracking-tight">
                                    {m.type === "weight"
                                      ? t("family.weight")
                                      : m.type === "height"
                                        ? t("family.height")
                                        : t("family.muac")}
                                  </p>
                                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                                    {date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1.5">
                                <p className="text-lg font-mono font-black text-foreground">
                                  {m.value}{" "}
                                  <span className="text-sm text-muted-foreground font-semibold">
                                    {m.unit}
                                  </span>
                                </p>
                                <span
                                  className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                    isSynced
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
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
                <NutritionChatbot />
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
                <NutritionalTrivia />
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
    </>
  );
}
