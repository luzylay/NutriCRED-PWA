import { useState } from "react";
import {
  Heart,
  ChevronRight,
  ClipboardList,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "../contexts/LanguageContext";
import { AlertBadge } from "../components/shared/AlertBadge";
import { SettingsModal } from "../components/shared/SettingsModal";
import { HeaderActions } from "../components/shared/HeaderActions";
import { ToastContainer, useToast } from "../components/shared/Toast";
import { ALERT_CFG } from "../lib/constants";
import { postVisit } from "../lib/api";
import type { Child } from "../lib/types";

export default function AgentPage() {
  const { user, logout } = useAuth();
  const { children, refreshData, isLoading } = useData();
  const { t } = useTranslation();
  const toast = useToast();

  const [openId, setOpenId] = useState<string | null>(null);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [visitType, setVisitType] = useState("Visita CRED regular");
  const [notes, setNotes] = useState("");
  const [alarmSigns, setAlarmSigns] = useState("Ninguno");
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
      toast.success(
        "Visita guardada",
        `La visita domiciliaria de ${child.shortName} se registró correctamente.`
      );
      setNotes("");
      setAlarmSigns("Ninguno");
      setReportingId(null);
      setOpenId(null);
      await refreshData();
    } catch {
      toast.error(
        "Sin conexión",
        "La visita se guardó en la cola local y se enviará cuando haya conexión."
      );
    }
    setLoading(false);
  };

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Toast system */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />

      <div className="min-h-screen bg-gradient-flow relative">
        {/* Background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        </div>

        {/* Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-xl bg-accent flex items-center justify-center shadow-sm shrink-0">
                <Heart className="size-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">
                  Yanapiri Wawa
                </span>
                <span className="font-extrabold text-foreground font-nunito truncate block">
                  Visitas del Actor Social
                </span>
              </div>
              {user && (
                <span className="hidden sm:inline-flex items-center text-xs bg-muted text-muted-foreground px-2.5 py-1.5 rounded-full font-medium shrink-0">
                  {user.username} · Anchonga
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* KPIs — siempre 3 columnas, compacto en móvil */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              {
                label: "Asignados",
                value: children.length,
                color: "text-foreground",
                bg: "bg-card",
              },
              {
                label: "Alertas",
                value: pending.length,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-950/20",
              },
              {
                label: "Normales",
                value: ok.length,
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
              },
            ].map((k) => (
              <div
                key={k.label}
                className={`${k.bg} border border-border rounded-2xl p-3 shadow-sm`}
              >
                <p
                  className={`text-2xl font-extrabold ${k.color} font-nunito`}
                >
                  {k.value}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5 leading-tight">
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
                    {/* Row button — touch target mínimo 44px */}
                    <button
                      className={`w-full text-left px-5 py-4 min-h-[56px] flex items-center gap-3.5 hover:bg-muted/15 transition-colors touch-manipulation ${isOpen ? "bg-muted/10" : ""}`}
                      onClick={() => setOpenId(isOpen ? null : child.id)}
                    >
                      <span
                        className={`size-2.5 rounded-full shrink-0 ${ALERT_CFG[child.status].dotClass}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">
                          {child.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Apoderada: {child.caregiver} · {child.community}
                        </p>
                      </div>
                      <AlertBadge level={child.status} />
                      <ChevronRight
                        className={`size-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>

                    {/* Detail panel */}
                    {isOpen && !isReporting && (
                      <div className="px-5 pb-5 pt-2 space-y-4 bg-muted/5">
                        {/* Metrics — 3 cols siempre */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              {child.weight} kg
                            </p>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Peso
                            </span>
                          </div>
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              {child.height} cm
                            </p>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Talla
                            </span>
                          </div>
                          <div className="bg-card border rounded-xl p-2.5 text-center">
                            <p className="text-sm font-mono font-bold text-foreground">
                              Z={child.zScore}
                            </p>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Z-score
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            Acción sugerida
                          </p>
                          <p className="text-xs font-semibold text-foreground leading-relaxed">
                            {child.nextAction}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setReportingId(child.id)}
                            className="flex-1 bg-primary text-primary-foreground text-xs font-bold min-h-[44px] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer touch-manipulation"
                          >
                            <ClipboardList className="size-4" />
                            Registrar visita
                          </button>
                          <button className="flex-1 bg-muted text-foreground text-xs font-bold min-h-[44px] rounded-xl hover:bg-muted/70 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation">
                            <Plus className="size-4" />
                            Añadir nota
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Visit form */}
                    {isOpen && isReporting && (
                      <div className="px-5 pb-5 pt-3 bg-muted/10 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-sm font-bold text-foreground">
                            Nueva Visita · {child.shortName}
                          </span>
                          <button
                            onClick={() => setReportingId(null)}
                            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors touch-manipulation"
                            aria-label="Cancelar"
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label
                                htmlFor={`visit-type-${child.id}`}
                                className="text-xs font-bold text-muted-foreground uppercase"
                              >
                                Tipo de Visita
                              </label>
                              <select
                                id={`visit-type-${child.id}`}
                                value={visitType}
                                onChange={(e) => setVisitType(e.target.value)}
                                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] touch-manipulation"
                              >
                                <option>Control de Alerta</option>
                                <option>Visita CRED regular</option>
                                <option>Consejería Nutricional</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label
                                htmlFor={`alarm-signs-${child.id}`}
                                className="text-xs font-bold text-muted-foreground uppercase"
                              >
                                Signos de Alarma
                              </label>
                              <select
                                id={`alarm-signs-${child.id}`}
                                value={alarmSigns}
                                onChange={(e) => setAlarmSigns(e.target.value)}
                                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] touch-manipulation"
                              >
                                <option>Ninguno</option>
                                <option>Inapetencia extrema</option>
                                <option>Diarrea / Vómitos</option>
                                <option>Fiebre</option>
                                <option>Otros signos clínicos</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label
                              htmlFor={`notes-${child.id}`}
                              className="text-xs font-bold text-muted-foreground uppercase"
                            >
                              Observaciones de la vivienda
                            </label>
                            <textarea
                              id={`notes-${child.id}`}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Madre recibió consejería, niño activo..."
                              rows={3}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleRecordVisit(child)}
                          disabled={loading || !notes.trim()}
                          className="w-full bg-primary text-primary-foreground text-sm font-bold min-h-[48px] rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation shadow-sm"
                        >
                          {loading ? (
                            <span className="animate-pulse">Guardando...</span>
                          ) : (
                            <>
                              <ClipboardList className="size-4" />
                              Guardar Visita Domiciliaria
                            </>
                          )}
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
                  className="px-5 py-4 flex items-center justify-between gap-3 min-h-[56px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">
                        {child.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Apoderada: {child.caregiver} · {child.community}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block shrink-0 text-right max-w-[140px] leading-tight">
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
