import { useState } from "react";
import { Baby, X, Ruler, Scale, Calendar, CheckCircle, Activity, HeartPulse } from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";

interface AddChildModalProps {
  onClose: () => void;
  onSubmit: (data: {
    childName: string;
    childAgeMonths: number;
    childSex: "M" | "F";
    childWeight: number;
    childHeight: number;
    childDni?: string;
    childMuac?: number;
    childHemoglobin?: number;
    childEdema?: boolean;
  }) => Promise<void>;
}

export function AddChildModal({ onClose, onSubmit }: AddChildModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReniecValidating, setIsReniecValidating] = useState(false);
  const [isReniecValidated, setIsReniecValidated] = useState(false);
  const [formData, setFormData] = useState({
    childDni: "",
    childName: "",
    ageMonths: "",
    sex: "M" as "M" | "F",
    weight: "",
    height: "",
    muac: "",
    hemoglobin: "",
    edema: "0", // 0 = No, 1 = Sí
  });

  const handleValidateReniec = () => {
    if (formData.childDni.length !== 8) return;
    setIsReniecValidating(true);
    setTimeout(() => {
      setIsReniecValidating(false);
      setIsReniecValidated(true);
      // Auto-populate name depending on the mock DNI to simulate real query
      if (formData.childDni === "70000008") {
        setFormData(prev => ({ ...prev, childName: "Carlos Inca Quispe" }));
      } else if (!formData.childName) {
        setFormData(prev => ({ ...prev, childName: "Wawa Verificado RENIEC" }));
      }
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        childDni: formData.childDni,
        childName: formData.childName,
        childAgeMonths: parseInt(formData.ageMonths, 10),
        childSex: formData.sex,
        childWeight: parseFloat(formData.weight),
        childHeight: parseFloat(formData.height),
        childMuac: formData.muac ? parseFloat(formData.muac) : undefined,
        childHemoglobin: formData.hemoglobin ? parseFloat(formData.hemoglobin) : undefined,
        childEdema: formData.edema === "1",
      });
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-5 flex items-center justify-between relative shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary-foreground/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-sm border border-primary-foreground/30">
              <Baby className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary-foreground font-nunito tracking-tight">
                Registrar Niño/a Único
              </h2>
              <p className="text-xs text-primary-foreground/90 font-extrabold mt-0.5">
                Valida con RENIEC e inicia su historial de salud
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* DNI Validation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Documento de Identidad (DNI)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={8}
                placeholder="DNI del niño (8 dígitos)"
                value={formData.childDni}
                onChange={(e) =>
                  setFormData({ ...formData, childDni: e.target.value.replace(/\D/g, "") })
                }
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={handleValidateReniec}
                disabled={formData.childDni.length !== 8 || isReniecValidating}
                className="px-4 py-2 bg-secondary text-secondary-foreground font-bold rounded-xl text-xs hover:bg-secondary/80 disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center justify-center min-w-[100px]"
              >
                {isReniecValidating ? (
                  <span className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
                ) : isReniecValidated ? (
                  "Verificado"
                ) : (
                  "Validar RENIEC"
                )}
              </button>
            </div>
            {isReniecValidated && (
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                ✓ DNI verificado exitosamente con RENIEC
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={formData.childName}
              onChange={(e) =>
                setFormData({ ...formData, childName: e.target.value })
              }
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Sexo
              </label>
              <div className="flex bg-muted/50 rounded-xl border border-border p-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: "M" })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    formData.sex === "M"
                      ? "bg-white shadow-sm text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Niño
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: "F" })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    formData.sex === "F"
                      ? "bg-white shadow-sm text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Niña
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Edad (Meses)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                required
                placeholder="Ej. 14"
                value={formData.ageMonths}
                onChange={(e) =>
                  setFormData({ ...formData, ageMonths: e.target.value })
                }
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">
              Medición Clínica Inicial
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Scale className="size-3 text-cyan-600" /> Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="Ej. 10.5"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black/20 border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Ruler className="size-3 text-emerald-600" /> Talla (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  placeholder="Ej. 75.5"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black/20 border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Activity className="size-3 text-rose-600" /> MUAC (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Opcional (Ej. 12.5)"
                  value={formData.muac}
                  onChange={(e) =>
                    setFormData({ ...formData, muac: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black/20 border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <HeartPulse className="size-3 text-violet-600" /> Hemoglobina (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Opcional (Ej. 11.2)"
                  value={formData.hemoglobin}
                  onChange={(e) =>
                    setFormData({ ...formData, hemoglobin: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black/20 border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase block">
                ¿Presenta Edema Bilateral? (KWASHIORKOR)
              </label>
              <select
                value={formData.edema}
                onChange={(e) => setFormData({ ...formData, edema: e.target.value })}
                className="w-full bg-white dark:bg-black/20 border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="0">No presenta Edema (Normal)</option>
                <option value="1">Sí presenta Edema Bilateral (Alerta Urgente)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Registrando...</span>
            ) : (
              <>
                <CheckCircle className="size-4" /> Guardar Perfil Único
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
