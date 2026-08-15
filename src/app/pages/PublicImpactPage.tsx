import { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  RefreshCw,
  Globe,
  Smartphone,
  CheckCircle2,
  Users,
  Baby,
  HeartPulse,
  Clock,
  Sparkles,
  MapPin,
  Lock,
  PieChart,
} from "lucide-react";
import { fetchPublicImpactStats, type PublicImpactData } from "../lib/api";

export function PublicImpactPage() {
  const [data, setData] = useState<PublicImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchPublicImpactStats();
    setData(result);
    setLastRefreshed(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
    // Auto-refresco cada 60 segundos en el cliente
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-primary/10 via-card/50 to-background border-b border-border/50 pt-8 pb-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="max-w-6xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-wider uppercase">
            <Sparkles className="size-3.5" /> Transparencia de Impacto en Tiempo Real
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-nunito tracking-tight text-foreground">
                Estadísticas de Impacto NutriCRED
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl font-medium">
                Todo lo que NutriCRED mide sobre su alcance nutricional y comunitario en abierto. Calculado directamente por el servidor sin intermediarios.
              </p>
            </div>

            <button
              onClick={loadStats}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border text-sm font-bold shadow-sm hover:bg-muted transition-all cursor-pointer shrink-0 w-full sm:w-auto min-h-[44px] touch-manipulation active:scale-[0.98]"
            >
              <RefreshCw className={`size-4 text-primary ${loading ? "animate-spin" : ""}`} />
              <span>Actualizar ahora</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground pt-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Se recala cada 15 minutos en el servidor
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> Última actualización: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 font-black">
              <Baby className="size-6" />
            </div>
            <p className="text-3xl font-black font-nunito tracking-tight text-foreground">
              {data ? data.impactMetrics.totalChildrenMonitored.toLocaleString() : "..."}
            </p>
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mt-1">Niños Monitoreados</p>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-2">En seguimiento activo de salud y crecimiento</p>
          </div>

          <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 font-black">
              <Activity className="size-6" />
            </div>
            <p className="text-3xl font-black font-nunito tracking-tight text-foreground">
              {data ? data.impactMetrics.totalMeasurements.toLocaleString() : "..."}
            </p>
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mt-1">Controles Antropométricos</p>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-2">Mediciones de Peso, Talla y MUAC en casa</p>
          </div>

          <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 font-black">
              <HeartPulse className="size-6" />
            </div>
            <p className="text-3xl font-black font-nunito tracking-tight text-foreground">
              {data ? data.impactMetrics.alertsResolved.toLocaleString() : "..."}
            </p>
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mt-1">Alertas Atendidas</p>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-2">Casos priorizados y derivados por el equipo CRED</p>
          </div>

          <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-violet-500/40 transition-all">
            <div className="size-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-4 font-black">
              <Users className="size-6" />
            </div>
            <p className="text-3xl font-black font-nunito tracking-tight text-foreground">
              {data ? data.impactMetrics.fieldVisitsCompleted.toLocaleString() : "..."}
            </p>
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mt-1">Visitas en Campo</p>
            <p className="text-[11px] font-medium text-muted-foreground/80 mt-2">Realizadas por actores sociales comunitarios</p>
          </div>

        </div>

        {/* Live Activity Feed & Regional Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Feed de Actividad Anonimizada */}
          <div className="lg:col-span-2 bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2.5rem] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Activity className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg leading-tight font-nunito">Actividad Comunitaria en Vivo</h3>
                  <p className="text-xs font-semibold text-muted-foreground">Últimos eventos anonimizados · Se actualiza en tiempo real</p>
                </div>
              </div>
              <span className="size-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-3 pt-2">
              {data?.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="bg-muted/40 hover:bg-muted/80 border border-border/50 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                      {act.type === "visit" && <Users className="size-4 text-violet-500" />}
                      {act.type === "measurement" && <Activity className="size-4 text-emerald-500" />}
                      {act.type === "alert" && <HeartPulse className="size-4 text-red-500" />}
                      {act.type === "nutrition" && <Sparkles className="size-4 text-amber-500" />}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                      {act.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap shrink-0">
                    {act.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Canales & Dispositivos */}
          <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2.5rem] p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-600">
                  <Smartphone className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg leading-tight font-nunito">Acceso por Dispositivo</h3>
                  <p className="text-xs font-semibold text-muted-foreground">Plataformas de uso continuo</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {data?.deviceBreakdown.map((dev, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground">{dev.device}</span>
                      <span className="text-primary font-black">{dev.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${dev.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-xs font-medium text-muted-foreground leading-relaxed mt-4">
              💡 <strong className="text-foreground font-bold">PWA Móvil:</strong> El 78% de los registros proviene de teléfonos móviles en zonas comunitarias sin necesidad de conexión a internet permanente.
            </div>
          </div>

        </div>

        {/* Regional Distribution */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
              <MapPin className="size-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-xl leading-tight font-nunito">Distribución Territorial (Perú)</h3>
              <p className="text-xs font-semibold text-muted-foreground">Monitoreo activo en comunidades rurales y periurbanas de Costa, Sierra y Selva</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.regionalDistribution.map((reg, idx) => (
              <div key={idx} className="bg-muted/40 border border-border/50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-foreground flex items-center gap-2">
                    <Globe className="size-4 text-emerald-500" /> {reg.region}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">{reg.percentage}% ({reg.count} niños)</span>
                </div>
                <div className="w-full h-3 bg-card border border-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${reg.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Transparency Guarantee Footer Card */}
        <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-foreground text-lg font-nunito">Garantía de Privacidad por Diseño (Privacy by Design)</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {data?.privacyNote}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-foreground pt-2">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> Sin Cookies de Rastreo Comercial
                </span>
                <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="size-4" /> Cumplimiento Ley N° 29733 (Perú)
                </span>
                <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400">
                  <CheckCircle2 className="size-4" /> Analítica de Primera Parte Directa
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
