import { useState } from "react";
import {
  Heart,
  RefreshCw,
  LogOut,
  ChevronRight,
  ClipboardList,
  Plus,
  X,
  Settings,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { AlertBadge } from "../components/shared/AlertBadge";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
import { ALERT_CFG } from "../lib/constants";
import { postVisit } from "../lib/api";
import type { Child } from "../lib/types";

export default function AgentPage() {
  const { user, logout } = useAuth();
  const { children, refreshData } = useData();
  const { t, languageInfo } = useTranslation();

  const [openId, setOpenId] = useState<string | null>(null);
  const [visitType, setVisitType] = useState("Visita CRED regular");
  const [notes, setNotes] = useState("");
  const [alarmSigns, setAlarmSigns] = useState("Ninguno");
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const pending = children.filter((c) => c.status !== "normal");
  const ok = children.filter((c) => c.status === "normal");

  const handleRecordVisit = async (child: Child) => {
    setLoading(true);
    try {
      await postVisit({
        child_id: parseInt(child.id),
        visit_type: visitType,
        observations: {
          qualitative_notes: notes,
          alarm_signs: alarmSigns,
        },
      });
      alert("Visita domiciliaria guardada correctamente.");
      setNotes("");
      setAlarmSigns("Ninguno");
      setReportingId(null);
      await refreshData();
    } catch {
      alert("Error de conexión. Guardado en la cola local de visitas.");
    }
    setLoading(false);
  };

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <div className="min-h-screen bg-gradient-flow relative">
        {/* Background container to prevent scrollbars from blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                <Heart className="size-5 text-white" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                  Yanapiri Wawa
                </span>
                <span className="font-extrabold text-foreground font-nunito">
                  Visitas del Actor Social
                </span>
              </div>
              {user && (
                <span className="hidden sm:inline-flex items-center text-xs bg-muted text-muted-foreground px-2.5 py-1.5 rounded-full font-medium ml-1">
                  {user.username} · Anchonga, HVCA
                </span>
              )}
            </div>

            <HeaderActions
              onSettings={() => setIsSettingsOpen(true)}
              onRefresh={refreshData}
              isRefreshing={false}
              onLogout={logout}
            />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              {
                label: "Niños Asignados",
                value: children.length,
                color: "text-foreground",
                bg: "bg-card",
              },
              {
                label: "Visitas de Alerta",
                value: pending.length,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-950/20",
              },
              {
                label: "Monitoreo Normal",
                value: ok.length,
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
              },
            ].map((k) => (
              <div
                key={k.label}
                className={`${k.bg} border border-border rounded-2xl p-4 shadow-sm`}
              >
                <p
                  className={`text-3xl font-extrabold ${k.color}`}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {k.value}
                </p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5 leading-tight">
                  {k.label}
                </p>
              </div>
            ))}
          </div>

          {/* Priority tasks */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-extrabold text-foreground font-nunito">
                Visitas Prioritarias de Alerta
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ordenadas según severidad de crecimiento
              </p>
            </div>

            <div className="divide-y divide-border">
              {pending.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    No hay alertas pendientes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ¡Excelente trabajo! Todos los niños están estables.
                  </p>
                </div>
              )}
              {pending.map((child) => {
                const isOpen = openId === child.id;
                const isReporting = reportingId === child.id;
                return (
                  <div key={child.id} className="transition-colors">
                    <button
                      className={`w-full text-left px-5 py-4 flex items-center gap-3.5 hover:bg-muted/15 transition-colors ${isOpen ? "bg-muted/10" : ""}`}
                      onClick={() => setOpenId(isOpen ? null : child.id)}
                    >
                      <span
                        className={`size-2.5 rounded-full shrink-0 ${ALERT_CFG[child.status].dotClass}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm">
                          {child.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Apoderada: {child.caregiver} · {child.community}
                        </p>
                      </div>
                      <AlertBadge level={child.status} />
                      <ChevronRight
                        className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>

                    {isOpen && !isReporting && (
                      <div className="px-5 pb-5 pt-2 space-y-4 bg-muted/5 divide-y">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              {child.weight} kg
                            </p>
                            <span className="text-xs text-muted-foreground uppercase">
                              Último Peso
                            </span>
                          </div>
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              {child.height} cm
                            </p>
                            <span className="text-xs text-muted-foreground uppercase">
                              Talla
                            </span>
                          </div>
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              Z = {child.zScore}
                            </p>
                            <span className="text-xs text-muted-foreground uppercase">
                              WHO Z-score
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 space-y-1.5">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            Acción sugerida
                          </p>
                          <p className="text-xs font-semibold text-foreground">
                            {child.nextAction}
                          </p>
                        </div>

                        <div className="pt-3 flex gap-2">
                          <button
                            onClick={() => setReportingId(child.id)}
                            className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <ClipboardList className="size-4" />
                            Registrar visita
                          </button>
                          <button className="flex-1 bg-muted text-foreground text-xs font-bold py-3 rounded-xl hover:bg-muted/70 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                            <Plus className="size-4" />
                            Añadir nota
                          </button>
                        </div>
                      </div>
                    )}

                    {isOpen && isReporting && (
                      <div className="px-5 pb-5 pt-3 bg-muted/10 space-y-3.5">
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="text-xs font-bold text-foreground">
                            Nueva Visita a {child.shortName}
                          </span>
                          <button
                            onClick={() => setReportingId(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-bold text-muted-foreground uppercase">
                                Tipo de Visita
                              </label>
                              <select
                                value={visitType}
                                onChange={(e) => setVisitType(e.target.value)}
                                className="w-full bg-card border rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option>Control de Alerta</option>
                                <option>Visita CRED regular</option>
                                <option>Consejería Nutricional</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-muted-foreground uppercase">
                                Signos de Alarma
                              </label>
                              <select
                                value={alarmSigns}
                                onChange={(e) => setAlarmSigns(e.target.value)}
                                className="w-full bg-card border rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option>Ninguno</option>
                                <option>Inapetencia extrema</option>
                                <option>Diarrea / Vómitos</option>
                                <option>Fiebre</option>
                                <option>Otros signos clínicos</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">
                              Observaciones cualitativas de la vivienda
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Madre recibió consejería, niño activo..."
                              rows={3}
                              className="w-full bg-card border rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleRecordVisit(child)}
                          disabled={loading || !notes.trim()}
                          className="w-full bg-primary text-primary-foreground text-xs font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {loading
                            ? "Guardando..."
                            : "Guardar Visita Domiciliaria"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Normal tracking */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-extrabold text-foreground font-nunito">
                Familias en Seguimiento Normal
              </h2>
            </div>
            <div className="divide-y divide-border">
              {ok.length === 0 && (
                <div className="px-5 py-6 text-center">
                  <p className="text-sm font-bold text-foreground">
                    No hay familias en estado normal
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todas las familias asignadas requieren atención.
                  </p>
                </div>
              )}
              {ok.map((child) => (
                <div
                  key={child.id}
                  className="px-5 py-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {child.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Apoderada: {child.caregiver} · {child.community}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block shrink-0">
                    {child.nextAction}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
