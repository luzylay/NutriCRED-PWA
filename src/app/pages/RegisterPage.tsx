import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Baby,
  UserPlus,
  ArrowLeft,
  User,
  Calendar,
  Scale,
  Ruler,
  CreditCard,
  ArrowRight,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/LanguageContext";
import { getWHORef } from "../lib/who-refs";
import { Navigate } from "react-router";
import { ROLE_TO_ROUTE } from "../lib/constants";

export default function RegisterPage() {
  const { registerCaregiver, isLoggedIn, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  if (isLoggedIn && user) {
    return <Navigate to={ROLE_TO_ROUTE[user.role] ?? "/familia"} replace />;
  }

  // Form state
  const [caregiverName, setCaregiverName] = useState("");
  const [dni, setDni] = useState("");
  const [childName, setChildName] = useState("");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const combinedBirthDate = birthYear && birthMonth && birthDay
    ? `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
    : "";

  const getDaysInMonth = (monthStr: string, yearStr: string) => {
    const m = parseInt(monthStr, 10);
    const y = parseInt(yearStr, 10);
    if (isNaN(m)) return 31;
    if (m === 2) {
      if (!isNaN(y) && ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) {
        return 29;
      }
      return 28;
    }
    if ([4, 6, 9, 11].includes(m)) return 30;
    return 31;
  };

  const maxDays = getDaysInMonth(birthMonth, birthYear);

  // Clamps birthDay if month has fewer days than current selected day
  useEffect(() => {
    if (birthDay && parseInt(birthDay, 10) > maxDays) {
      setBirthDay(String(maxDays));
    }
  }, [birthMonth, birthYear, birthDay, maxDays]);

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    if (!caregiverName.trim()) {
      setError("Por favor ingresa tu nombre completo.");
      return;
    }
    if (dni.trim().length !== 8) {
      setError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    setStep(2);
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!childName.trim()) {
      setError("Por favor ingresa el nombre de tu niño(a).");
      return;
    }
    if (!combinedBirthDate) {
      setError("Por favor selecciona la fecha de nacimiento.");
      return;
    }

    setLoading(true);

    try {
      const bDate = new Date(combinedBirthDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - bDate.getTime());
      const ageMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

      if (ageMonths < 0 || ageMonths > 60) {
        throw new Error("El niño debe tener entre 0 y 5 años (60 meses).");
      }

      const weightNum = weight ? parseFloat(weight) : 0;
      const heightNum = height ? parseFloat(height) : 0;
      
      let zScore = 0;
      let status: "normal" | "follow-up" | "urgent" = "normal";

      if (weightNum > 0 && heightNum > 0) {
        const [median, sd] = getWHORef(ageMonths, sex);
        zScore = parseFloat(((weightNum - median) / sd).toFixed(2));
        if (zScore < -3) status = "urgent";
        else if (zScore < -2) status = "follow-up";
      }

      if (registerCaregiver) {
        await registerCaregiver({
          caregiverDni: dni,
          caregiverName,
          childName,
          childSex: sex,
          childAgeMonths: ageMonths,
          childWeight: weightNum,
          childHeight: heightNum,
          childZScore: zScore,
          childStatus: status,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar. Intenta de nuevo.";
      setError(msg);
      setLoading(false);
    }
  };

  const getAgeInMonths = (dateStr: string) => {
    if (!dateStr) return null;
    const bDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - bDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  };

  const caregiverValid = caregiverName.trim().length > 0 && dni.trim().length === 8;

  return (
    <div className="min-h-screen bg-gradient-flow flex flex-col items-center py-4 px-3 sm:px-4 relative overflow-hidden select-none">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in duration-500">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          Volver al Inicio
        </button>

        <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl bg-card/95 border border-border/50">
          {/* Header */}
          <div className="text-center space-y-1.5 mb-4 sm:mb-5">
            <div className="size-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-md text-white">
              <UserPlus className="size-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-foreground font-nunito tracking-tight">
              Registro Familiar
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed font-semibold max-w-[280px] mx-auto">
              Únete a Yanapiri Wawa y monitorea el crecimiento saludable de tu niño(a).
            </p>

            {/* Stepper progress */}
            <div className="flex items-center justify-center gap-1.5 pt-1.5">
              <span className={`h-1 rounded-full transition-all duration-300 ${step === 1 ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
              <span className={`h-1 rounded-full transition-all duration-300 ${step === 2 ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* STEP 1: CAREGIVER INFO */}
            {step === 1 && (
              <div className="space-y-3.5 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <h3 className="text-xs sm:text-sm font-black text-primary flex items-center gap-1.5 mb-0.5">
                    <User className="size-3.5" /> Paso 1: Tus Datos
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Ingresa tu información como mamá, papá o apoderado legal.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-foreground pl-0.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={caregiverName}
                      onChange={(e) => setCaregiverName(e.target.value)}
                      className="w-full bg-input-background border border-border rounded-xl pl-10 pr-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold min-h-[44px]"
                      placeholder="Ej. María Quispe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-foreground pl-0.5">
                    DNI (Documento de Identidad)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      maxLength={8}
                      pattern="\d*"
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-input-background border border-border rounded-xl pl-10 pr-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-mono font-bold min-h-[44px]"
                      placeholder="8 dígitos"
                      required
                    />
                  </div>
                  <span className="text-xs text-muted-foreground/80 pl-0.5 block font-bold leading-tight">
                    Requerido para el carnet de vacunación y CRED.
                  </span>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-600 dark:text-rose-400 font-bold">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!caregiverValid}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-md shadow-primary/25 btn-gradient transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation"
                  >
                    Siguiente paso <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHILD INFO */}
            {step === 2 && (
              <div className="space-y-3.5 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-accent/5 p-3 rounded-xl border border-accent/10">
                  <h3 className="text-xs sm:text-sm font-black text-accent flex items-center gap-1.5 mb-0.5">
                    <Baby className="size-4" /> Paso 2: Datos de tu Bebé
                  </h3>
                  <p className="text-xs text-muted-foreground font-bold">
                    Registra los datos de crecimiento de tu niño(a).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-foreground pl-0.5">
                    Nombre del Niño(a)
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full bg-input-background border border-border rounded-xl pl-10 pr-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold min-h-[44px]"
                      placeholder="Ej. Mateo"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-foreground pl-0.5">
                    Sexo del Bebé
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSex("M")}
                      className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 font-black text-sm transition-all cursor-pointer min-h-[44px] touch-manipulation ${
                        sex === "M"
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      👦 Niño
                    </button>
                    <button
                      type="button"
                      onClick={() => setSex("F")}
                      className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 font-black text-sm transition-all cursor-pointer min-h-[44px] touch-manipulation ${
                        sex === "F"
                          ? "border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-400"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      👧 Niña
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-foreground pl-0.5">
                    Fecha de Nacimiento (Día / Mes / Año)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Día */}
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="bg-input-background border border-border rounded-xl px-2 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold cursor-pointer min-h-[44px]"
                      required
                    >
                      <option value="">Día</option>
                      {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {/* Mes */}
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="bg-input-background border border-border rounded-xl px-2 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold cursor-pointer min-h-[44px]"
                      required
                    >
                      <option value="">Mes</option>
                      {[
                        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
                      ].map((m, idx) => (
                        <option key={idx} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {/* Año */}
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="bg-input-background border border-border rounded-xl px-2 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold cursor-pointer min-h-[44px]"
                      required
                    >
                      <option value="">Año</option>
                      {Array.from({ length: 7 }, (_, i) => 2026 - i).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {combinedBirthDate && (() => {
                    const months = getAgeInMonths(combinedBirthDate);
                    if (months === null || isNaN(months)) return null;
                    if (months < 0 || months > 60) {
                      return (
                        <span className="text-xs font-black text-rose-600 bg-rose-600/10 px-2.5 py-1 rounded-full mt-1 inline-block border border-rose-500/10 animate-pulse">
                          ⚠️ Debe tener de 0 a 5 años (máx 60 meses)
                        </span>
                      );
                    }
                    return (
                      <span className="text-xs font-black text-emerald-600 bg-emerald-600/10 px-2.5 py-1 rounded-full mt-1 inline-block border border-emerald-500/10">
                        👶 Tiene {months} {months === 1 ? "mes" : "meses"} de edad
                      </span>
                    );
                  })()}
                </div>

                <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                    Mediciones iniciales (Opcional)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Scale className="size-3.5" /> Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold min-h-[44px]"
                        placeholder="Ej. 10.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Ruler className="size-3.5" /> Talla (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-bold min-h-[44px]"
                        placeholder="Ej. 80.0"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug block font-bold">
                    💡 Si no los sabes, déjalos en blanco y podrás medirlos más tarde.
                  </span>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-600 dark:text-rose-400 font-bold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 rounded-2xl font-bold text-xs sm:text-sm bg-muted text-foreground border border-border hover:bg-muted/80 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1 col-span-1 min-h-[44px] touch-manipulation"
                  >
                    <ChevronLeft className="size-4" /> Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-3 rounded-2xl font-black text-xs sm:text-sm text-white shadow-md shadow-primary/25 btn-gradient transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer col-span-2"
                  >
                    {loading ? "Registrando..." : "Comenzar Monitoreo"}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-[8px] sm:text-[9px] text-muted-foreground/80 leading-normal font-semibold">
              Al registrarte, aceptas que Yanapiri Wawa procese los datos de
              crecimiento de tu niño(a) con fines de salud pública (Ley N.º
              29733 de Protección de Datos Personales).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
