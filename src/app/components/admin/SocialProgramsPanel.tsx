import React from "react";
import { Shield, Leaf, Heart, MapPin, Link as LinkIcon, AlertTriangle, Plus, ArrowRight } from "lucide-react";
import { useData } from "../../contexts/DataContext";

export function SocialProgramsPanel() {
  const { children } = useData();
  
  // Mock data for social programs based on children count
  const total = Math.max(1, children.length);
  const PROGRAMS = [
    { name: "JUNTOS", desc: "Transferencia monetaria condicionada a controles de salud y educación", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: Shield, enrolled: Math.floor(total * 0.45) },
    { name: "Qali Warma", desc: "Servicio alimentario en instituciones educativas nivel inicial y primaria", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Leaf, enrolled: Math.floor(total * 0.60) },
    { name: "Cuna Más", desc: "Visitas domiciliarias y cuidado diurno para menores de 3 años", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: Heart, enrolled: Math.floor(total * 0.30) },
    { name: "PAIS", desc: "Plataforma de acción itinerante — llega a comunidades alejadas", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: MapPin, enrolled: Math.floor(total * 0.15) },
  ];

  // Mock kids without programs
  const noProgram = children.slice(0, 3); // Just show the first 3 kids as a demo for "vulnerable"

  return (
    <div className="space-y-6 mt-6 animate-in fade-in duration-300">
      
      {/* Interoperability Banner */}
      <div className="bg-card border-l-4 border-l-blue-500 border-y border-r border-border rounded-r-3xl p-4 shadow-sm flex items-center gap-3">
        <LinkIcon className="size-5 text-blue-500 shrink-0" />
        <p className="m-0 text-sm text-muted-foreground">
          <strong className="text-foreground">Interoperabilidad activa</strong> — Los datos de este sistema se sincronizan con MIDIS, MINSA y RENIEC mediante el estándar <strong className="text-blue-500">HL7 FHIR R4</strong>, alineado con la transformación digital del sector salud en Perú.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROGRAMS.map((prog) => {
          const Icon = prog.icon;
          const percentage = Math.round((prog.enrolled / total) * 100);
          
          return (
            <div key={prog.name} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div className={`${prog.bg} p-4 border-b border-border flex gap-3 items-start`}>
                <div className="size-10 rounded-xl bg-card flex items-center justify-center shadow-sm shrink-0">
                  <Icon className={`size-5 ${prog.color}`} />
                </div>
                <div>
                  <div className={`font-bold text-sm ${prog.color}`}>{prog.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-2">{prog.desc}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`font-mono text-3xl font-medium ${prog.color}`}>{prog.enrolled}</span>
                  <span className="text-xs text-muted-foreground">de {total} niños inscritos</span>
                </div>
                
                <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                  <div 
                    className={`h-full ${prog.color.replace('text', 'bg')} transition-all duration-1000 ease-out`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors group-hover:border-border/80">
                  Gestionar inscripción <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {noProgram.length > 0 && (
        <div className="bg-card border-l-4 border-l-red-500 border-y border-r border-border rounded-r-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-red-500" />
            <h3 className="m-0 text-base text-red-500 font-bold">
              Niños en situación vulnerable (Sin programas sociales activos)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {noProgram.map((child) => (
              <div key={child.id} className="flex justify-between items-center p-3 bg-red-500/5 rounded-xl border border-red-500/20">
                <div className="min-w-0 flex-1 pr-3">
                  <span className="block font-bold text-foreground text-sm truncate">{child.name}</span>
                  <span className="block text-[11px] text-muted-foreground truncate">{child.age} · {child.community}</span>
                </div>
                <button className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shrink-0">
                  <Plus className="size-3" /> Inscribir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
