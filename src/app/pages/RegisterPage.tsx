import { useState } from "react";
import { useNavigate } from "react-router";
import { Baby, UserPlus, ArrowLeft } from "lucide-react";
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

  if (isLoggedIn && user) {
    return <Navigate to={ROLE_TO_ROUTE[user.role] ?? "/familia"} replace />;
  }

  // Form state
  const [caregiverName, setCaregiverName] = useState("");
  const [dni, setDni] = useState("");
  const [childName, setChildName] = useState("");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !caregiverName ||
        !dni ||
        !childName ||
        !birthDate ||
        !weight ||
        !height
      ) {
        throw new Error("Por favor completa todos los campos.");
      }

      const bDate = new Date(birthDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - bDate.getTime());
      const ageMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

      if (ageMonths < 0 || ageMonths > 60) {
        throw new Error("El niño debe tener entre 0 y 5 años (60 meses).");
      }

      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      const [median, sd] = getWHORef(ageMonths, sex);
      const zScore = parseFloat(((weightNum - median) / sd).toFixed(2));

      let status: "normal" | "follow-up" | "urgent" = "normal";
      if (zScore < -3) status = "urgent";
      else if (zScore < -2) status = "follow-up";

      // Register via AuthContext (will be implemented next)
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

  return (
    <div className="min-h-screen bg-gradient-flow flex flex-col items-center py-6 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in duration-500">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al Inicio
        </button>

        <div className="glass-panel rounded-3xl p-6 shadow-2xl bg-card/90">
          <div className="text-center space-y-2 mb-6">
            <div className="size-14 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <UserPlus className="size-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-foreground font-nunito">
              Registro Familiar
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Únete a Yanapiri Wawa y comienza a monitorear el crecimiento
              saludable de tu niño(a).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAREGIVER INFO */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-1">
                Tus Datos (Apoderado)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    placeholder="Ej. María Quispe"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    DNI
                  </label>
                  <input
                    type="number"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    placeholder="8 dígitos"
                    required
                  />
                </div>
              </div>
            </div>

            {/* CHILD INFO */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-accent/20 pb-1 flex items-center gap-1.5">
                <Baby className="size-3.5" /> Datos del Niño/a
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Nombre del Niño(a)
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  placeholder="Ej. Mateo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Sexo
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as "M" | "F")}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  >
                    <option value="M">Niño</option>
                    <option value="F">Niña</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    F. Nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Peso Actual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    placeholder="Ej. 10.5"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Talla (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    placeholder="Ej. 80.0"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 font-bold">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient text-primary-foreground font-bold py-3.5 rounded-2xl text-sm shadow-md cursor-pointer"
              >
                {loading ? "Creando tu cuenta..." : "Comenzar a Monitorear"}
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Al registrarte, aceptas que Yanapiri Wawa procese los datos de
              crecimiento de tu niño(a) con fines de salud pública (Ley N.º
              29733).
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
