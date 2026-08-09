import { useState } from "react";
import { Baby, X, Ruler, Scale, Calendar, CheckCircle } from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";

interface AddChildModalProps {
  onClose: () => void;
  onSubmit: (data: {
    childName: string;
    childAgeMonths: number;
    childSex: "M" | "F";
    childWeight: number;
    childHeight: number;
  }) => Promise<void>;
}

export function AddChildModal({ onClose, onSubmit }: AddChildModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    ageMonths: "",
    sex: "M" as "M" | "F",
    weight: "",
    height: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        childName: formData.childName,
        childAgeMonths: parseInt(formData.ageMonths, 10),
        childSex: formData.sex,
        childWeight: parseFloat(formData.weight),
        childHeight: parseFloat(formData.height),
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
        <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Baby className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-nunito">
                Registrar Niño/a
              </h2>
              <p className="text-xs text-muted-foreground">
                Agrega un nuevo miembro a tu familia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted/80 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="size-3" /> Edad (Meses)
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

          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">
              Medición Inicial (Opcional)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Scale className="size-3" /> Peso (kg)
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
                  <Ruler className="size-3" /> Talla (cm)
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Guardando...</span>
            ) : (
              <>
                <CheckCircle className="size-4" /> Guardar Perfil
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
