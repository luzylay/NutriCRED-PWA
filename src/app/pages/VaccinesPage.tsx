import { useState } from "react";
import { Syringe, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { HeaderActions } from "../components/shared/HeaderActions";

const MINSA_SCHEDULE = [
  {
    age: "Recién Nacido",
    status: "completed",
    vaccines: [
      { name: "BCG (Tuberculosis)", desc: "Protege contra las formas graves de tuberculosis." },
      { name: "Hepatitis B", desc: "Previene la transmisión de madre a hijo." }
    ]
  },
  {
    age: "2 Meses",
    status: "pending",
    vaccines: [
      { name: "Pentavalente", desc: "Protege contra Difteria, Tétanos, Tos convulsiva, Hepatitis B, H. influenzae b." },
      { name: "Polio (IPV)", desc: "Previene la poliomielitis." },
      { name: "Rotavirus", desc: "Previene diarreas graves." },
      { name: "Neumococo", desc: "Previene neumonías y meningitis." }
    ]
  },
  {
    age: "4 Meses",
    status: "upcoming",
    vaccines: [
      { name: "Pentavalente (2da dosis)", desc: "Refuerzo." },
      { name: "Polio (IPV - 2da dosis)", desc: "Refuerzo." },
      { name: "Rotavirus (2da dosis)", desc: "Refuerzo." },
      { name: "Neumococo (2da dosis)", desc: "Refuerzo." }
    ]
  }
];

export default function VaccinesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              Calendario <br/>
              <span className="text-blue-200 font-medium">MINSA Perú</span>
            </h1>
            <p className="text-white/80 mt-2 text-sm max-w-[260px] leading-relaxed">
              Esquema oficial de vacunación. Recuerda que todas son gratuitas en postas y centros del SIS.
            </p>
          </div>
          <HeaderActions />
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-[2rem] p-5 shadow-lg border border-amber-200 dark:border-amber-900/30 flex gap-4 items-center">
          <div className="size-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <AlertCircle className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-300">Recordatorio Preventivo</h3>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
              Faltan 14 días para el control de 2 meses. Ubica tu posta más cercana a tiempo.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Syringe className="size-5 text-blue-600" /> Esquema Interactivo
          </h2>
          
          <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
            {MINSA_SCHEDULE.map((stage, idx) => (
              <div key={idx} className="relative pl-6">
                {/* Timeline dot */}
                <div className={`absolute -left-[9px] top-1 size-4 rounded-full border-4 border-background ${
                  stage.status === "completed" ? "bg-green-500" :
                  stage.status === "pending" ? "bg-amber-500 animate-pulse" : "bg-muted"
                }`} />
                
                <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  {stage.age}
                  {stage.status === "completed" && <ShieldCheck className="size-4 text-green-500" />}
                  {stage.status === "pending" && <Clock className="size-4 text-amber-500" />}
                </h3>

                <div className="grid gap-3">
                  {stage.vaccines.map((vac, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${
                      stage.status === "completed" ? "bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30" :
                      "bg-card border-border shadow-sm hover:shadow-md"
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-foreground">{vac.name}</span>
                        {stage.status === "pending" && (
                          <button className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-xl font-bold">
                            Marcar aplicada
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{vac.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referencias y Disclaimer */}
        <div className="mt-8 border-t border-border pt-6 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Fuentes y Respaldo Legal</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Calendario elaborado en base a la <strong>Norma Técnica de Salud N° 196-MINSA/DGIESP-2022</strong> (Esquema Nacional de Vacunación de la República del Perú). Información de dominio público. <br/><br/>
            <em>Descargo de responsabilidad:</em> Las fechas son referenciales. Consulte siempre en su Centro de Salud o con su médico tratante ante cualquier duda sobre el estado vacunal de su menor.
          </p>
        </div>
      </div>
    </div>
  );
}
