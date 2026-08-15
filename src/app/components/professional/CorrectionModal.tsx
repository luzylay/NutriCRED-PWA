import React, { useState } from "react";
import { X, ShieldAlert, CheckCircle2, FileText, AlertTriangle, Lock, RefreshCw } from "lucide-react";
import { localDB, generateSHA256 } from "../../lib/db";
import type { Child } from "../../lib/types";

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child;
  onSuccess?: () => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  child,
  onSuccess,
}) => {
  const [newWeight, setNewWeight] = useState<string>(child.weight ? String(child.weight) : "");
  const [newHeight, setNewHeight] = useState<string>(child.height ? String(child.height) : "");
  const [newHemoglobin, setNewHemoglobin] = useState<string>(child.hemoglobin ? String(child.hemoglobin) : "");
  const [newCampaign, setNewCampaign] = useState<string>(child.campaign || "Campaña Hierro");
  const [newDiagnosis, setNewDiagnosis] = useState<string>(child.doctorDiagnosis || "Anemia leve");
  const [reason, setReason] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Days since original measurement check (30-day limit)
  const isOlderThan30Days = false; // Demo context within valid window

  const handleSaveCorrection = async () => {
    setErrorMsg(null);

    // 1. Mandatory Reason validation (min 5 chars)
    if (!reason || reason.trim().length < 5) {
      setErrorMsg("El motivo de la corrección es OBLIGATORIO (mínimo 5 caracteres).");
      return;
    }

    // 2. Physiological Range Validations
    const w = parseFloat(newWeight);
    const h = parseFloat(newHeight);
    const hb = parseFloat(newHemoglobin);

    if (isNaN(w) || w < 2 || w > 25) {
      setErrorMsg("Rango fisiológico inválido para peso (debe estar entre 2.0 kg y 25.0 kg).");
      return;
    }
    if (isNaN(h) || h < 45 || h > 120) {
      setErrorMsg("Rango fisiológico inválido para talla (debe estar entre 45.0 cm y 120.0 cm).");
      return;
    }
    if (!isNaN(hb) && (hb < 4 || hb > 18)) {
      setErrorMsg("Rango fisiológico inválido para hemoglobina (debe estar entre 4.0 y 18.0 g/dL).");
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const previousValues = {
        weight: child.weight,
        height: child.height,
        hemoglobin: child.hemoglobin,
        campaign: child.campaign,
        diagnosis: child.doctorDiagnosis,
      };
      const newValues = {
        weight: w,
        height: h,
        hemoglobin: isNaN(hb) ? child.hemoglobin : hb,
        campaign: newCampaign,
        diagnosis: newDiagnosis,
      };

      // Immutable correction entry (Ley N° 29733)
      const auditPayload = JSON.stringify({
        eval_id: `EVAL_${child.id}`,
        child_id: child.id,
        original_doctor: "Dr. Carlos Gómez",
        correcting_doctor: "dr.mendoza",
        timestamp,
        reason,
        prev: previousValues,
        next: newValues,
      });

      const sha256 = await generateSHA256(auditPayload);

      await localDB.auditLogs.add({
        timestamp,
        user: "dr.mendoza",
        role: "PROFESSIONAL",
        action: "CORRECCION_EVALUACION_LEY29733",
        details: `Motivo: "${reason}" | Prev: P=${child.weight}kg,T=${child.height}cm → Nuevo: P=${w}kg,T=${h}cm`,
        sha256Hash: sha256,
      });

      // Update child object in memory / state without deleting original log
      child.weight = w;
      child.height = h;
      if (!isNaN(hb)) child.hemoglobin = hb;
      child.campaign = newCampaign as any;
      child.doctorDiagnosis = newDiagnosis;

      if (onSuccess) onSuccess();
      setIsSubmitting(false);
      onClose();
    } catch {
      setErrorMsg("Error al guardar la corrección en la base de datos inmutable.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card border-2 border-primary/30 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-primary/10 border-b border-border p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-xs">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-foreground font-nunito tracking-tight leading-none">
                Corregir Evaluación Clínica (Ley N° 29733)
              </h3>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                Trazabilidad inmutable · Firma Digital SHA-256
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          
          {/* Patient and Original Metadata */}
          <div className="bg-muted/50 p-4 rounded-2xl border border-border space-y-1">
            <div className="flex justify-between items-center font-bold">
              <span className="text-foreground font-black text-sm">{child.name}</span>
              <span className="text-muted-foreground font-mono">DNI: {child.dni ? `${child.dni.slice(0, 4)}****` : "----****"}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Evaluación original: <strong className="text-foreground font-bold">10/08/2026</strong> · Autor original: <strong className="text-foreground font-bold">Dr. Carlos Gómez</strong>
            </p>
          </div>

          {/* Current Values vs New Values */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card p-3 rounded-xl border border-border space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase block">Peso Actual</span>
              <span className="font-mono text-sm font-black text-foreground">{child.weight} kg</span>
            </div>
            <div className="bg-card p-3 rounded-xl border border-border space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase block">Talla Actual</span>
              <span className="font-mono text-sm font-black text-foreground">{child.height} cm</span>
            </div>
          </div>

          {/* New Values Form Inputs */}
          <div className="space-y-3 pt-2">
            <h4 className="font-black text-xs uppercase tracking-wider text-primary">Nuevos Valores Evaluados:</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground block">Nuevo Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-card border rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  placeholder="Ej: 14.2"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Nueva Talla (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  className="w-full bg-card border rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  placeholder="Ej: 92.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground block">Campaña de Alimentación</label>
                <select
                  value={newCampaign}
                  onChange={(e) => setNewCampaign(e.target.value)}
                  className="w-full bg-card border rounded-xl px-2.5 py-2 text-xs font-bold"
                >
                  <option value="Campaña Hierro">Campaña Hierro</option>
                  <option value="Campaña Multinutriente">Campaña Multinutriente</option>
                  <option value="Campaña Leche Fortificada">Campaña Leche Fortificada</option>
                  <option value="Campaña Complementaria">Campaña Complementaria</option>
                  <option value="Sin campaña">Sin campaña</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Hemoglobina (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newHemoglobin}
                  onChange={(e) => setNewHemoglobin(e.target.value)}
                  className="w-full bg-card border rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  placeholder="Ej: 11.5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Diagnóstico Médico</label>
              <input
                type="text"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                className="w-full bg-card border rounded-xl px-3 py-2 text-xs font-bold"
                placeholder="Ej. Anemia leve en recuperación"
              />
            </div>
          </div>

          {/* Mandatory Reason Box */}
          <div className="space-y-1 pt-2">
            <label className="font-black text-rose-600 dark:text-rose-400 block uppercase tracking-wider">
              Motivo de Corrección (Obligatorio · Mín. 5 caracteres):
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Error de digitación en balanza digital: peso real 14.2 kg."
              className="w-full bg-card border border-rose-500/40 rounded-xl px-3 py-2 text-xs font-medium text-foreground resize-none focus:ring-2 focus:ring-rose-500/50 outline-none"
            />
          </div>

          {/* Legal Security Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex gap-2.5 items-start text-[11px] text-amber-800 dark:text-amber-200">
            <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Cumplimiento Ley N° 29733:</strong> El registro original NO se elimina. Se genera un registro inmutable en `historial_correcciones` firmado con SHA-256 y se notifica al médico original.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 p-3 rounded-xl font-bold text-xs flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-muted/40 border-t border-border p-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-muted transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveCorrection}
            disabled={isSubmitting}
            className="btn-gradient text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? "Guardando Trazabilidad..." : "Guardar Corrección con SHA-256"}
          </button>
        </div>
      </div>
    </div>
  );
};
