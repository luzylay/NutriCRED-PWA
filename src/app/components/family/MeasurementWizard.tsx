import { useState } from "react";
import {
  Scale,
  Ruler,
  Activity,
  ChevronLeft,
  X,
  CheckCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";
import { tts } from "../../lib/i18n/tts-helper";
import type {
  Child,
  MeasureType,
  AlertLevel,
  MeasurementResult,
} from "../../lib/types";

// ─── MULTILINGUAL PROTOCOLS ──────────────────────────────────────────────────

const PROTOCOLS_I18N = {
  weight: {
    unit: "kg",
    icon: Scale,
    es: {
      label: "Peso",
      steps: [
        {
          title: "Prepara la balanza",
          instruction:
            "Coloca la balanza en una superficie plana y firme. Asegúrate de que marque 0.",
          tip: "Si usas balanza digital, colócala lejos de desniveles.",
        },
        {
          title: "Coloca al niño",
          instruction:
            "Quita los zapatos y pañal/ropa pesada. Pídele que se pare en el centro del plato.",
          tip: "Si es lactante, puedes cargarlo tú y luego restar tu peso del total.",
        },
        {
          title: "Toma el peso",
          instruction: "Espera a que el número deje de parpadear y regístralo.",
          tip: "Ejemplo: 11.2 kg. Intenta registrar un decimal.",
        },
        {
          title: "Confirmar registro",
          instruction: "Ingresa el valor numérico exacto de la balanza.",
          tip: "El sistema lo comparará con referencias OMS.",
        },
      ],
    },
    qu: {
      label: "Llasaynin (Peso)",
      steps: [
        {
          title: "Balanzata allichay",
          instruction:
            "Balanzata pampa allin allpapi churay. Qallariypi 0 yupayta qhawariy.",
          tip: "Mana maymanpas kuyunanpaq allinta churay.",
        },
        {
          title: "Wawachata churay",
          instruction:
            "Sapatunta, llumpa llukllunta q'alayachiy. Balanzapa chawpinpi sayachiy.",
          tip: "Uña wawacha kaptinqa, marq'aspa tupuspa llasayniykita qichuy.",
        },
        {
          title: "Llasayninta qhaway",
          instruction: "Yupaykuna takyanankama suyay hinaspa qillqay.",
          tip: "Kayhina: 11.2 kg.",
        },
        {
          title: "Tupusqata takyachiy",
          instruction: "Balanzapa rikurisqan yupayta qillqaykuy.",
          tip: "Llikanchikqa OMS tupukunanwan tupachinqa.",
        },
      ],
    },
    ay: {
      label: "Jathi (Peso)",
      steps: [
        {
          title: "Balanza wakicht'aña",
          instruction: "Balanzaxa pampa chiqaru uskuñawa. 0 yuparu uñjañawa.",
          tip: "Jan kuyuñapataki sum uskuñawa.",
        },
        {
          title: "Wawaru uskuña",
          instruction: "Zapatunakap apsuñawa. Balanzan tayparu sayt'ayañawa.",
          tip: "Jisk'a wawatixa, marq'asin qalañawa.",
        },
        {
          title: "Jathipa uñjaña",
          instruction: "Yupanakaxa sayt'asiñapkamaxa suyt'añawa ukat qillqaña.",
          tip: "Sañani: 11.2 kg.",
        },
        {
          title: "Tupuña iyaw saña",
          instruction: "Balanzan yupapa qillqañawa.",
          tip: "Llikawa OMS tupunakampi chikacht'ani.",
        },
      ],
    },
    en: {
      label: "Weight",
      steps: [
        {
          title: "Prepare the scale",
          instruction:
            "Place the scale on a flat, firm surface. Make sure it reads 0.",
          tip: "Keep digital scales away from carpets or slopes.",
        },
        {
          title: "Position the child",
          instruction:
            "Remove heavy clothes and shoes. Place the child in the center of the scale.",
          tip: "For infants, weigh with caregiver and subtract caregiver's weight.",
        },
        {
          title: "Read the weight",
          instruction:
            "Wait until the digits stabilize and take note of the number.",
          tip: "Example: 11.2 kg.",
        },
        {
          title: "Confirm measurement",
          instruction: "Enter the exact numeric value from the scale.",
          tip: "The system compares against official WHO growth standards.",
        },
      ],
    },
  },
  height: {
    unit: "cm",
    icon: Ruler,
    es: {
      label: "Talla / Longitud",
      steps: [
        {
          title: "Prepara el lugar",
          instruction:
            "Menores de 2 años recostados. Mayores de 2 años de pie contra el tallímetro.",
          tip: "Asegura una cinta métrica fija o tallímetro.",
        },
        {
          title: "Postura del niño",
          instruction:
            "Talones, glúteos, espalda y cabeza deben rozar la base vertical.",
          tip: "Pies juntos y mirada al frente.",
        },
        {
          title: "Medición",
          instruction:
            "Desliza el tope móvil hasta rozar la coronilla de la cabeza.",
          tip: "Ejemplo: 85.5 cm.",
        },
        {
          title: "Confirmar registro",
          instruction: "Ingresa la talla en centímetros.",
          tip: "El sistema evaluará el crecimiento lineal.",
        },
      ],
    },
    qu: {
      label: "Sayaynin (Talla)",
      steps: [
        {
          title: "Tupuna kuskata allichay",
          instruction:
            "2 watamanta uña wawakuna sirisqa. 2 watamanta wichay wawakuna sayasqa.",
          tip: "Tallímetro nisqata pirqapi allinta watay.",
        },
        {
          title: "Wawapa sayaynin",
          instruction: "Wask'an, wasan hinaspa uman pirqaman tupachisqa kanan.",
          tip: "Ñawinta ñawpaqman qhawachiy.",
        },
        {
          title: "Tupuy",
          instruction: "Tope k'aspiwan umapa hananmanta allillamanta tupuy.",
          tip: "Kayhina: 85.5 cm.",
        },
        {
          title: "Tupusqata takyachiy",
          instruction: "Sayayninta centimetropi qillqay.",
          tip: "Llikanchikqa wiñayninta qhawanqa.",
        },
      ],
    },
    ay: {
      label: "Sayt'u (Talla)",
      steps: [
        {
          title: "Tupurata wakicht'aña",
          instruction: "2 marata jisk'anaka ikiñani. 2 marata jiliri sayt'ata.",
          tip: "Tallímetro sum sayt'ayaña.",
        },
        {
          title: "Wawan sayt'awipa",
          instruction:
            "Kayunaka, qhipäxa ukat p'iqixa tallímetroru t'uxpisañawa.",
          tip: "Nayraxa nayraqataru uñtañapawa.",
        },
        {
          title: "Tupuña",
          instruction: "P'iqiruw tupurampi t'uxpiyaña.",
          tip: "Sañani: 85.5 cm.",
        },
        {
          title: "Tupuña iyaw saña",
          instruction: "Sayt'upa centímetros ukan qillqañawa.",
          tip: "Llikaxa jilawip sum uñji.",
        },
      ],
    },
    en: {
      label: "Height / Length",
      steps: [
        {
          title: "Prepare the area",
          instruction:
            "Under 2 years lie flat. Over 2 years stand against the stadiometer.",
          tip: "Ensure firm measuring board or stadiometer.",
        },
        {
          title: "Child posture",
          instruction:
            "Heels, buttocks, shoulders, and head touch the vertical board.",
          tip: "Feet together and gaze straight forward.",
        },
        {
          title: "Measure",
          instruction:
            "Lower the headpiece until it touches the crown of the head.",
          tip: "Example: 85.5 cm.",
        },
        {
          title: "Confirm record",
          instruction: "Enter the height in centimeters.",
          tip: "The system assesses linear linear growth.",
        },
      ],
    },
  },
  muac: {
    unit: "cm",
    icon: Activity,
    es: {
      label: "Perímetro Braquial (MUAC)",
      steps: [
        {
          title: "Punto medio",
          instruction:
            "Dobla el brazo izquierdo a 90 grados. Mide entre hombro y codo y marca el centro.",
          tip: "Usa un marcador lavable para el punto medio.",
        },
        {
          title: "Aplica la cinta",
          instruction:
            "Deja caer el brazo relajado y rodea el punto medio con la cinta MUAC.",
          tip: "La cinta debe quedar plana sin apretar la piel.",
        },
        {
          title: "Identifica la zona",
          instruction:
            "Verifica el color: Verde (Normal), Amarillo (Riesgo), Rojo (Desnutrición severa).",
          tip: "Anota el valor exacto en centímetros.",
        },
        {
          title: "Confirmar registro",
          instruction: "Ingresa el valor del perímetro braquial.",
          tip: "Evalúa desnutrición aguda en niños de 6 a 59 meses.",
        },
      ],
    },
    qu: {
      label: "Marq'a Tupu (MUAC)",
      steps: [
        {
          title: "Chawpi marq'ata akllay",
          instruction:
            "Ichuq marq'anta 90 gradospi k'umuykuchiy. Rikramanta marq'akama chawpinta markay.",
          tip: "Chawpinpi huch'uy punkillata churanapaq.",
        },
        {
          title: "Cintawan pilluy",
          instruction:
            "Marq'anta samaykachiy hinaspa chawpinpi MUAC cintata pilluykuy.",
          tip: "Cintaqa manam qaranpi k'irinchu kanan.",
        },
        {
          title: "Llimp'inta qhaway",
          instruction:
            "Q'omer (Allin), Q'ellu (Qhawanapaq), Puka (Sinchi unqusqa).",
          tip: "Centimetropi yupayta qillqay.",
        },
        {
          title: "Tupusqata takyachiy",
          instruction: "Marq'a tupusqayki yupayta churay.",
          tip: "6-manta 59 killayuq wawakunapaqmi.",
        },
      ],
    },
    ay: {
      label: "Ampar Tupu (MUAC)",
      steps: [
        {
          title: "Taypi ampar uñjaña",
          instruction:
            "Ch'iqa amparap 90 grados k'umuyaña. Taypipi unanchañawa.",
          tip: "Taypiparu jisk'a unancha uskuña.",
        },
        {
          title: "Cintampi qalaña",
          instruction: "Ampar samart'ayaña ukat MUAC cintampi muytayaña.",
          tip: "Jan sinti ch'allxtasa.",
        },
        {
          title: "Samipa uñt'aña",
          instruction: "Ch'uxña (Suma), Q'illu (Uñjaña), Wila (Wali usuta).",
          tip: "Centimetronakampi qillqaña.",
        },
        {
          title: "Tupuña iyaw saña",
          instruction: "Ampartupun yupapa uskuñawa.",
          tip: "6-ta 59 phaxsini wawanakatakiwa.",
        },
      ],
    },
    en: {
      label: "Mid-Upper Arm Circumference (MUAC)",
      steps: [
        {
          title: "Find the midpoint",
          instruction:
            "Bend the left arm at 90 degrees. Measure distance between shoulder and elbow.",
          tip: "Mark midpoint with a washable pen.",
        },
        {
          title: "Apply the tape",
          instruction:
            "Let the arm relax and wrap the MUAC tape around the marked midpoint.",
          tip: "The tape should lie flat without pinching skin.",
        },
        {
          title: "Read color band",
          instruction:
            "Check color arrow: Green (Normal), Yellow (Risk), Red (Severe Malnutrition).",
          tip: "Record exact centimeters.",
        },
        {
          title: "Confirm record",
          instruction: "Enter the MUAC value.",
          tip: "Assesses acute malnutrition for 6 to 59 months.",
        },
      ],
    },
  },
};

interface MeasurementWizardProps {
  type: MeasureType;
  child: Child;
  onClose: () => void;
  onSubmit: (val: number) => Promise<MeasurementResult>;
}

export function MeasurementWizard({
  type,
  child,
  onClose,
  onSubmit,
}: MeasurementWizardProps) {
  const { language, t } = useTranslation();
  const protocolConfig = PROTOCOLS_I18N[type];
  const langKey = (
    ["es", "qu", "ay", "en"].includes(language) ? language : "es"
  ) as "es" | "qu" | "ay" | "en";
  const protocol = protocolConfig[langKey] || protocolConfig.es;
  const unit = protocolConfig.unit;
  const StepIcon = protocolConfig.icon;

  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isLast = step === protocol.steps.length - 1;
  const currentStep = protocol.steps[step];

  const handleSpeech = () => {
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${currentStep.title}. ${currentStep.instruction}. ${currentStep.tip}`;
    setIsSpeaking(true);
    tts.speak(textToSpeak, {
      language,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const res = await onSubmit(num);
      setResult(res);
    }
    setLoading(false);
  };

  if (result) {
    const isAbnormal = result.level !== "normal";
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm bg-card rounded-3xl p-6 space-y-5 shadow-2xl border border-border">
          <div className="text-center space-y-4">
            <div
              className={`size-16 rounded-2xl flex items-center justify-center mx-auto ${
                result.level === "urgent"
                  ? "bg-red-100 dark:bg-red-950/30"
                  : result.level === "follow-up"
                    ? "bg-amber-100 dark:bg-amber-950/30"
                    : "bg-emerald-100 dark:bg-emerald-950/30"
              }`}
            >
              <CheckCircle
                className={`size-8 ${
                  result.level === "urgent"
                    ? "text-red-600 dark:text-red-400"
                    : result.level === "follow-up"
                      ? "text-amber-600"
                      : "text-emerald-600 dark:text-emerald-400"
                }`}
              />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {t("wizard.success_title")}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {protocol.label} ({child.name.split(" ")[0]}):{" "}
                <span className="font-mono font-bold text-foreground">
                  {value} {unit}
                </span>
              </p>
            </div>
            {isAbnormal ? (
              <div
                className={`border rounded-2xl p-4 text-left ${
                  result.level === "urgent"
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    result.level === "urgent"
                      ? "text-red-700 dark:text-red-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {t("wizard.alert_signal")}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    result.level === "urgent"
                      ? "text-red-700/90 dark:text-red-300/90"
                      : "text-amber-700/90 dark:text-amber-300/90"
                  }`}
                >
                  {result.message}
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-left">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  {t("wizard.normal_growth")}
                </p>
                <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                  {t("wizard.normal_growth_desc")}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              {t("wizard.disclaimer")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            {t("wizard.understand")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-5 pt-5 pb-4 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={() => {
                    tts.stop();
                    setStep((s) => s - 1);
                  }}
                  className="p-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              <div>
                <span className="inline-flex items-center gap-1.5 bg-primary-foreground/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-primary-foreground mb-1 shadow-xs border border-primary-foreground/30">
                  <StepIcon className="size-3 text-primary-foreground" />
                  {protocol.label} · Paso {step + 1} de {protocol.steps.length}
                </span>
                <h3
                  className="text-primary-foreground font-black text-lg leading-tight font-nunito"
                >
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS Voice button */}
              <button
                onClick={handleSpeech}
                title={isSpeaking ? t("app.audio_stop") : t("app.audio_read")}
                className={`p-2 rounded-xl transition-all shadow-sm cursor-pointer ${
                  isSpeaking
                    ? "bg-accent text-accent-foreground animate-pulse ring-2 ring-primary-foreground/50"
                    : "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                }`}
              >
                {isSpeaking ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>

              <button
                onClick={() => {
                  tts.stop();
                  onClose();
                }}
                className="p-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-xl transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-2">
            {protocol.steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  i === step
                    ? "bg-primary-foreground shadow-sm scale-y-125"
                    : i < step
                      ? "bg-primary-foreground/70"
                      : "bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3.5">
            <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
              <StepIcon className="size-6 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-relaxed pt-0.5 font-medium">
              {currentStep.instruction}
            </p>
          </div>

          <div className="bg-muted rounded-2xl px-4 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                {t("wizard.tip")}{" "}
              </span>
              {currentStep.tip}
            </p>
          </div>

          {isLast && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                {t("wizard.measured_val")} ({protocol.label})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="150"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`ej. ${
                    type === "weight"
                      ? "11.2"
                      : type === "height"
                        ? "85.5"
                        : "14.0"
                  }`}
                  className="w-full bg-input-background border border-border rounded-2xl px-4 py-4 text-2xl font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">
                  {unit}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={
              isLast
                ? handleConfirm
                : () => {
                    tts.stop();
                    setStep((s) => s + 1);
                  }
            }
            disabled={(isLast && !value) || loading}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? "Registrando..."
              : isLast
                ? t("wizard.confirm")
                : t("wizard.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
