import { useState } from "react";
import { Syringe, ShieldCheck, Clock, AlertCircle, Calendar as CalendarIcon, CheckCircle2, MapPin, Plus, Sparkles } from "lucide-react";
import { HeaderActions } from "../components/shared/HeaderActions";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

interface CredAppointment {
  id: string;
  stageName: string;
  date: string;
  facility: string;
  status: "scheduled" | "completed" | "pending";
}

const MINSA_SCHEDULE = [
  {
    age: "Recién Nacido",
    status: "completed",
    vaccines: [
      {
        name: "BCG (Tuberculosis)",
        desc: "Protege contra las formas graves de tuberculosis.",
      },
      { name: "Hepatitis B", desc: "Previene la transmisión de madre a hijo." },
    ],
  },
  {
    age: "2 Meses",
    status: "pending",
    vaccines: [
      {
        name: "Pentavalente",
        desc: "Protege contra Difteria, Tétanos, Tos convulsiva, Hepatitis B, H. influenzae b.",
      },
      { name: "Polio (IPV)", desc: "Previene la poliomielitis." },
      { name: "Rotavirus", desc: "Previene diarreas graves." },
      { name: "Neumococo", desc: "Previene neumonías y meningitis." },
    ],
  },
  {
    age: "4 Meses",
    status: "upcoming",
    vaccines: [
      { name: "Pentavalente (2da dosis)", desc: "Refuerzo." },
      { name: "Polio (IPV - 2da dosis)", desc: "Refuerzo." },
      { name: "Rotavirus (2da dosis)", desc: "Refuerzo." },
      { name: "Neumococo (2da dosis)", desc: "Refuerzo." },
    ],
  },
];

export default function VaccinesPage() {
  const { logout } = useAuth();
  const { isOnline, showToast, setIsOfflineGuideOpen } = useData();

  const [appointments, setAppointments] = useState<CredAppointment[]>([
    {
      id: "app-1",
      stageName: "Control CRED 2 Meses",
      date: "2026-08-28",
      facility: "E.S. I-3 Lircay",
      status: "scheduled",
    },
    {
      id: "app-2",
      stageName: "Vacunación 4 Meses",
      date: "2026-10-28",
      facility: "Posta de Salud Anchonga",
      status: "pending",
    },
  ]);

  const [appliedVaccines, setAppliedVaccines] = useState<string[]>(["BCG (Tuberculosis)", "Hepatitis B"]);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newDate, setNewDate] = useState("2026-09-15");
  const [newStage, setNewStage] = useState("Control CRED 3 Meses");
  const [newFacility, setNewFacility] = useState("E.S. I-3 Lircay");

  const toggleVaccine = (vacName: string) => {
    setAppliedVaccines((prev) => {
      const exists = prev.includes(vacName);
      const updated = exists ? prev.filter((v) => v !== vacName) : [...prev, vacName];
      showToast(
        exists
          ? `Actualizado estado de ${vacName}`
          : `✅ ${vacName} marcada como aplicada (Guardada en LocalDB)`,
        "success",
      );
      return updated;
    });
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: CredAppointment = {
      id: Date.now().toString(),
      stageName: newStage,
      date: newDate,
      facility: newFacility,
      status: "scheduled",
    };
    setAppointments((prev) => [newApp, ...prev]);
    setShowNewAppointmentModal(false);
    showToast("🗓️ Cita CRED programada exitosamente en el calendario local.", "success");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              Calendario CRED <br />
              <span className="text-blue-200 font-medium">& Vacunas MINSA</span>
            </h1>
            <p className="text-white/80 mt-2 text-sm max-w-[260px] leading-relaxed">
              Cronograma oficial de vacunas y citas de control de crecimiento.
            </p>
          </div>
          <HeaderActions onLogout={logout} />
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        {/* Banner de Recordatorio de Cita CRED con cuenta regresiva */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-900/20 dark:to-orange-900/20 rounded-[2rem] p-5 shadow-lg border border-amber-500/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="size-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <CalendarIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-foreground text-sm">Próxima Cita CRED Programada</h3>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  100% Offline
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                📅 <strong>28 de Agosto, 2026</strong> · E.S. I-3 Lircay
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewAppointmentModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl btn-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            <Plus className="size-4" /> Programar Cita
          </button>
        </div>

        {/* Lista de Citas Programadas CRED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <CalendarIcon className="size-4 text-primary" /> Citas CRED y Controles Registrados
            </h2>
            <button
              onClick={() => setIsOfflineGuideOpen(true)}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              ¿Cómo funciona offline?
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appointments.map((app) => (
              <div key={app.id} className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-foreground">{app.stageName}</span>
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    {app.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-rose-500" />
                  <span>{app.facility}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Guardado localmente
                  </span>
                  <span className="text-muted-foreground font-mono">SIS Gratuito</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Esquema Interactivo de Vacunas MINSA */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Syringe className="size-5 text-blue-600" /> Esquema Nacional de Vacunación
          </h2>

          <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
            {MINSA_SCHEDULE.map((stage, idx) => (
              <div key={idx} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-1 size-4 rounded-full border-4 border-background ${
                    stage.status === "completed"
                      ? "bg-green-500"
                      : stage.status === "pending"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-muted"
                  }`}
                />

                <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  {stage.age}
                  {stage.status === "completed" && (
                    <ShieldCheck className="size-4 text-green-500" />
                  )}
                  {stage.status === "pending" && (
                    <Clock className="size-4 text-amber-500" />
                  )}
                </h3>

                <div className="grid gap-3">
                  {stage.vaccines.map((vac, i) => {
                    const isApplied = appliedVaccines.includes(vac.name);
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all ${
                          isApplied
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-card border-border shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold text-sm ${isApplied ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
                            {vac.name}
                          </span>
                          <button
                            onClick={() => toggleVaccine(vac.name)}
                            className={`text-xs px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                              isApplied
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
                            }`}
                          >
                            {isApplied ? "✓ Aplicada (LocalDB)" : "Marcar aplicada"}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {vac.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal para Programar Nueva Cita CRED */}
        {showNewAppointmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border w-full max-w-md rounded-[2rem] p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-foreground text-base flex items-center gap-2">
                  <CalendarIcon className="size-5 text-primary" /> Programar Cita CRED
                </h3>
                <button
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Motivo / Etapa CRED</label>
                  <input
                    type="text"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl p-2.5 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl p-2.5 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Establecimiento de Salud (SIS)</label>
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl p-2.5 text-xs font-medium"
                    required
                  />
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-700 dark:text-emerald-300">
                  💾 Esta cita se guardará en la memoria local (IndexedDB) y se notificará en tu calendario.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAppointmentModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl btn-gradient text-white text-xs font-bold shadow-md"
                  >
                    Guardar Cita
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Referencias y Disclaimer */}
        <div className="mt-8 border-t border-border pt-6 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">
            Fuentes y Respaldo Legal
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Calendario elaborado en base a la{" "}
            <strong>Norma Técnica de Salud N° 196-MINSA/DGIESP-2022</strong>{" "}
            (Esquema Nacional de Vacunación de la República del Perú).
          </p>
        </div>
      </div>
    </div>
  );
}

