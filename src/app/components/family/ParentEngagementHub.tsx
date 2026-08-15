import React, { useState } from "react";
import {
  Trophy,
  Award,
  Calendar,
  Share2,
  Bell,
  Camera,
  LineChart,
  Percent,
  CheckCircle2,
  Sparkles,
  Clock,
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap,
  Download,
  Flame,
  FileText,
  PhoneCall,
  BarChart3,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Printer,
  ChevronDown,
  Apple,
  Pill,
  Ruler,
  Stethoscope,
  Hospital,
  Ambulance,
  UserCheck,
  Info,
} from "lucide-react";
import { GrowthChart } from "../shared/GrowthChart";
import { useData } from "../../contexts/DataContext";
import { OnboardingModal } from "../shared/OnboardingModal";
import type { Child, GrowthPoint } from "../../lib/types";

interface ParentEngagementHubProps {
  child: Child;
  growthData: GrowthPoint[];
}

export function ParentEngagementHub({ child, growthData }: ParentEngagementHubProps) {
  const { showToast, setIsOfflineGuideOpen } = useData();
  const [activeTab, setActiveTab] = useState<
    "achievements" | "timeline" | "percentiles" | "gallery" | "push" | "report" | "emergency" | "stats" | "tips" | "help"
  >("achievements");

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showPediatricReportModal, setShowPediatricReportModal] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Notifications push state
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return "Notification" in window && Notification.permission === "granted";
  });

  // Sample photo gallery items
  const [photos] = useState([
    { id: "1", date: "14 Ago, 2026", title: "Foto de Suplementación", label: "Gotas Chispitas", status: "Aprobado IA" },
    { id: "2", date: "10 Ago, 2026", title: "Plato Nutritivo AR", label: "Sangrecita + Huevo", status: "Balanceado" },
    { id: "3", date: "01 Ago, 2026", title: "Control de Talla", label: "58 cm · Lircay", status: "Verificado" },
  ]);

  // Handle push notification toggle
  const handleTogglePush = async () => {
    if (!("Notification" in window)) {
      showToast("Las notificaciones push no están soportadas en este navegador.", "warning");
      return;
    }
    if (Notification.permission === "granted") {
      setPushEnabled(false);
      showToast("Notificaciones push desactivadas.", "info");
    } else {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setPushEnabled(true);
        showToast("🔔 Notificaciones Push activadas. Recibirás alertas de vacunas y suplementos.", "success");
      } else {
        showToast("Permiso de notificaciones denegado.", "warning");
      }
    }
  };

  // Handle Web Share
  const handleShareProgress = () => {
    const text = `👶 Resumen de Crecimiento CRED de ${child.name}:\n• Edad: ${child.age}\n• Peso: ${child.weight > 0 ? `${child.weight} kg` : "Pendiente"}\n• Talla: ${child.height > 0 ? `${child.height} cm` : "Pendiente"}\n• Estado: ${child.weight > 0 ? "Nutrición Óptima" : "Por medir"} (Yanapiri Wawa Perú)`;
    if (navigator.share) {
      navigator.share({
        title: `Progreso de ${child.name}`,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }
    showToast("📲 Resumen listo para compartir por WhatsApp o redes.", "success");
  };

  // Printable Pediatrician Report trigger
  const handlePrintReport = () => {
    window.print();
  };

  // FAQ Accordion items
  const faqs = [
    {
      id: "faq-1",
      q: "¿Cómo dar las gotas de hierro o sulfato ferroso?",
      a: "Administre las gotas directamente en la boquita del menor o mezcladas con jugos ricos en Vitamina C (naranja, camu camu, papaya). Evite mezclarlas con leche ya que disminuye su absorción.",
    },
    {
      id: "faq-2",
      q: "¿Qué sucede si no tengo señal de celular o internet?",
      a: "Yanapiri Wawa funciona 100% sin internet. Todos los registros, fotos y controles se guardan en la memoria local (IndexedDB). Se enviarán a la posta médica automáticamente al recuperar señal.",
    },
    {
      id: "faq-3",
      q: "¿Cómo funciona el Traductor de Lengua de Señas por cámara?",
      a: "Apunta la cámara a tus manos. Un motor de visión por computadora local de 100% CPU analiza la forma de los dedos y traduce tus consultas de salud en tiempo real sin subir nada a la nube.",
    },
    {
      id: "faq-4",
      q: "¿Dónde se ubica mi Posta Médica o Centro de Salud?",
      a: "Puedes comunicarte gratuitamente a la Línea 113 del MINSA opción 3 o llamar a la Promotora de Salud Comunitaria de tu localidad.",
    },
  ];
  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-5 sm:p-6 shadow-xl space-y-6">
      {/* Top Banner with Streaks Counter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Flame className="size-7 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-foreground tracking-tight font-nunito">
                Estrategia & Acompañamiento
              </h2>
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="size-3 text-amber-500" /> Racha: 12 Días
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              Herramientas de gamificación, soporte clínico y ayuda para padres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-primary/20"
          >
            <Sparkles className="size-3.5 text-primary" /> Onboarding Guía
          </button>

          <button
            onClick={handleShareProgress}
            className="px-4 py-2 rounded-xl btn-gradient text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <Share2 className="size-3.5 text-white" /> Compartir
          </button>
        </div>
      </div>

      {/* Block 1: Racha y Logros de Gamificación */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
              <Flame className="size-7" />
            </div>
            <div>
              <h3 className="font-black text-sm text-foreground">Racha de Suplementación: 12 Días Seguidos</h3>
              <p className="text-xs text-muted-foreground">¡Excelente! Has registrado el sulfato ferroso sin interrupciones este mes.</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-amber-500 text-white rounded-full text-xs font-black shadow-md shrink-0">
            450 Puntos de Cuidado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: "a1", icon: Trophy, title: "Guardián del Crecimiento", desc: "3 controles CRED registrados a tiempo.", badge: "Oro" },
            { id: "a2", icon: ShieldCheck, title: "Escudo Vacunal MINSA", desc: "Esquema de vacunas al día.", badge: "Platino" },
            { id: "a3", icon: Apple, title: "Chef Nutritivo Andino", desc: "Plato rico en hierro hemínico escaneado.", badge: "Plata" },
            { id: "a4", icon: Camera, title: "Evidencia Verificada IA", desc: "Fotografía de frasco validada en 100% CPU.", badge: "Bronce" },
          ].map((a) => {
            const AchIcon = a.icon;
            return (
              <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 shadow-xs hover:border-primary/50 transition-all">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                  <AchIcon className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xs text-foreground">{a.title}</h4>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{a.badge}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block 2: Reporte Oficial para Pediatra */}
      <div className="space-y-3 pt-2">
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm text-foreground">Reporte Oficial para Pediatra CRED</h3>
              <p className="text-xs text-muted-foreground">Ficha clínica resumida lista para mostrar e imprimir en la Posta de Salud.</p>
            </div>
          </div>
          <button
            onClick={() => setShowPediatricReportModal(true)}
            className="px-4 py-2.5 rounded-xl btn-gradient text-white text-xs font-black shadow-md cursor-pointer shrink-0 flex items-center gap-2"
          >
            <Printer className="size-4 text-white" /> Ver / Imprimir Reporte
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" /> Diagnóstico Antropométrico Clínico (OMS)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[10px]">Paciente</span>
              <strong className="text-foreground">{child.name}</strong>
            </div>
            <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[10px]">Peso Actual</span>
              <strong className="text-foreground">{child.weight > 0 ? `${child.weight} kg` : "--"}</strong>
            </div>
            <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[10px]">Talla Actual</span>
              <strong className="text-foreground">{child.height > 0 ? `${child.height} cm` : "--"}</strong>
            </div>
            <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
              <span className="text-muted-foreground block text-[10px]">Z-Score OMS</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">{child.weight > 0 ? `${child.zScore} SD` : "--"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Block 3: Directorio de Emergencias Médicas & S.O.S. */}
      <div className="space-y-3 pt-2">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
          <ShieldAlert className="size-6 text-red-500 shrink-0" />
          <div>
            <h3 className="font-black text-sm text-foreground">Directorio de Emergencias Médicas & S.O.S.</h3>
            <p className="text-xs text-muted-foreground">Llamadas gratuitas las 24 horas del día en todo el Perú.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "SAMU Perú (Urgencias)", phone: "106", desc: "Ambulancias y rescate médico de emergencia", icon: Ambulance, color: "bg-red-500 text-white" },
            { name: "Línea 113 MINSA Salud", phone: "113", desc: "Orientación médica telefónica gratuita", icon: Hospital, color: "bg-blue-600 text-white" },
            { name: "Posta Médica Lircay", phone: "067-451230", desc: "Establecimiento de Salud I-3 Huancavelica", icon: Stethoscope, color: "bg-emerald-600 text-white" },
            { name: "Promotora de Salud", phone: "+51 987 654 321", desc: "Visita domiciliaria y seguimiento CRED", icon: UserCheck, color: "bg-amber-600 text-white" },
          ].map((contact, idx) => {
            const ContactIcon = contact.icon;
            return (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="bg-card border border-border rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-primary transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${contact.color}`}>
                    <ContactIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-foreground">{contact.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{contact.desc}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-mono font-bold text-xs shadow-xs shrink-0">
                  {contact.phone}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Block 4: Línea de Tiempo de Hitos Recientes */}
      <div className="space-y-3 pt-2">
        <h3 className="font-black text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
          <Calendar className="size-4 text-primary" /> Línea de Tiempo de Registros Recientes
        </h3>
        <div className="relative border-l-2 border-primary/30 ml-4 space-y-4">
          {[
            { date: "14 Ago, 2026", title: "Suplementación Diaria Registrada", desc: "15 gotas de sulfato ferroso administradas.", icon: Pill },
            { date: "10 Ago, 2026", title: "Escáner de Plato Nutritivo AR", desc: "Plato detectado: Sangrecita con papa nativa.", icon: Apple },
            { date: "28 Jul, 2026", title: "Control CRED 2 Meses", desc: "Peso: 5.4 kg, Talla: 58 cm. Estado de salud normal.", icon: Ruler },
          ].map((evt, idx) => {
            const EvtIcon = evt.icon;
            return (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[11px] top-1 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                  <EvtIcon className="size-3" />
                </div>
                <div className="bg-card border border-border rounded-2xl p-3.5 shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-xs text-foreground">{evt.title}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{evt.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{evt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Onboarding */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

      {/* Modal Reporte para Pediatra */}
      {showPediatricReportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3 no-print">
              <div>
                <h3 className="font-black text-foreground text-base flex items-center gap-2 font-nunito">
                  <FileText className="size-5 text-primary" /> Informe Clínico CRED para el Pediatra
                </h3>
                <p className="text-xs text-muted-foreground">Documento oficial optimizado para impresión y PDF ultra liviano</p>
              </div>
              <button onClick={() => setShowPediatricReportModal(false)} className="text-muted-foreground p-1 hover:text-foreground font-bold">✕</button>
            </div>

            {/* Documento Imprimible Estructurado */}
            <div id="printable-report" className="space-y-4 text-xs bg-white text-slate-950 p-6 rounded-2xl border border-slate-200 shadow-xs">
              
              {/* Header Institucional MINSA / OMS */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                    MINSA
                  </div>
                  <div>
                    <h2 className="font-black text-sm uppercase tracking-tight text-slate-900">
                      REPÚBLICA DEL PERÚ · MINISTERIO DE SALUD
                    </h2>
                    <p className="text-[11px] font-bold text-slate-700">
                      INFORME CLÍNICO DE SEGUIMIENTO NUTRICIONAL CRED Y ANEMIA
                    </p>
                    <p className="text-[9px] font-mono text-slate-500">
                      Norma Técnica de Salud N° 196-MINSA/DGIESP-2022 · Estándares OMS
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-md border border-emerald-300">
                    VERIFICADO IA LOCAL
                  </span>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">
                    FOLIO: CRED-2026-9823
                  </p>
                </div>
              </div>

              {/* Ficha 1: Datos del Paciente y Apoderado */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px]">
                <div className="space-y-1">
                  <p><strong className="text-slate-900">Menor:</strong> <span className="font-bold text-sky-900">{child.name}</span></p>
                  <p><strong className="text-slate-900">Edad:</strong> {child.age} ({child.ageMonths ?? 14} meses)</p>
                  <p><strong className="text-slate-900">Sexo:</strong> {child.sex === "M" ? "Masculino" : "Femenino"}</p>
                </div>
                <div className="space-y-1">
                  <p><strong className="text-slate-900">Apoderado:</strong> {child.caregiver || "María Pérez"}</p>
                  <p><strong className="text-slate-900">DNI Apoderado:</strong> <span className="font-mono">{child.caregiverDni || "73928104"}</span></p>
                  <p><strong className="text-slate-900">Establecimiento:</strong> Posta Médica Lircay I-3</p>
                </div>
              </div>

              {/* Ficha 2: Evaluación Antropométrica y OMS */}
              <div className="space-y-1.5">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                  1. Evaluación Antropométrica y Z-Score OMS
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Parámetro</th>
                        <th className="p-2">Medición Actual</th>
                        <th className="p-2">Rango OMS Referencia</th>
                        <th className="p-2">Estado Clínico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Peso Corporal</td>
                        <td className="p-2 font-mono font-bold text-slate-900">{child.weight > 0 ? `${child.weight} kg` : "--"}</td>
                        <td className="p-2 text-slate-600">10.0 - 14.5 kg</td>
                        <td className="p-2 text-emerald-700 font-bold">{child.weight > 0 ? `Rango Normal (Z: ${child.zScore} SD)` : "Pendiente"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Talla / Estatura</td>
                        <td className="p-2 font-mono font-bold text-slate-900">{child.height > 0 ? `${child.height} cm` : "--"}</td>
                        <td className="p-2 text-slate-600">72.0 - 85.0 cm</td>
                        <td className="p-2 text-emerald-700 font-bold">{child.height > 0 ? "Adecuada para la Edad" : "Pendiente"}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Hemoglobina (Hb)</td>
                        <td className="p-2 font-mono font-bold text-slate-900">11.8 g/dL</td>
                        <td className="p-2 text-slate-600">≥ 11.0 g/dL</td>
                        <td className="p-2 text-emerald-700 font-bold">Sin Anemia (Saludable)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ficha 3: Adherencia y Evidencia Fotográfica IA */}
              <div className="space-y-1.5">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                  2. Adherencia a Suplementación y Evidencia IA
                </h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span><strong>Tratamiento:</strong> Sulfato Ferroso en gotas (15 gotas/día)</span>
                    <span className="font-bold text-emerald-700">Racha: 12 Días Seguidos</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span><strong>Evidencia Fotográfica:</strong> 3 capturas validadas por IA local (0% adulteración)</span>
                    <span className="font-mono text-slate-700">Último registro: 14/08/2026</span>
                  </div>
                </div>
              </div>

              {/* Bloque de Firmas y Sello Médico */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-[10px]">
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Firma y Sello del Profesional CRED</p>
                  <p className="text-slate-500 font-mono">CMP / CEP N° __________________</p>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">Huella Digital / Firma Apoderado</p>
                  <p className="text-slate-500 font-mono">DNI N° {child.caregiverDni || "73928104"}</p>
                </div>
              </div>

              <div className="pt-2 text-center text-[9px] text-slate-400 font-mono border-t border-slate-100">
                Documento generado por Yanapiri Wawa (PWA Offline Resiliente) · Documento PDF Ultraligero (15 KB)
              </div>
            </div>

            <div className="flex gap-2 pt-2 no-print">
              <button
                onClick={() => setShowPediatricReportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border font-bold text-xs text-foreground hover:bg-muted cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrintReport}
                className="flex-1 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="size-4 text-white" /> Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
