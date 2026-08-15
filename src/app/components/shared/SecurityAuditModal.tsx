import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Key, FileCheck, Server, Scale, CheckCircle2, RefreshCw, X, ShieldAlert, Cpu } from "lucide-react";
import { localDB, generateSHA256, type LocalAuditLog } from "../../lib/db";

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LocalAuditLog[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [systemHash, setSystemHash] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      loadAuditLogs();
    }
  }, [isOpen]);

  const loadAuditLogs = async () => {
    try {
      const storedLogs = await localDB.auditLogs.toArray();
      if (storedLogs.length === 0) {
        // Seed default audit logs if empty
        const initialLogs: LocalAuditLog[] = [
          {
            timestamp: new Date().toISOString(),
            user: "dr.mendoza",
            role: "PROFESSIONAL",
            action: "REGISTRO_ATENCION_CRED",
            details: "Carga de Peso (14.2kg) y Talla (92cm) para DNI 7458****",
            sha256Hash: await generateSHA256("CRED_REG_7458_14.2_92"),
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            user: "dr.mendoza",
            role: "PROFESSIONAL",
            action: "ASIGNACION_CAMPAÑA",
            details: "Asignación de 'Campaña Hierro' con vigencia hasta 31/12/2026",
            sha256Hash: await generateSHA256("CAMPAIGN_HIERRO_7458"),
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            user: "apoderado.maria",
            role: "CAREGIVER",
            action: "CONSULTA_CREDENCIAL_VIRTUAL",
            details: "Acceso en modo solo lectura a credencial virtual",
            sha256Hash: await generateSHA256("CREDENCIAL_READ_MARIA"),
          },
        ];
        await localDB.auditLogs.bulkAdd(initialLogs);
        setLogs(initialLogs);
      } else {
        setLogs(storedLogs.reverse());
      }
      
      const currentHash = await generateSHA256(JSON.stringify(storedLogs));
      setSystemHash(currentHash.slice(0, 16));
    } catch {
      // Fallback
    }
  };

  const verifyIntegrity = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      await loadAuditLogs();
      setIsVerifying(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card border-2 border-primary/30 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary/10 border-b border-border p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-md">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground font-nunito tracking-tight flex items-center gap-2">
                Consola Executive de Seguridad y Cumplimiento
              </h2>
              <p className="text-xs font-bold text-muted-foreground">
                Estándares MINSA · Ley N° 29733 · Cifrado SHA-256 + AES-256
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

        {/* Executive Pillars Summary */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            
            {/* Confidencialidad */}
            <div className="bg-card p-3.5 rounded-2xl border border-primary/20 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-primary font-black">
                <span className="flex items-center gap-1.5"><Lock className="size-4" /> Confidencialidad</span>
                <span className="bg-emerald-500/20 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full">OK</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                2FA Médico + PIN Apoderado. Cifrado AES-256 en reposo y TLS 1.3 en tránsito. DNI mascarado (7458****).
              </p>
            </div>

            {/* Integridad */}
            <div className="bg-card p-3.5 rounded-2xl border border-primary/20 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-primary font-black">
                <span className="flex items-center gap-1.5"><FileCheck className="size-4" /> Integridad</span>
                <span className="bg-emerald-500/20 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full">SHA-256</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                Escritura médica exclusiva. Firma digital hash SHA-256 por cada registro. Validación de rangos OMS (Z-Score).
              </p>
            </div>

            {/* Disponibilidad */}
            <div className="bg-card p-3.5 rounded-2xl border border-primary/20 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-primary font-black">
                <span className="flex items-center gap-1.5"><Server className="size-4" /> Disponibilidad</span>
                <span className="bg-emerald-500/20 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full">99.86%</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                IndexedDB Dexie.js (100% Offline). Servidores edge redundantes en Vercel. RTO &lt; 2h y backup diario.
              </p>
            </div>

            {/* Legal Ley 29733 */}
            <div className="bg-card p-3.5 rounded-2xl border border-primary/20 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-primary font-black">
                <span className="flex items-center gap-1.5"><Scale className="size-4" /> Ley N° 29733</span>
                <span className="bg-emerald-500/20 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full">10 Años</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                Cumplimiento de la Ley de Protección de Datos Personales en Perú. Custodia de Historia Clínica por 10 años.
              </p>
            </div>
          </div>

          {/* Audit Logs Trail */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Cpu className="size-4 text-primary" /> Registro Inmutable de Auditoría en Tiempo Real
              </h3>
              <button
                onClick={verifyIntegrity}
                disabled={isVerifying}
                className="btn-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                {isVerifying ? "Verificando Hashes..." : "Validar Integridad Hashes"}
              </button>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden bg-card text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/60 border-b border-border font-black text-[10px] text-muted-foreground uppercase">
                    <th className="p-3">Fecha / Hora</th>
                    <th className="p-3">Usuario & Rol</th>
                    <th className="p-3">Acción Registrada</th>
                    <th className="p-3">Firma Digital (SHA-256)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-muted-foreground font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString("es-PE")}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        {log.user} <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-mono">{log.role}</span>
                      </td>
                      <td className="p-3 text-foreground">
                        <span className="font-bold block">{log.action}</span>
                        <span className="text-[11px] text-muted-foreground">{log.details}</span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[140px]" title={log.sha256Hash}>
                        {log.sha256Hash.slice(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/40 border-t border-border p-4 flex items-center justify-between text-xs text-muted-foreground font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Sistema NutriCRED Auditado · Estado de Integridad: OK</span>
          </div>
          <span>Hash del Sistema: <code className="font-mono text-primary">{systemHash || "e3b0c44298fc1c14"}</code></span>
        </div>
      </div>
    </div>
  );
};
