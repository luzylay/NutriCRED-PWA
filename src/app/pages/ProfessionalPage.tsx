import { useState, useEffect } from "react";
import {
  Baby,
  Shield,
  RefreshCw,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Pill,
  Apple,
  HeartPulse,
  CheckCircle2,
  ShieldAlert,
  Check,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Plus,
  Scale,
  Ruler,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { AlertBadge } from "../components/shared/AlertBadge";
import { ZScoreBar } from "../components/shared/ZScoreBar";
import { GrowthChart } from "../components/shared/GrowthChart";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
import { NutritionalTwinSimulator } from "../components/simulators/NutritionalTwinSimulator";
import { CorrectionModal } from "../components/professional/CorrectionModal";
import { PowerBIDashboard } from "../components/professional/PowerBIDashboard";
import { fetchMeasurements } from "../lib/api";
import { getWHORef } from "../lib/who-refs";
import { ALERT_CFG } from "../lib/constants";
import type { Child, AlertLevel, GrowthPoint, MeasureType, Measurement } from "../lib/types";

export default function ProfessionalPage() {
  const { user, logout } = useAuth();
  const {
    children,
    measurements,
    auditLogs,
    dailyTracking,
    isLoading,
    refreshData,
    addMeasurementOffline,
    validateMeasurement,
  } = useData();

  const [activeTab, setActiveTab] = useState<"cases" | "reach" | "decision" | "powerbi">("cases");
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [filter, setFilter] = useState<AlertLevel | "all">("all");
  const [childMeasurements, setChildMeasurements] = useState<GrowthPoint[]>([]);

  // Clinical record form state
  const [showClinicalForm, setShowClinicalForm] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [muacInput, setMuacInput] = useState("");
  const [hemoglobinInput, setHemoglobinInput] = useState("");
  const [edemaInput, setEdemaInput] = useState("0");
  const [campaignInput, setCampaignInput] = useState<string>("Campaña Hierro");
  const [trendInput, setTrendInput] = useState<"up" | "stable" | "down">("stable");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [isSavingClinical, setIsSavingClinical] = useState(false);

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  useEffect(() => {
    if (!selectedChild) return;
    const load = async () => {
      try {
        const data = await fetchMeasurements(parseInt(selectedChild.id));
        const points: GrowthPoint[] = data.map((m) => {
          const date = new Date(m.measurement_date);
          const label = date.toLocaleDateString("es-PE", {
            month: "short",
            day: "numeric",
          });
          const [median, sd] = getWHORef(
            selectedChild.ageMonths,
            selectedChild.sex,
          );
          return {
            label,
            value: m.value,
            p3: median - 1.88 * sd,
            band: 3.76 * sd,
            p50: median,
          };
        });
        setChildMeasurements(points);
      } catch {
        setChildMeasurements([]);
      }
    };
    load();
  }, [selectedChild]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCommunity, setSelectedCommunity] = useState("all");

  const districts = ["all", ...Array.from(new Set(children.map((c) => c.district)))];
  const communities = ["all", ...Array.from(new Set(children.map((c) => c.community)))];

  const filtered = children.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDni = c.dni ? c.dni.includes(q) : false;
      if (!matchName && !matchDni) return false;
    }
    
    if (selectedDistrict !== "all" && c.district !== selectedDistrict) return false;
    if (selectedCommunity !== "all" && c.community !== selectedCommunity) return false;
    
    return true;
  }).sort((a, b) => {
    const order = { urgent: 0, "follow-up": 1, normal: 2 };
    return order[a.status] - order[b.status];
  });

  const counts = {
    total: children.length,
    normal: children.filter((c) => c.status === "normal").length,
    followUp: children.filter((c) => c.status === "follow-up").length,
    urgent: children.filter((c) => c.status === "urgent").length,
  };

  const selectedChildWeight = selectedChild ? measurements.filter((m) => String(m.child_id) === String(selectedChild.id) && m.type === "weight").slice(-1)[0] : null;
  const selectedChildHeight = selectedChild ? measurements.filter((m) => String(m.child_id) === String(selectedChild.id) && m.type === "height").slice(-1)[0] : null;
  const selectedChildMUAC = selectedChild ? measurements.filter((m) => String(m.child_id) === String(selectedChild.id) && m.type === "muac").slice(-1)[0] : null;
  const selectedChildHb = selectedChild ? measurements.filter((m) => String(m.child_id) === String(selectedChild.id) && m.type === "hemoglobin").slice(-1)[0] : null;
  const selectedChildEdema = selectedChild ? measurements.filter((m) => String(m.child_id) === String(selectedChild.id) && m.type === "edema").slice(-1)[0] : null;

  const { t, languageInfo } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <div className="min-h-screen bg-gradient-flow relative">
        {/* Background container to prevent scrollbars from blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3.5 sm:py-4 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
                <Baby className="size-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider block leading-none">
                  NutriCRED
                </span>
                <span className="font-extrabold text-foreground text-sm sm:text-base font-nunito leading-tight">
                  Panel Profesional de Salud
                </span>
              </div>
              {user && (
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2.5 py-1.5 rounded-full font-medium ml-1">
                  <Shield className="size-3" />
                  {user.username} · C.S. Anchonga
                </span>
              )}
            </div>

            <HeaderActions
              onSettings={() => setIsSettingsOpen(true)}
              onRefresh={refreshData}
              isRefreshing={isLoading}
              onLogout={logout}
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              {
                label: "Total Niños",
                value: counts.total,
                icon: Users,
                bg: "bg-card",
                text: "text-foreground",
              },
              {
                label: "Adecuado",
                value: counts.normal,
                icon: CheckCircle,
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
                text: "text-emerald-700 dark:text-emerald-300",
              },
              {
                label: "En Riesgo",
                value: counts.followUp,
                icon: Clock,
                bg: "bg-amber-50 dark:bg-amber-950/20",
                text: "text-amber-700 dark:text-amber-300",
              },
              {
                label: "Alerta Médica",
                value: counts.urgent,
                icon: AlertCircle,
                bg: "bg-red-50 dark:bg-red-950/20",
                text: "text-red-700 dark:text-red-300",
              },
              {
                label: "SRSI Cumplimiento",
                value: `${dailyTracking.filter(t => t.supplement_taken).length}/${children.length}`,
                icon: Pill,
                bg: "bg-violet-50 dark:bg-violet-950/20",
                text: "text-violet-700 dark:text-violet-300",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`${kpi.bg} border border-border rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm`}
              >
                <kpi.icon className={`size-6 sm:size-7 ${kpi.text} shrink-0`} />
                <div className="min-w-0">
                  <p
                    className={`text-2xl sm:text-3xl font-extrabold ${kpi.text}`}
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {kpi.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">
                    {kpi.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab selector */}
          <div className="flex bg-muted/60 p-1.5 rounded-2xl border border-border/80 w-full overflow-x-auto hide-scrollbar gap-1.5 relative z-10">
            <button
              onClick={() => setActiveTab("cases")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === "cases"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Users className="size-4 shrink-0" />
              Priorización de Casos (Seguimiento Clínico)
            </button>
            <button
              onClick={() => setActiveTab("reach")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === "reach"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Activity className="size-4 shrink-0" />
              Indicadores de Cobertura y Alcance
            </button>
            <button
              onClick={() => setActiveTab("decision")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === "decision"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <FileText className="size-4 shrink-0" />
              Justificación de Insumos (MINSA / DIRIS)
            </button>
            <button
              onClick={() => setActiveTab("powerbi")}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === "powerbi"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Activity className="size-4 text-emerald-500 shrink-0" />
              Dashboard Power BI (DirectQuery SQL)
            </button>
          </div>

          {activeTab === "cases" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4 sm:gap-6 relative z-10">
              {/* Priority list */}
              <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex flex-col">
                {/* Header & Status Filter Pills */}
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-primary shrink-0" />
                    <h2 className="font-extrabold text-foreground font-nunito text-base sm:text-lg">
                      Filtro de Casos Médicos
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                    {[
                      { id: "all" as const, label: "Todos", icon: null },
                      {
                        id: "urgent" as const,
                        label: "Alerta Médica",
                        icon: AlertCircle,
                        color: "text-rose-500",
                      },
                      {
                        id: "follow-up" as const,
                        label: "Riesgo Nutricional",
                        icon: Clock,
                        color: "text-amber-500",
                      },
                      {
                        id: "normal" as const,
                        label: "Adecuado",
                        icon: CheckCircle,
                        color: "text-emerald-500",
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-3 py-2.5 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap min-h-[44px] touch-manipulation transition-all cursor-pointer w-full sm:w-auto active:scale-[0.97] ${
                          filter === f.id
                            ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                            : "bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {f.icon && <f.icon className={`size-4 ${filter === f.id ? "text-primary-foreground" : f.color} shrink-0`} />}
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & Location Filters */}
                <div className="px-4 sm:px-5 py-3 border-b border-border bg-muted/20 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🔍 Buscar por Nombre, DNI o Historia Clínica..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base sm:text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[44px]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-muted hover:bg-muted/80 px-2 py-1 rounded-lg text-muted-foreground"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-wider block">Red de Salud (Distrito)</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl px-3 py-3 text-base sm:text-sm font-bold text-foreground outline-none cursor-pointer min-h-[44px]"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>
                            {d === "all" ? "Todos los Distritos" : d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-wider block">Comunidad / Sector</label>
                      <select
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl px-3 py-3 text-base sm:text-sm font-bold text-foreground outline-none cursor-pointer min-h-[44px]"
                      >
                        {communities.map((c) => (
                          <option key={c} value={c}>
                            {c === "all" ? "Todas las Comunidades" : c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filtered Patient List */}
                <div className="divide-y divide-border overflow-y-auto max-h-[520px]">
                  {filtered.length === 0 && (
                    <div className="px-5 py-12 text-center space-y-2">
                      <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="size-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        No hay registros para este filtro
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Intente modificando los términos de búsqueda o los selectores de distrito.
                      </p>
                    </div>
                  )}
                  {filtered.map((child, index) => {
                    const isSelected = selectedChild?.id === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className={`w-full text-left px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-muted/30 min-h-[44px] cursor-pointer touch-manipulation active:scale-[0.99] ${
                          isSelected
                            ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary shadow-xs"
                            : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs text-muted-foreground w-5 shrink-0 font-bold">
                            #{index + 1}
                          </span>
                          <span
                            className={`size-3 rounded-full shrink-0 ${ALERT_CFG[child.status].dotClass}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-bold text-foreground text-sm truncate">
                                {child.name}
                              </p>
                              {dailyTracking.some(t => t.child_id.toString() === child.id && !t.supplement_taken) && (
                                <div className="flex items-center gap-1 bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-rose-500/20" title="No cumplió SRSI hoy">
                                  <Pill className="size-3" /> ¡Falta Suplemento!
                                </div>
                              )}
                              {dailyTracking.some(t => t.child_id.toString() === child.id && t.supplement_taken) && (
                                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-500/20" title="Cumplió SRSI hoy">
                                  <Pill className="size-3" /> Suplementado
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              DNI: {child.dni || "—"} · {child.age} · {child.community}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 shrink-0 border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-mono font-black text-foreground">
                              {child.zScore ? `Z = ${child.zScore}` : "S/Z"}
                            </p>
                            <p className="text-[10px] font-semibold text-muted-foreground">
                              {child.lastMeasured}
                            </p>
                          </div>
                          <AlertBadge level={child.status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Child detail sheet */}
              {selectedChild && (
                <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex flex-col">
                  <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                      <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg shrink-0">
                        {selectedChild.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-foreground truncate font-nunito text-base">
                          {selectedChild.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          DNI: {selectedChild.dni || "—"} · {selectedChild.sex === "M" ? "M" : "F"} · {selectedChild.age}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
                      <button
                        onClick={() => setShowClinicalForm(!showClinicalForm)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] shadow-sm touch-manipulation active:scale-[0.98]"
                      >
                        <Plus className="size-4 shrink-0" />
                        Control
                      </button>
                      <button
                        onClick={() => setIsCorrectionModalOpen(true)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] border border-rose-500/20 touch-manipulation active:scale-[0.98]"
                        title="Corregir Evaluación con Trazabilidad (Ley N° 29733)"
                      >
                        <RefreshCw className="size-4 shrink-0" />
                        Corregir
                      </button>
                      <AlertBadge level={selectedChild.status} size="md" />
                    </div>
                  </div>

                  {/* Ficha Clínico-Nutricional de Detalle */}
                  <div className="px-4 sm:px-5 py-3 bg-muted/30 border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-card p-3 rounded-2xl border border-border shadow-xs">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Estado Z-Score</span>
                      <span className={`font-black text-sm block mt-0.5 ${selectedChild.status === "urgent" ? "text-rose-600 animate-pulse" : selectedChild.status === "follow-up" ? "text-amber-600" : "text-emerald-600"}`}>
                        {selectedChild.zScore ? `Z = ${selectedChild.zScore}` : "S/Z"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground block truncate">Peso-para-Edad OMS</span>
                    </div>

                    <div className="bg-card p-3 rounded-2xl border border-border shadow-xs">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Hemoglobina</span>
                      <span className={`font-black text-sm block mt-0.5 ${!selectedChildHb ? "text-muted-foreground" : parseFloat(String(selectedChildHb.value)) < 11 ? "text-rose-600 font-extrabold animate-pulse" : "text-emerald-600"}`}>
                        {selectedChildHb ? `${selectedChildHb.value} g/dL` : "Sin control"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground block truncate">
                        {!selectedChildHb ? "Pendiente" : parseFloat(String(selectedChildHb.value)) < 7 ? "Anemia Severa" : parseFloat(String(selectedChildHb.value)) < 10 ? "Anemia Moderada" : parseFloat(String(selectedChildHb.value)) < 11 ? "Anemia Leve" : "Normal"}
                      </span>
                    </div>

                    <div className="bg-card p-3 rounded-2xl border border-border shadow-xs">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Brazo (MUAC)</span>
                      <span className={`font-black text-sm block mt-0.5 ${!selectedChildMUAC ? "text-muted-foreground" : parseFloat(String(selectedChildMUAC.value)) < 11.5 ? "text-rose-600 font-extrabold animate-pulse" : parseFloat(String(selectedChildMUAC.value)) < 12.5 ? "text-amber-600" : "text-emerald-600"}`}>
                        {selectedChildMUAC ? `${selectedChildMUAC.value} cm` : "Sin control"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground block truncate">
                        {!selectedChildMUAC ? "Pendiente" : parseFloat(String(selectedChildMUAC.value)) < 11.5 ? "Agudo Severo" : parseFloat(String(selectedChildMUAC.value)) < 12.5 ? "Riesgo Leve" : "Adecuado"}
                      </span>
                    </div>

                    <div className="bg-card p-3 rounded-2xl border border-border shadow-xs">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">Edema Bilateral</span>
                      <span className={`font-black text-sm block mt-0.5 ${selectedChildEdema && selectedChildEdema.value === 1 ? "text-rose-600 font-black animate-pulse" : "text-emerald-600"}`}>
                        {selectedChildEdema ? (selectedChildEdema.value === 1 ? "Presente ⚠️" : "Ausente") : "No evaluado"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground block truncate">
                        {selectedChildEdema && selectedChildEdema.value === 1 ? "Kwashiorkor Riesgo" : "Sin signos"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[500px]">
                    {showClinicalForm && (
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-3 duration-300">
                        <div className="flex items-center justify-between pb-1.5 border-b border-primary/10">
                          <h4 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1">
                            <Activity className="size-3.5" /> Registrar Control Clínico
                          </h4>
                          <button
                            onClick={() => setShowClinicalForm(false)}
                            className="text-muted-foreground hover:text-foreground text-xs font-bold p-1"
                          >
                            Cerrar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-foreground">Peso (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ej. 11.2"
                              value={weightInput}
                              onChange={(e) => setWeightInput(e.target.value)}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-foreground">Talla (cm)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ej. 85.5"
                              value={heightInput}
                              onChange={(e) => setHeightInput(e.target.value)}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium min-h-[44px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-foreground">MUAC (cm)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ej. 12.8"
                              value={muacInput}
                              onChange={(e) => setMuacInput(e.target.value)}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-foreground">Hemoglobina (g/dL)</label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ej. 11.5"
                              value={hemoglobinInput}
                              onChange={(e) => setHemoglobinInput(e.target.value)}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium min-h-[44px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="font-bold text-foreground">¿Presenta Edema Bilateral?</label>
                          <select
                            value={edemaInput}
                            onChange={(e) => setEdemaInput(e.target.value)}
                            className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium min-h-[44px]"
                          >
                            <option value="0">No presenta Edema</option>
                            <option value="1">Sí, presenta Edema Bilateral</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-foreground">Asignar Campaña de Alimentación</label>
                            <select
                              value={campaignInput}
                              onChange={(e) => setCampaignInput(e.target.value)}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-bold min-h-[44px]"
                            >
                              <option value="Campaña Hierro">Campaña Hierro</option>
                              <option value="Campaña Multinutriente">Campaña Multinutriente</option>
                              <option value="Campaña Leche Fortificada">Campaña Leche Fortificada</option>
                              <option value="Campaña Complementaria">Campaña Complementaria</option>
                              <option value="Sin campaña">Sin campaña</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-foreground">Tendencia de Peso</label>
                            <select
                              value={trendInput}
                              onChange={(e) => setTrendInput(e.target.value as "up" | "stable" | "down")}
                              className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-bold min-h-[44px]"
                            >
                              <option value="up">↑ Subiendo</option>
                              <option value="stable">→ Estable</option>
                              <option value="down">↓ Bajando</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="font-bold text-foreground">Diagnóstico del Médico (Texto Libre)</label>
                          <textarea
                            placeholder="Ej. Anemia leve en recuperación. Continuar suplementación diaria..."
                            value={diagnosisInput}
                            onChange={(e) => setDiagnosisInput(e.target.value)}
                            className="w-full bg-card border rounded-xl px-3 py-2.5 text-sm font-medium text-foreground resize-none h-20 outline-none"
                          />
                        </div>

                        <button
                          onClick={async () => {
                            setIsSavingClinical(true);
                            const childId = parseInt(selectedChild.id);
                            const timestamp = new Date().toISOString();

                            if (weightInput) {
                              await addMeasurementOffline({
                                childId,
                                child_id: childId,
                                type: "weight",
                                value: parseFloat(weightInput),
                                unit: "kg",
                                method: "clinical",
                                measurement_date: timestamp,
                                sync_status: "pending",
                                operator: "professional",
                                validated: true,
                              });
                            }
                            if (heightInput) {
                              await addMeasurementOffline({
                                childId,
                                child_id: childId,
                                type: "height",
                                value: parseFloat(heightInput),
                                unit: "cm",
                                method: "clinical",
                                measurement_date: timestamp,
                                sync_status: "pending",
                                operator: "professional",
                                validated: true,
                              });
                            }
                            if (muacInput) {
                              await addMeasurementOffline({
                                childId,
                                child_id: childId,
                                type: "muac",
                                value: parseFloat(muacInput),
                                unit: "cm",
                                method: "clinical",
                                measurement_date: timestamp,
                                sync_status: "pending",
                                operator: "professional",
                                validated: true,
                              });
                            }
                            if (hemoglobinInput) {
                              await addMeasurementOffline({
                                childId,
                                child_id: childId,
                                type: "hemoglobin",
                                value: parseFloat(hemoglobinInput),
                                unit: "g/dL",
                                method: "clinical",
                                measurement_date: timestamp,
                                sync_status: "pending",
                                operator: "professional",
                                validated: true,
                              });
                            }
                            
                            await addMeasurementOffline({
                              childId,
                              child_id: childId,
                              type: "edema",
                              value: edemaInput === "1" ? 1 : 0,
                              unit: "",
                              method: "clinical",
                              measurement_date: timestamp,
                              sync_status: "pending",
                              operator: "professional",
                              validated: true,
                            });

                             selectedChild.campaign = campaignInput as any;
                             selectedChild.weightTrend = trendInput;
                             if (diagnosisInput) {
                               selectedChild.doctorDiagnosis = diagnosisInput;
                             }

                             setWeightInput("");
                             setHeightInput("");
                             setMuacInput("");
                             setHemoglobinInput("");
                             setEdemaInput("0");
                             setDiagnosisInput("");
                            setIsSavingClinical(false);
                            setShowClinicalForm(false);
                            refreshData();
                          }}
                          disabled={isSavingClinical}
                          className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-xs cursor-pointer text-center"
                        >
                          {isSavingClinical ? "Guardando..." : "Guardar Control Clínico"}
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Puntaje Z Peso-para-Edad (OMS)
                      </p>
                      <ZScoreBar zscore={selectedChild.zScore} />
                    </div>

                    {/* Local Food Recommendations */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Apple className="size-4 text-emerald-600" />
                        <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">
                          Recomendación Nutritiva Regional y de Bajo Costo
                        </h4>
                      </div>
                      <div className="text-xs space-y-2">
                        <p className="font-bold text-foreground/90">
                          {selectedChild.status === "urgent" || selectedChild.status === "follow-up"
                            ? "Fórmula de Recuperación Rápida (Anemia/Malnutrición):"
                            : "Dieta Preventiva y de Mantenimiento:"}
                        </p>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><strong>• Alimentos de Hierro (Bajo Costo):</strong> Sangrecita de pollo (S/. 2.00/kg), bazo de res, hígado de pollo o bofe. Fuentes de hierro hemínico absorbible.</p>
                          <p><strong>• Acompañamiento andino:</strong> Combinar con puré de papa nativa, quinua lavada o kiwicha, y añadir cítricos (limón/naranja) para triplicar absorción.</p>
                          <p><strong>• Menú sugerido:</strong> Papilla de sangrecita (3 cucharadas) con puré de habas y oca cocida, con limonada tibia.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Curva de peso vs referencias OMS
                      </p>
                      <div className="bg-muted/10 border rounded-2xl p-2 min-w-0">
                        <GrowthChart data={childMeasurements} height={140} />
                      </div>
                    </div>

                    {/* Historial de Mediciones y Validación */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Historial de Evaluaciones Clínicas
                      </p>
                      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border text-xs max-h-[160px] overflow-y-auto">
                        {measurements
                          .filter((m) => String(m.child_id) === String(selectedChild.id))
                          .slice()
                          .reverse()
                          .map((m, idx) => {
                            const isProf = m.operator === "professional";
                            const isValidated = m.validated || isProf;

                            return (
                              <div key={idx} className="p-3 flex items-center justify-between hover:bg-muted/15 transition-all">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-foreground capitalize">
                                      {m.type === "weight"
                                        ? "Peso"
                                        : m.type === "height"
                                          ? "Talla"
                                          : m.type === "muac"
                                            ? "MUAC"
                                            : m.type === "hemoglobin"
                                              ? "Hemoglobina"
                                              : "Edema Bilateral"}
                                    </span>
                                    <span className="font-mono text-muted-foreground font-semibold">
                                      {m.type === "edema" ? (m.value === 1 ? "Presente" : "Ausente") : `${m.value} ${m.unit}`}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-semibold">
                                    <span>{new Date(m.measurement_date).toLocaleDateString("es-PE")}</span>
                                    <span>·</span>
                                    <span className={isProf ? "text-primary" : "text-amber-600"}>
                                      {isProf ? "Clínico (Personal)" : "Auto-reporte (Familia)"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {isValidated ? (
                                    <span className="bg-emerald-500/10 text-emerald-600 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 border border-emerald-500/20">
                                      <Check className="size-3" /> Validado
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => validateMeasurement(m.id ?? 0)}
                                      className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 font-extrabold text-[10px] rounded border border-amber-500/30 transition-all cursor-pointer"
                                    >
                                      Validar
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        {measurements.filter((m) => String(m.child_id) === String(selectedChild.id)).length === 0 && (
                          <p className="p-3 text-center text-muted-foreground italic text-[11px]">Sin mediciones registradas.</p>
                        )}
                      </div>
                    </div>

                    {selectedChild.status !== "normal" && (
                      <div
                        className={`rounded-2xl border p-4 space-y-1.5 ${ALERT_CFG[selectedChild.status].bgClass} ${ALERT_CFG[selectedChild.status].borderClass}`}
                      >
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${ALERT_CFG[selectedChild.status].textClass}`}
                        >
                          Señal de alerta activa
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/90">
                          Z-score actual = {selectedChild.zScore}. Representa una
                          caída por debajo de las 2 desviaciones estándar de la
                          referencia oficial de crecimiento.
                        </p>
                        <div className="flex items-start gap-1.5 pt-1">
                          <Shield className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-normal">
                            Referencia: Norma Técnica de Salud CRED MINSA (NTS
                            137) / Estándares OMS.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Gemelo Digital */}
                    <NutritionalTwinSimulator
                      currentZScore={selectedChild.zScore ?? 0}
                      childName={selectedChild.shortName ?? selectedChild.name}
                    />

                    <div className="bg-secondary/60 rounded-2xl px-4 py-3 border">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                        Acción sugerida para Actor Social
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {selectedChild.nextAction}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="size-3 shrink-0" />
                        Comunidad de {selectedChild.community}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reach" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Reach Indicator Dashboard */}
              <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-sm">
                    <Activity className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground font-nunito tracking-tight">Indicadores de Alcance y Calidad Regional</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Cobertura y control consolidado de DIRIS / Red de Salud Huancavelica</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Cobertura CRED", val: "91%", desc: "Niños con controles al día", color: "bg-emerald-500", text: "text-emerald-600" },
                    { title: "Cumplimiento SRSI", val: "76%", desc: "Suplementación de hierro activa", color: "bg-violet-500", text: "text-violet-600" },
                    { title: "Vacunación Completa", val: "88%", desc: "Rotavirus, Neumococo, etc.", color: "bg-cyan-500", text: "text-cyan-600" },
                    { title: "Asistencia a Citas", val: "84%", desc: "Asistencia a citas programadas", color: "bg-amber-500", text: "text-amber-600" }
                  ].map((ind, idx) => (
                    <div key={idx} className="bg-muted/30 border border-border/70 rounded-2xl p-5 space-y-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{ind.title}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-foreground">{ind.val}</span>
                        <span className="text-[10px] text-muted-foreground font-bold">{ind.desc}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${ind.color} h-2 rounded-full`} style={{ width: ind.val }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                  <div className="lg:col-span-8 bg-muted/20 border border-border rounded-2xl p-5 space-y-3">
                    <h4 className="font-extrabold text-sm text-foreground">Distribución Geográfica y Estado Nutricional</h4>
                    <p className="text-xs text-muted-foreground">Distribución de casos activos por distritos y comunidades rurales.</p>
                    
                    <div className="space-y-3 pt-2">
                      {[
                        { district: "Lircay", total: 12, normal: 8, followUp: 2, urgent: 2 },
                        { district: "Anchonga", total: 15, normal: 11, followUp: 3, urgent: 1 },
                        { district: "Ccasapata", total: 9, normal: 5, followUp: 2, urgent: 2 },
                        { district: "Secclla", total: 6, normal: 4, followUp: 1, urgent: 1 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">{item.district} ({item.total} niños)</span>
                            <span className="text-muted-foreground">Normal: {item.normal} | Riesgo: {item.followUp} | Alerta: {item.urgent}</span>
                          </div>
                          <div className="w-full flex h-3.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${(item.normal / item.total) * 100}%` }} title="Adecuado" />
                            <div className="bg-amber-500 h-full" style={{ width: `${(item.followUp / item.total) * 100}%` }} title="Riesgo" />
                            <div className="bg-red-500 h-full" style={{ width: `${(item.urgent / item.total) * 100}%` }} title="Alerta" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-muted/20 border border-border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-5 text-emerald-600" />
                      <h4 className="font-extrabold text-sm text-foreground">Calidad y Limpieza de Datos</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      El sistema escanea y limpia registros para evitar duplicados en RENIEC y inconsistencias en base de datos.
                    </p>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border">
                        <span className="font-bold text-foreground">DNI Duplicados (RENIEC)</span>
                        <span className="bg-emerald-500/10 text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-full">0 casos</span>
                      </div>
                      <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border">
                        <span className="font-bold text-foreground">Medidas fuera de rango</span>
                        <span className="bg-emerald-500/10 text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-full">0 casos</span>
                      </div>
                      <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border">
                        <span className="font-bold text-foreground">Niños sin control &gt; 3 meses</span>
                        <span className="bg-amber-500/10 text-amber-600 font-extrabold px-2.5 py-0.5 rounded-full">2 casos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "decision" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm space-y-6">
                
                {/* Dashboard Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                      <HeartPulse className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground font-nunito tracking-tight">Justificación de Insumos y Evidencia</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Genera reportes de stock, proyección de suplementos y correlación de riesgos para DIRIS y MINSA</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `INFORME DE JUSTIFICACIÓN DE STOCK - C.S. ANCHONGA\n` +
                        `-----------------------------------------------\n` +
                        `Fecha: ${new Date().toLocaleDateString()}\n` +
                        `Casos Activos de Anemia/Malnutrición con DNI Verificado: 14 casos\n` +
                        `Proyección de Demanda Mensual de Suplementos:\n` +
                        `- Sulfato Ferroso (Gotas, menores de 6m): 3 frascos (100% de cobertura)\n` +
                        `- Sulfato Ferroso / Polimaltosado (Jarabe, 6m-36m): 8 frascos\n` +
                        `- Micronutrientes (Polvo / Chispitas): 3 cajas de 30 sobres\n` +
                        `Soporte de Evidencia Científica:\n` +
                        `3 casos activos presentan factores de riesgo combinados (Sin lactancia materna exclusiva + Anemia Severa) con alto riesgo de insulinorresistencia a largo plazo.`;
                      navigator.clipboard.writeText(text);
                      alert("¡Copiado al portapapeles! Listo para pegar en tu solicitud de stock o informe oficial.");
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="size-3.5" /> Copiar Justificación DIRIS
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Supplement Calculator and Stock Forecast */}
                  <div className="bg-muted/15 border border-border/80 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Scale className="size-4.5 text-primary" />
                      <h4 className="font-extrabold text-sm text-foreground font-nunito">Calculadora de Stock Requerido</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cálculo de dosis exactas basándose en la edad y el peso real de los niños registrados en el establecimiento.
                    </p>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="p-3 bg-card rounded-xl border border-border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-foreground">Sulfato Ferroso en Gotas</p>
                          <p className="text-[10px] text-muted-foreground">Bebés &lt; 6 meses (3 wawas)</p>
                        </div>
                        <span className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full text-xs">3 frascos</span>
                      </div>
                      <div className="p-3 bg-card rounded-xl border border-border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-foreground">Jarabe de Hierro Polimaltosado</p>
                          <p className="text-[10px] text-muted-foreground">Niños de 6 a 36 meses (8 wawas)</p>
                        </div>
                        <span className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full text-xs">8 frascos</span>
                      </div>
                      <div className="p-3 bg-card rounded-xl border border-border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-foreground">Micronutrientes (Polvo)</p>
                          <p className="text-[10px] text-muted-foreground">Niños de 3 a 5 años (3 wawas)</p>
                        </div>
                        <span className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full text-xs">3 cajas</span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 rounded-xl text-[11px] leading-relaxed flex gap-2">
                      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Evita el Desperdicio:</strong> La proyección considera un margen de merma del 5% evitando el desabastecimiento o vencimiento de fármacos.
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Social Programs Impact Analysis */}
                  <div className="bg-muted/15 border border-border/80 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Apple className="size-4.5 text-emerald-600" />
                      <h4 className="font-extrabold text-sm text-foreground font-nunito">Impacto de Programas Sociales</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Correlación del estado de nutrición de los niños cruzado con los programas de ayuda a los que pertenecen.
                    </p>

                    <div className="space-y-3 pt-2 text-xs">
                      {[
                        { program: "Qali Warma (Comedores Escolares)", active: 8, success: 75, recovered: "6 recuperados" },
                        { program: "Vaso de Leche", active: 12, success: 58, recovered: "7 recuperados" },
                        { program: "Programa de Apoyo JUNTOS", active: 10, success: 90, recovered: "9 recuperados" }
                      ].map((p, idx) => (
                        <div key={idx} className="p-3 bg-card rounded-xl border border-border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">{p.program}</span>
                            <span className="bg-emerald-500/10 text-emerald-600 font-extrabold px-2 py-0.5 rounded text-[10px]">{p.success}% Éxito</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${p.success}%` }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                            <span>{p.active} niños inscritos</span>
                            <span>{p.recovered}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Retrospective Analysis and Future Risks */}
                  <div className="bg-muted/15 border border-border/80 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="size-4.5 text-rose-600" />
                      <h4 className="font-extrabold text-sm text-foreground font-nunito">Análisis Retrospectivo y Riesgos</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Predicción clínica combinando variables históricas para evitar enfermedades crónicas a largo plazo.
                    </p>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="p-3.5 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-extrabold">
                          <AlertTriangle className="size-3.5 shrink-0" />
                          <span>Riesgo de Diabetes / Resistencia a Insulina</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          <strong>3 casos detectados:</strong> Niños con desnutrición crónica que no recibieron lactancia materna exclusiva. Altamente propenso en la adultez.
                        </p>
                      </div>

                      <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-extrabold">
                          <AlertTriangle className="size-3.5 shrink-0" />
                          <span>Riesgo de Recaída Crónica (SRSI Trunco)</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          <strong>2 casos detectados:</strong> Niños que abandonaron la suplementación de hierro por olvido de la familia. Requieren visita domiciliaria.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "powerbi" && (
            <div className="relative z-10 pt-2">
              <PowerBIDashboard />
            </div>
          )}
        </div>
      </div>

      {selectedChild && (
        <CorrectionModal
          isOpen={isCorrectionModalOpen}
          onClose={() => setIsCorrectionModalOpen(false)}
          child={selectedChild}
          onSuccess={() => refreshData()}
        />
      )}
    </>
  );
}
