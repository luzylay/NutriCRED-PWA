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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { AlertBadge } from "../components/shared/AlertBadge";
import { ZScoreBar } from "../components/shared/ZScoreBar";
import { GrowthChart } from "../components/shared/GrowthChart";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
import { fetchMeasurements } from "../lib/api";
import { getWHORef } from "../lib/who-refs";
import { ALERT_CFG } from "../lib/constants";
import type { Child, AlertLevel, GrowthPoint } from "../lib/types";

export default function ProfessionalPage() {
  const { user, logout } = useAuth();
  const { children, auditLogs, isLoading, refreshData } = useData();

  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [filter, setFilter] = useState<AlertLevel | "all">("all");
  const [childMeasurements, setChildMeasurements] = useState<GrowthPoint[]>([]);

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
            selectedChild.sex
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

  const filtered =
    filter === "all" ? children : children.filter((c) => c.status === filter);

  const counts = {
    total: children.length,
    normal: children.filter((c) => c.status === "normal").length,
    followUp: children.filter((c) => c.status === "follow-up").length,
    urgent: children.filter((c) => c.status === "urgent").length,
  };

  const { t, languageInfo } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <div className="min-h-screen bg-gradient-flow relative">
        {/* Background container to prevent scrollbars from blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Baby className="size-5 text-white" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                  Yanapiri Wawa
                </span>
                <span
                  className="font-extrabold text-foreground font-nunito"
                >
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


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Niños", value: counts.total, icon: Users, bg: "bg-card", text: "text-foreground" },
            { label: "Normales", value: counts.normal, icon: CheckCircle, bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-600 dark:text-emerald-400" },
            { label: "En Seguimiento", value: counts.followUp, icon: Clock, bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-600 dark:text-amber-400" },
            { label: "Urgentes", value: counts.urgent, icon: AlertCircle, bg: "bg-red-50 dark:bg-red-950/20", text: "text-red-600 dark:text-red-400" },
          ].map((kpi) => (
            <div key={kpi.label} className={`${kpi.bg} border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm`}>
              <kpi.icon className={`size-7 ${kpi.text}`} />
              <div>
                <p className={`text-3xl font-extrabold ${kpi.text}`} style={{ fontFamily: "Nunito, sans-serif" }}>
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace split */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Priority list */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-extrabold text-foreground font-nunito">
                Filtro de Casos
              </h2>
              <div className="flex gap-1 bg-muted p-1 rounded-xl">
                {[
                  { id: "all" as const, label: "Todos", icon: null },
                  { id: "urgent" as const, label: "Urgente", icon: AlertCircle, color: "text-red-500" },
                  { id: "follow-up" as const, label: "Seguimiento", icon: Clock, color: "text-amber-500" },
                  { id: "normal" as const, label: "Normal", icon: CheckCircle, color: "text-emerald-500" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filter === f.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.icon && <f.icon className={`size-3.5 ${f.color}`} />}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border overflow-y-auto max-h-[500px]">
              {filtered.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">No hay registros</p>
                  <p className="text-xs text-muted-foreground mt-1">No se encontraron niños para este filtro.</p>
                </div>
              )}
              {filtered.map((child, index) => {
                const isSelected = selectedChild?.id === child.id;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`w-full text-left px-5 py-4 flex items-center gap-3.5 transition-all hover:bg-muted/20 ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="font-mono text-xs text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <span className={`size-2.5 rounded-full shrink-0 ${ALERT_CFG[child.status].dotClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{child.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {child.age} · {child.community}, {child.district}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-bold text-foreground">
                        {child.zScore ? `Z = ${child.zScore}` : "S/Z"}
                      </p>
                      <p className="text-xs text-muted-foreground">{child.lastMeasured}</p>
                    </div>
                    <AlertBadge level={child.status} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child detail sheet */}
          {selectedChild && (
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg">
                  {selectedChild.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-foreground truncate font-nunito">
                    {selectedChild.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChild.age} · {selectedChild.sex === "M" ? "Masculino" : "Femenino"}
                  </p>
                </div>
                <AlertBadge level={selectedChild.status} size="md" />
              </div>

              <div className="p-5 overflow-y-auto space-y-4 max-h-[500px]">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Puntaje Z Peso-para-Edad (OMS)
                  </p>
                  <ZScoreBar zscore={selectedChild.zScore} />
                </div>

                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Curva de peso vs referencias OMS
                  </p>
                  <div className="bg-muted/10 border rounded-2xl p-2 min-w-0">
                    <GrowthChart data={childMeasurements} height={140} />
                  </div>
                </div>

                {selectedChild.status !== "normal" && (
                  <div
                    className={`rounded-2xl border p-4 space-y-1.5 ${ALERT_CFG[selectedChild.status].bgClass} ${ALERT_CFG[selectedChild.status].borderClass}`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${ALERT_CFG[selectedChild.status].textClass}`}>
                      Señal de alerta activa
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/90">
                      Z-score actual = {selectedChild.zScore}. Representa una caída por
                      debajo de las 2 desviaciones estándar de la referencia oficial de
                      crecimiento.
                    </p>
                    <div className="flex items-start gap-1.5 pt-1">
                      <Shield className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-normal">
                        Referencia: Norma Técnica de Salud CRED MINSA (NTS 137) / Estándares OMS.
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-secondary/60 rounded-2xl px-4 py-3 border">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                    Acción sugerida para Actor Social
                  </p>
                  <p className="text-xs font-bold text-foreground">{selectedChild.nextAction}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="size-3 shrink-0" />
                    Comunidad de {selectedChild.community}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit logs */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <h3 className="font-extrabold text-foreground font-nunito">
              Bitácora de Auditoría Clínica (Ley N.º 29733)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-xs uppercase font-bold text-muted-foreground">
                  <th className="pb-2">Fecha y Hora</th>
                  <th className="pb-2">Operador ID</th>
                  <th className="pb-2">Acción Registrada</th>
                  <th className="pb-2">Tabla Afectada</th>
                  <th className="pb-2">Registro ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {auditLogs.slice(0, 5).map((log, i) => (
                  <tr key={i} className="text-muted-foreground hover:text-foreground">
                    <td className="py-2.5 font-mono">
                      {new Date(log.timestamp).toLocaleString("es-PE")}
                    </td>
                    <td className="py-2.5 font-mono">user_id_{log.user_id}</td>
                    <td className="py-2.5 font-semibold text-foreground">{log.action}</td>
                    <td className="py-2.5">{log.table_affected ?? "—"}</td>
                    <td className="py-2.5 font-mono">{log.record_id ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}


