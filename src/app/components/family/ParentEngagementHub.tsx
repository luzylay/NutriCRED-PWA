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
    const text = `👶 Resumen de Crecimiento CRED de ${child.name}:\n• Edad: ${child.age}\n• Peso: ${child.weight} kg\n• Talla: ${child.height} cm\n• Estado: Nutrición Óptima (Yanapiri Wawa Perú)`;
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

  // Educational tips list
  const tips = [
    { title: "Vitamina C + Hierro", desc: "Acompaña las comidas con frutas cítricas para triplicar la absorción de hierro.", cat: "Nutrición" },
    { title: "Sangrecita y Bazo", desc: "2 cucharadas de sangrecita aportan el hierro diario que tu bebé necesita para prevenir la anemia.", cat: "Recetas MINSA" },
    { title: "Lavado de Manos", desc: "Lava tus manos con agua y jabón antes de preparar los alimentos del bebé.", cat: "Higiene" },
    { title: "Estimulación Temprana", desc: "Habla y cántale a tu bebé durante las comidas para fortalecer el vínculo afectivo.", cat: "Desarrollo" },
  ];

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-xl space-y-6">
      {/* Top Banner with Streaks Counter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md">
            <Flame className="size-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground tracking-tight font-nunito flex items-center gap-2">
                Estrategia & Acompañamiento
              </h2>
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
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
            <Sparkles className="size-3.5" /> Onboarding Guía
          </button>

          <button
            onClick={handleShareProgress}
            className="px-4 py-2 rounded-xl btn-gradient text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <Share2 className="size-3.5" /> Compartir
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/40 rounded-2xl border border-border">
        {[
          { id: "achievements", label: "🏆 Logros", icon: Trophy },
          { id: "report", label: "📄 Reporte Pediatra", icon: FileText },
          { id: "emergency", label: "🚑 Emergencias", icon: PhoneCall },
          { id: "timeline", label: "📜 Línea Tiempo", icon: Calendar },
          { id: "percentiles", label: "📊 Percentiles", icon: Percent },
          { id: "gallery", label: "📸 Galería", icon: Camera },
          { id: "stats", label: "📈 Estadísticas", icon: BarChart3 },
          { id: "tips", label: "💡 Tips", icon: BookOpen },
          { id: "help", label: "❓ Ayuda", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-card text-primary shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Logros y Rachas */}
      {activeTab === "achievements" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔥</span>
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
              { id: "a1", icon: "🏆", title: "Guardián del Crecimiento", desc: "3 controles CRED registrados a tiempo.", badge: "Oro" },
              { id: "a2", icon: "🛡️", title: "Escudo Vacunal MINSA", desc: "Esquema de vacunas al día.", badge: "Platino" },
              { id: "a3", icon: "🥗", title: "Chef Nutritivo Andino", desc: "Plato rico en hierro hemínico escaneado.", badge: "Plata" },
              { id: "a4", icon: "📸", title: "Evidencia Verificada IA", desc: "Fotografía de frasco validada en 100% CPU.", badge: "Bronce" },
            ].map((a) => (
              <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                <div className="text-3xl p-2 bg-muted/40 rounded-2xl shrink-0">{a.icon}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xs text-foreground">{a.title}</h4>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{a.badge}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reporte para Pediatra */}
      {activeTab === "report" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-foreground">Reporte Oficial de Crecimiento CRED</h3>
                <p className="text-xs text-muted-foreground">Documento clínico resumido para entregar en el Centro de Salud.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPediatricReportModal(true)}
              className="px-4 py-2 rounded-xl btn-gradient text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
            >
              Ver / Imprimir Reporte
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h4 className="font-extrabold text-xs text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" /> Resumen del Diagnóstico Clínico
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[10px]">Paciente</span>
                <strong className="text-foreground">{child.name}</strong>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[10px]">Peso Actual</span>
                <strong className="text-foreground">{child.weight} kg</strong>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[10px]">Talla Actual</span>
                <strong className="text-foreground">{child.height} cm</strong>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[10px]">Z-Score OMS</span>
                <strong className="text-emerald-600">{child.zScore ?? -0.8} SD</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Contactos de Emergencia */}
      {activeTab === "emergency" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
            <ShieldAlert className="size-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-black text-sm text-foreground">Directorio de Atención Médica & S.O.S.</h3>
              <p className="text-xs text-muted-foreground">Contactos gratuitos las 24 horas del día en todo el Perú.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "SAMU Perú (Urgencias)", phone: "106", desc: "Ambulancias y rescate médico de emergencia", icon: "🚑", color: "bg-red-500" },
              { name: "Línea 113 MINSA Salud", phone: "113", desc: "Orientación médica telefónica gratuita", icon: "🏥", color: "bg-blue-600" },
              { name: "Posta Médica Lircay", phone: "067-451230", desc: "Establecimiento de Salud I-3 Huancavelica", icon: "🩺", color: "bg-emerald-600" },
              { name: "Promotora de Salud", phone: "+51 987 654 321", desc: "Visita domiciliaria y seguimiento CRED", icon: "👩‍⚕️", color: "bg-amber-600" },
            ].map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-primary transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-muted/40 rounded-xl">{contact.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-foreground">{contact.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{contact.desc}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-primary text-white font-mono font-bold text-xs shadow-xs shrink-0">
                  {contact.phone}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Línea de Tiempo */}
      {activeTab === "timeline" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="relative border-l-2 border-primary/30 ml-4 space-y-6">
            {[
              { date: "14 Ago, 2026", title: "Suplementación Diaria Registrada", desc: "15 gotas de sulfato ferroso administradas.", icon: "💊" },
              { date: "10 Ago, 2026", title: "Escáner de Plato Nutritivo AR", desc: "Plato detectado: Sangrecita con papa nativa.", icon: "🥗" },
              { date: "28 Jul, 2026", title: "Control CRED 2 Meses", desc: "Peso: 5.4 kg, Talla: 58 cm. Estado de salud normal.", icon: "📏" },
            ].map((evt, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[11px] top-1 size-5 rounded-full bg-card border-2 border-primary flex items-center justify-center text-[10px]">
                  {evt.icon}
                </div>
                <div className="bg-card border border-border rounded-2xl p-3.5 shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-xs text-foreground">{evt.title}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{evt.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Percentiles */}
      {activeTab === "percentiles" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h4 className="font-bold text-xs text-foreground mb-3 flex items-center gap-2">
              <LineChart className="size-4 text-primary" /> Curva de Crecimiento OMS
            </h4>
            <GrowthChart data={growthData} height={200} unit="kg" />
          </div>
        </div>
      )}

      {/* Tab 6: Galería */}
      {activeTab === "gallery" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {photos.map((p) => (
              <div key={p.id} className="bg-muted/20 border border-border rounded-2xl p-3 space-y-2 text-center">
                <div className="size-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center text-primary font-black">
                  <Camera className="size-8 opacity-60" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{p.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{p.label} · {p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Estadísticas de Uso */}
      {activeTab === "stats" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-2xl font-black text-primary block font-mono">18</span>
              <span className="text-[11px] font-bold text-muted-foreground">Evaluaciones CRED</span>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-2xl font-black text-emerald-600 block font-mono">12</span>
              <span className="text-[11px] font-bold text-muted-foreground">Fotos Validadas IA</span>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-2xl font-black text-purple-600 block font-mono">100%</span>
              <span className="text-[11px] font-bold text-muted-foreground">Resiliencia Offline</span>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-2xl font-black text-amber-500 block font-mono">12 d</span>
              <span className="text-[11px] font-bold text-muted-foreground">Racha Nutritiva</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Tips Educativos */}
      {activeTab === "tips" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {tips.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-xs text-foreground flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-primary" /> {t.title}
                </h4>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{t.cat}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 9: Centro de Ayuda & FAQ */}
      {activeTab === "help" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-extrabold text-xs text-foreground flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" /> Preguntas Frecuentes y Soporte
            </h3>
            <button
              onClick={() => setIsOfflineGuideOpen(true)}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              Abrir Guía Offline
            </button>
          </div>

          {faqs.map((f) => {
            const isOpen = openFaqId === f.id;
            return (
              <div key={f.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all shadow-xs">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : f.id)}
                  className="w-full p-3.5 text-left font-bold text-xs text-foreground flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Onboarding */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

      {/* Modal Reporte para Pediatra */}
      {showPediatricReportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-xl rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="font-black text-foreground text-base flex items-center gap-2">
                  <FileText className="size-5 text-primary" /> Informe Clínico CRED para el Pediatra
                </h3>
                <p className="text-xs text-muted-foreground">Documento oficial de seguimiento infantil Yanapiri Wawa</p>
              </div>
              <button onClick={() => setShowPediatricReportModal(false)} className="text-muted-foreground p-1">✕</button>
            </div>

            <div id="printable-report" className="space-y-4 text-xs">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Menor: {child.name}</span>
                  <span>Edad: {child.age}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sexo: {child.sex === "M" ? "Masculino" : "Femenino"}</span>
                  <span>DNI Apoderado: {child.caregiverDni || "Registrado"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-foreground">Histórico Antropométrico</h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted text-[11px] font-bold">
                      <tr>
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Peso (kg)</th>
                        <th className="p-2">Talla (cm)</th>
                        <th className="p-2">Z-Score OMS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-2 font-mono">14/08/2026</td>
                        <td className="p-2 font-bold">{child.weight} kg</td>
                        <td className="p-2 font-bold">{child.height} cm</td>
                        <td className="p-2 font-bold text-emerald-600">{child.zScore ?? -0.8} SD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[11px] text-blue-700 dark:text-blue-300">
                ℹ️ Informe generado con estándares OMS y Norma Técnica de Salud N° 196-MINSA/DGIESP-2022.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPediatricReportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrintReport}
                className="flex-1 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="size-4" /> Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
