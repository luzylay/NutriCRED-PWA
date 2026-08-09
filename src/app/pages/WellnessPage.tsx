import { useState } from "react";
import {
  Brain,
  HeartHandshake,
  Smile,
  BellRing,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { HeaderActions } from "../components/shared/HeaderActions";

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: "Cántale mientras lo bañas",
    desc: "La voz de mamá/papá estimula las conexiones neuronales del lenguaje.",
    done: false,
  },
  {
    id: 2,
    title: "Juego del espejo",
    desc: "Ponlo frente a un espejo. Reconocerse ayuda a formar su identidad.",
    done: true,
  },
];

export default function WellnessPage() {
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);
  const [epdsScore, setEpdsScore] = useState<number | null>(null);

  const toggleChallenge = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    );
  };

  const simulateEpdsTest = () => {
    // Simular un test rápido. En producción sería un formulario real de 10 preguntas.
    const mockScore = Math.floor(Math.random() * 20); // 0-30 es el rango real
    setEpdsScore(mockScore);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              Bienestar <br />
              <span className="text-violet-200 font-medium">
                Integral (OMS)
              </span>
            </h1>
            <p className="text-white/80 mt-2 text-sm max-w-[260px] leading-relaxed">
              Basado en los primeros 1,000 días: Nutrimos el cuerpo, estimulamos
              el cerebro y cuidamos a mamá.
            </p>
          </div>
          <HeaderActions />
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        {/* 1. Nurturing Care Framework (Estimulación) */}
        <div className="bg-card border border-border shadow-sm rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Brain className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold text-foreground leading-tight">
                Yanapiri Juega
              </h2>
              <p className="text-xs text-muted-foreground">
                Estimulación Temprana
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleChallenge(c.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  c.done
                    ? "bg-violet-50/50 border-violet-100 dark:bg-violet-900/10 dark:border-violet-900/30 opacity-75"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <CheckCircle2
                  className={`size-5 shrink-0 mt-0.5 ${c.done ? "text-violet-500" : "text-muted-foreground/30"}`}
                />
                <div>
                  <h3
                    className={`font-bold text-sm ${c.done ? "text-violet-700 dark:text-violet-300 line-through" : "text-foreground"}`}
                  >
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Salud Mental Materna */}
        <div className="bg-card border border-border shadow-sm rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <HeartHandshake className="size-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="font-bold text-foreground leading-tight">
                Salud Mental de Mamá
              </h2>
              <p className="text-xs text-muted-foreground">
                Porque tú también importas
              </p>
            </div>
          </div>

          {epdsScore === null ? (
            <div className="text-center bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl p-4">
              <Smile className="size-8 text-rose-300 mx-auto mb-2" />
              <p className="text-sm text-foreground mb-3 font-medium">
                ¿Cómo te has sentido esta última semana?
              </p>
              <button
                onClick={simulateEpdsTest}
                className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold py-2 px-6 rounded-full transition-all"
              >
                Realizar Test Corto
              </button>
            </div>
          ) : (
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 ${epdsScore >= 10 ? "bg-amber-50 border border-amber-200 dark:bg-amber-900/20" : "bg-green-50 border border-green-200 dark:bg-green-900/20"}`}
            >
              {epdsScore >= 10 ? (
                <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
              ) : (
                <Smile className="size-5 text-green-600 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {epdsScore >= 10
                    ? "Atención Preventiva Sugerida"
                    : "Todo parece ir bien"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {epdsScore >= 10
                    ? "Tus respuestas indican un nivel elevado de estrés o posible depresión. Hemos enviado una alerta discreta a tu profesional de salud para ofrecerte apoyo."
                    : "Tus niveles emocionales parecen estables. Recuerda siempre dedicarte un tiempo para ti."}
                </p>
                <button
                  onClick={() => setEpdsScore(null)}
                  className="text-[10px] uppercase font-bold text-muted-foreground mt-2 underline"
                >
                  Volver a intentar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. mHealth Adherence Reminders */}
        <div className="bg-card border border-border shadow-sm rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BellRing className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-foreground leading-tight">
                Recordatorio mHealth
              </h2>
              <p className="text-xs text-muted-foreground">
                Adherencia Preventiva
              </p>
            </div>
          </div>
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-2xl mt-3">
            <p className="text-sm font-medium text-foreground">
              ¡Faltan 2 días para tu Control CRED! 🎉
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estudios muestran que asistir a los controles previene el 80% de
              complicaciones de salud. ¡Tu wawa está orgulloso de ti!
            </p>
          </div>
        </div>

        {/* Referencias y Disclaimer */}
        <div className="mt-8 border-t border-border pt-6 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">
            Fuentes y Respaldo Científico
          </p>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            - <strong>Estimulación:</strong> Basado en el marco "Cuidado
            Cariñoso y Sensible" (OMS/UNICEF).
            <br />- <strong>Salud Mental:</strong> Módulo inspirado en la{" "}
            <em>Escala de Depresión Posnatal de Edimburgo (EPDS)</em> (Cox et
            al., 1987).
            <br />
            <br />
            <em>Descargo de responsabilidad:</em> Esta plataforma{" "}
            <strong>
              no proporciona diagnósticos psiquiátricos ni médicos
            </strong>
            . Si usted o alguien que conoce atraviesa una crisis emocional,
            comuníquese de inmediato con la Línea 113 (MINSA) o acuda a un
            centro de salud.
          </p>
        </div>
      </div>
    </div>
  );
}
