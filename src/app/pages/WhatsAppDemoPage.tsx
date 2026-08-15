import { useState, useEffect } from "react";
import {
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Calendar,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Apple,
  Clock,
  User,
  HeartPulse,
  Scale,
  Ruler,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { HeaderActions } from "../components/shared/HeaderActions";
import { AlertBadge } from "../components/shared/AlertBadge";
import type { Child } from "../lib/types";

export default function WhatsAppDemoPage() {
  const { logout } = useAuth();
  const { children, isOnline, refreshData } = useData();

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [liveTimestamp, setLiveTimestamp] = useState<string>(new Date().toLocaleTimeString("es-PE"));
  const [pulse, setPulse] = useState(false);

  // Synchronize active child selection
  const activeChild: Child =
    (selectedChildId ? children.find((c) => c.id === selectedChildId) : null) ??
    children[0] ?? {
      id: "1",
      dni: "70000001",
      name: "Pedro Inca Tuesta",
      shortName: "Pedro",
      age: "3 años, 1 mes",
      ageMonths: 37,
      sex: "M",
      caregiver: "Rosa Tuesta",
      caregiverDni: "74589921",
      status: "urgent",
      weight: 11.8,
      height: 88.1,
      muac: 11.2,
      hemoglobin: 8.5,
      edema: false,
      zScore: -2.8,
      lastMeasured: "hoy",
      nextAction: "Evaluación médica prioritaria",
      district: "Huancavelica",
      community: "Ccasapata",
      campaign: "Campaña Multinutriente",
      campaignExpiry: "15/11/2026",
      weightTrend: "down",
      doctorDiagnosis: "Anemia moderada. Requiere dosis reforzada y control en 7 días.",
    };

  // Real-time ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleTimeString("es-PE"));
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground pt-10 pb-8 px-6 shadow-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1.5">
                <span className={`size-2 rounded-full bg-emerald-400 ${pulse ? "animate-ping" : ""}`} />
                EN VIVO · {liveTimestamp}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                Sincronización cada 5s
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight font-nunito flex items-center gap-3">
              NutriCRED: Consola de Monitoreo en Tiempo Real
            </h1>
            <p className="text-white/80 mt-1 text-sm font-medium max-w-2xl">
              Simulación viva de la interacción bidireccional entre la **Vista del Médico (Escritura Exclusiva)** y la **Credencial Virtual del Apoderado (Solo Lectura)**.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <RefreshCw className={`size-4 ${pulse ? "animate-spin" : ""}`} />
              Actualizar Tablas
            </button>
            <HeaderActions onLogout={logout} isOnline={isOnline} />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-6 flex-1">
        
        {/* Child Selector Carousel */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
            Seleccionar Paciente para Sincronizar (Tablas Reales):
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all shrink-0 cursor-pointer text-left ${
                  activeChild.id === c.id
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/60"
                }`}
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                    activeChild.id === c.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-foreground leading-tight font-nunito">
                    {c.shortName}
                  </p>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {c.age} · DNI: {c.dni ? `${c.dni.slice(0, 4)}****` : "----****"}
                  </p>
                </div>
                <AlertBadge level={c.status} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Grid (Médico vs Apoderado) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =================================================================== */}
          {/* COLUMNA IZQUIERDA: VISTA DEL MÉDICO (ESCRITURA EXCLUSIVA)           */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 space-y-5 bg-card border-2 border-primary/20 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Stethoscope className="size-5" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-foreground font-nunito tracking-tight leading-none">
                    Vista Médica (Escritura Exclusiva)
                  </h2>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Control Clínico CRED · Historia Clínica No: {activeChild.id}049
                  </span>
                </div>
              </div>
              <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Rol Activo
              </span>
            </div>

            {/* Child Clinical Card */}
            <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-foreground font-nunito">
                    {activeChild.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {activeChild.age} · Apoderado: {activeChild.caregiver} (DNI: {activeChild.caregiverDni ? `${activeChild.caregiverDni.slice(0, 4)}****` : "----****"})
                  </p>
                </div>
                <AlertBadge level={activeChild.status} size="md" />
              </div>

              {/* Antropometría Real */}
              <div className="grid grid-cols-4 gap-2 text-xs pt-1">
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <span className="text-[9px] font-black text-muted-foreground uppercase block">Peso</span>
                  <span className="font-mono text-sm font-black text-foreground">{activeChild.weight > 0 ? `${activeChild.weight} kg` : "--"}</span>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <span className="text-[9px] font-black text-muted-foreground uppercase block">Talla</span>
                  <span className="font-mono text-sm font-black text-foreground">{activeChild.height > 0 ? `${activeChild.height} cm` : "--"}</span>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <span className="text-[9px] font-black text-muted-foreground uppercase block">MUAC</span>
                  <span className="font-mono text-sm font-black text-foreground">{activeChild.muac ? `${activeChild.muac} cm` : "--"}</span>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border">
                  <span className="text-[9px] font-black text-muted-foreground uppercase block">Hemoglobina</span>
                  <span className="font-mono text-sm font-black text-foreground">{activeChild.hemoglobin ? `${activeChild.hemoglobin} g/dL` : "--"}</span>
                </div>
              </div>
            </div>

            {/* Asignación de Campaña */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Apple className="size-4" /> Campaña de Alimentación Asignada
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border">
                  Vigente: {activeChild.campaignExpiry || "31/12/2026"}
                </span>
              </div>
              <p className="font-black text-sm text-foreground font-nunito">
                {activeChild.campaign || "Campaña Hierro"}
              </p>
            </div>

            {/* Tendencia Evaluada Manualmente */}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-2">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
                Evaluación de Tendencia de Peso (Criterio Médico)
              </span>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                  activeChild.weightTrend === "down"
                    ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                    : activeChild.weightTrend === "up"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                }`}>
                  {activeChild.weightTrend === "down" ? <TrendingDown className="size-4" /> : activeChild.weightTrend === "up" ? <TrendingUp className="size-4" /> : <Minus className="size-4" />}
                  {activeChild.weightTrend === "down" ? "↓ Bajando de Peso" : activeChild.weightTrend === "up" ? "↑ Subiendo de Peso" : "→ Peso Estable"}
                </span>
              </div>
            </div>

            {/* Diagnóstico en Texto Libre */}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-1">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
                Diagnóstico del Médico (Historia Clínica)
              </span>
              <p className="text-xs font-medium text-foreground italic leading-relaxed">
                "{activeChild.doctorDiagnosis || "Diagnóstico registrado en consulta presencial."}"
              </p>
            </div>

            {/* Alerta Semáforo Activada */}
            <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start ${
              activeChild.status === "urgent"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                : activeChild.status === "follow-up"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
            }`}>
              <div className="p-2 bg-card rounded-xl shrink-0 border border-border shadow-xs">
                {activeChild.status === "urgent" ? (
                  <ShieldAlert className="size-5 text-rose-600" />
                ) : activeChild.status === "follow-up" ? (
                  <AlertTriangle className="size-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="size-5 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-xs uppercase tracking-wide">
                  Alerta Semáforo Activada: {activeChild.status === "urgent" ? "🔴 URGENTE" : activeChild.status === "follow-up" ? "🟡 VIGILANCIA" : "🟢 NORMAL"}
                </p>
                <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                  Recomendación emitida al apoderado para su consulta en la credencial virtual.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* COLUMNA DERECHA: VISTA APODERADO (CREDENCIAL VIRTUAL SOLO LECTURA)  */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 space-y-5 bg-card border-2 border-emerald-500/30 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-foreground font-nunito tracking-tight leading-none">
                    Credencial Virtual (Apoderado)
                  </h2>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Modo Solo Lectura · Actualización Automática en Vivo
                  </span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Vista Familiar
              </span>
            </div>

            {/* Child Summary in Credencial */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="size-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-primary/20">
                  {activeChild.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <h3 className="font-black text-foreground text-xl font-nunito leading-tight">
                    {activeChild.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold mt-0.5">
                    {activeChild.age} · DNI: {activeChild.dni ? `${activeChild.dni.slice(0, 4)}****` : "----****"}
                  </p>
                </div>
              </div>
              <AlertBadge level={activeChild.status} size="md" />
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
                    {activeChild.campaign || "Campaña Hierro"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
                Vigente hasta: {activeChild.campaignExpiry || "31/12/2026"}
              </span>
            </div>

            {/* Evolución de Peso & Tendencia */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-card p-3 rounded-2xl border border-border">
                <span className="text-[9px] font-black text-muted-foreground uppercase block">Último Peso</span>
                <span className="font-mono text-sm font-black text-foreground block mt-0.5">
                  {activeChild.weight > 0 ? `${activeChild.weight} kg` : "--"}
                </span>
              </div>
              <div className="bg-card p-3 rounded-2xl border border-border">
                <span className="text-[9px] font-black text-muted-foreground uppercase block">Última Talla</span>
                <span className="font-mono text-sm font-black text-foreground block mt-0.5">
                  {activeChild.height > 0 ? `${activeChild.height} cm` : "--"}
                </span>
              </div>
              <div className="bg-card p-3 rounded-2xl border border-border">
                <span className="text-[9px] font-black text-muted-foreground uppercase block">Tendencia</span>
                <span className={`font-extrabold text-xs block mt-0.5 ${
                  activeChild.weightTrend === "down"
                    ? "text-rose-600"
                    : activeChild.weightTrend === "up"
                      ? "text-emerald-600"
                      : "text-amber-600"
                }`}>
                  {activeChild.weightTrend === "down" ? "↓ Bajando" : activeChild.weightTrend === "up" ? "↑ Subiendo" : "→ Estable"}
                </span>
              </div>
            </div>

            {/* Diagnóstico del Médico */}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-1 text-xs">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                Diagnóstico Actual del Médico
              </span>
              <p className="font-medium text-foreground italic leading-relaxed">
                "{activeChild.doctorDiagnosis || "Diagnóstico registrado en consulta presencial."}"
              </p>
            </div>

            {/* Plan de Alimentación Vigente */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Apple className="size-4" /> Plan de Alimentación Vigente (Plato Andino Nutritivo)
              </span>
              <ul className="space-y-1 font-medium text-foreground text-[11px] list-disc list-inside">
                <li>Sangrecita o bazo de res (3 cucharadas soperas diarias).</li>
                <li>Papas nativas sancochadas + ensalada de hojas verdes.</li>
                <li>Acompañar con cítricos (naranja o camu camu) para absorber el hierro.</li>
              </ul>
            </div>

            {/* Alerta Semáforo & Indicación */}
            <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start ${
              activeChild.status === "urgent"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                : activeChild.status === "follow-up"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
            }`}>
              <div className="p-2 bg-card rounded-xl shrink-0 border border-border shadow-xs">
                {activeChild.status === "urgent" ? (
                  <ShieldAlert className="size-5 text-rose-600" />
                ) : activeChild.status === "follow-up" ? (
                  <AlertTriangle className="size-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="size-5 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-xs uppercase tracking-wide">
                  Alerta Activa: {activeChild.status === "urgent" ? "🔴 URGENTE" : activeChild.status === "follow-up" ? "🟡 VIGILANCIA" : "🟢 NORMAL"}
                </p>
                <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                  {activeChild.status === "urgent"
                    ? "Acudir a emergencia o centro de salud en las próximas 24 horas. No esperar cita programada."
                    : activeChild.status === "follow-up"
                      ? "Acudir a control en los próximos 7 días. No suspender la alimentación."
                      : "Evolución favorable. Continuar con el plan de alimentación y acudir en la fecha programada."}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center font-bold">
              📌 Nota: Este es un documento informativo oficial de consulta. El apoderado no realiza cambios en este registro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
