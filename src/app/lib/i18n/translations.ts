export type LanguageCode = "es" | "qu" | "ay" | "en";

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  abbrev: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: "es",
    name: "Español",
    nativeName: "Español",
    abbrev: "ES",
    region: "Perú / Internacional",
  },
  {
    code: "qu",
    name: "Quechua",
    nativeName: "Runasimi (Qhichwa)",
    abbrev: "QU",
    region: "Huancavelica / Sierra Central y Sur",
  },
  {
    code: "ay",
    name: "Aymara",
    nativeName: "Aymar aru",
    abbrev: "AY",
    region: "Puno / Altiplano",
  },
  {
    code: "en",
    name: "Inglés",
    nativeName: "English",
    abbrev: "EN",
    region: "Global / Health Research",
  },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  es: {
    // General
    "app.name": "NutriCRED",
    "app.subtitle": "Seguimiento y priorización de crecimiento infantil",
    "app.hero_pitch": "NutriCRED es la plataforma inteligente de monitoreo nutricional infantil que acompaña el crecimiento de tu bebé, combate la anemia y conecta tu hogar con el centro de salud en el Perú.",
    "app.caregiver": "Cuidador Familiar",

    "app.online": "En Línea",
    "app.offline": "Sin Conexión",
    "app.sync": "sync",
    "app.logout": "Cerrar Sesión",
    "app.settings": "Ajustes",
    "app.audio_read": "Escuchar en voz alta",
    "app.audio_stop": "Detener voz",

    // Tabs & Navigation
    "nav.home": "Inicio",
    "nav.history": "Historial",
    "nav.nutrition": "Nutrición",
    "nav.family": "Familia",
    "nav.professional": "Profesional",
    "nav.agent": "Actor Social",
    "nav.admin": "Admin",

    // Settings
    "settings.title": "Ajustes del Sistema",
    "settings.language": "Idioma de la aplicación",
    "settings.language_desc": "Elige tu lengua materna o preferida",
    "settings.theme": "Tema de color",
    "settings.theme_desc": "Selecciona el estilo visual adaptado a tu entorno",
    "settings.theme_red_gold": "Rojo y Dorado (Modo Marca)",
    "settings.theme_night_gold": "Modo Noche (Descanso Visual)",
    "settings.theme_low_vision": "Baja Visión (Alto Contraste)",
    "settings.theme_colorblind": "Daltonismo (Azul y Naranja)",
    "settings.nlu_title": "Asistente Inteligente (NLU)",
    "settings.nlu_desc":
      "Comprensión automática de dudas y triaje en lenguas originarias",
    "settings.tts_title": "Apoyo Auditivo (Texto a Voz)",
    "settings.tts_desc":
      "Reproduce en voz alta las guías paso a paso para facilitar la medición en campo",
    "settings.close": "Guardar y Cerrar",

    // Family View
    "family.greeting": "Hola, {name} ",
    "family.current_status": "Seguimiento actual:",
    "family.quick_actions": "¿Qué deseas registrar hoy?",
    "family.weight": "Pesar a mi bebé",
    "family.height": "Medir su Alturita",
    "family.muac": "Medir su Bracito",
    "family.growth_evolution": "Evolución del peso",
    "family.who_reference": "Ref. OMS",
    "family.next_cred": "Próximo Control Médico (CRED)",
    "family.cred_desc": "15 de agosto · Centro de Salud Anchonga",
    "family.history_title": "Diario de Crecimiento",
    "family.guidelines_title": "Guías de Orientación",
    "family.guidelines_subtitle": "Consejos validados por el MINSA y la OMS.",
    "family.synced": "Sincronizado",
    "family.pending_sync": "En cola offline",

    // Wizard
    "wizard.step": "Paso {step} de {total}",
    "wizard.tip": "Consejo:",
    "wizard.measured_val": "Valor medido",
    "wizard.next": "Siguiente →",
    "wizard.confirm": "Confirmar medición",
    "wizard.success_title": "¡Medición Registrada!",
    "wizard.normal_growth": "Crecimiento Normal",
    "wizard.normal_growth_desc":
      "La medición está dentro de las referencias saludables de la OMS. ¡Sigue así!",
    "wizard.alert_signal": "Señal de seguimiento identificada",
    "wizard.disclaimer":
      "Esta alerta no es un diagnóstico médico. Es una herramienta de priorización clínica.",
    "wizard.understand": "Entendido",

    // Status Alerts
    "status.normal": "Seguimiento normal",
    "status.follow_up": "Requiere seguimiento",
    "status.urgent": "Evaluación prioritaria",

    // Chatbot NLU
    "chat.title": "Yanapiri Mikhuy (Asistente Nutricional)",
    "chat.welcome":
      "¡Hola! Soy el asistente de nutrición Yanapiri Mikhuy. Pregúntame sobre alimentos ricos en hierro, papillas según edad o signos de alarma.",
    "chat.placeholder": "Escribe tu duda sobre alimentación o salud...",
    "chat.send": "Enviar",
    "chat.triage_alert": "Alerta de Triaje Detectada:",
    "chat.triage_desc":
      "Hemos detectado posibles signos de alarma. Te sugerimos acudir de inmediato al Centro de Salud.",

    // Login
    "login.title": "Yanapiri Wawa",
    "login.user": "Usuario",
    "login.password": "Contraseña",
    "login.submit": "Ingresar",
    "login.demo_btn": "Ver en Modo Demo Interactivo",
  },

  qu: {
    // General
    "app.name": "NutriCRED",
    "app.subtitle": "Wawakunapa wiñaynin qawarinapaq yanapakuy",
    "app.caregiver": "Wawa Qhawaq Ayllu",
    "app.online": "Llikapi kachkan (Online)",
    "app.offline": "Mana llikayuq (Offline)",
    "app.sync": "tupanachiy",
    "app.logout": "Lluqsiy",
    "app.settings": "Allichaykuna",
    "app.audio_read": "Kunkawan uyariy",
    "app.audio_stop": "Kunkata sayachiy",

    // Tabs & Navigation
    "nav.home": "Qallariy",
    "nav.history": "Qillqakuna",
    "nav.nutrition": "Mikhuykuna",
    "nav.family": "Ayllu",
    "nav.professional": "Hampi kamayuq",
    "nav.agent": "Runa yanapaq",
    "nav.admin": "Kamachiq",

    // Settings
    "settings.title": "Llikapa Allichayninkuna",
    "settings.language": "Rimanapaq simi",
    "settings.language_desc": "Kikin simiykita akllay (Runasimi / Qhichwa)",
    "settings.theme": "Llimp'ikuna (Colores)",
    "settings.theme_desc": "Qhawanaykipaq sumaq llimp'ita akllay",
    "settings.theme_red_gold": "Puka Quri (Kikin Llimp'i)",
    "settings.theme_night_gold": "Tuta Samay (Laqha Ñawi)",
    "settings.theme_low_vision": "Pisi Qhaway (Hatun K'anchay)",
    "settings.theme_colorblind": "Daltonismo (Anqas Llimp'i)",
    "settings.nlu_title": "Yachayniyuq Yanapaq (NLU)",
    "settings.nlu_desc": "Runasimipi tapukuykunata sumaqta hamut'an",
    "settings.tts_title": "Kunka Yanapakuy (TTS)",
    "settings.tts_desc": "Wawakunapa tupunanta kunkawan willasunki",
    "settings.close": "Waqaychay hinaspa Wisq'ay",

    // Family View
    "family.greeting": "Allillanchu, {name} ",
    "family.current_status": "Kunan qhawaynin:",
    "family.quick_actions": "Imataq rurayta munanki?",
    "family.weight": "Wawayta Llasachiq",
    "family.height": "Wawayta Tupuchiq",
    "family.muac": "Marq'anta Tupuq",
    "family.growth_evolution": "Llasayninpa Wiñaynin",
    "family.who_reference": "OMS Tupukuna",
    "family.next_cred": "Qatiqnin CRED Qhaway",
    "family.cred_desc": "15 chakra yapuy killa · Anchonga Hampi Wasi",
    "family.history_title": "Wiñayninpa Qillqan",
    "family.guidelines_title": "Sumaq Mikhuy Yachachiykuna",
    "family.guidelines_subtitle": "MINSA hinaspa OMS yachachiynin.",
    "family.synced": "Tupanachisqa",
    "family.pending_sync": "Suyachkan llikata",

    // Wizard
    "wizard.step": "Tupuna {step} kaymanta {total}",
    "wizard.tip": "Allin yachachiy:",
    "wizard.measured_val": "Tupusqayki yupay",
    "wizard.next": "Qatiqninman →",
    "wizard.confirm": "Tupusqata takyachiy",
    "wizard.success_title": "¡Tupuy allin qillqasqa!",
    "wizard.normal_growth": "Allin Wiñay",
    "wizard.normal_growth_desc":
      "Wawachaqa OMS allin wiñayninman hinam kachkan. Chaynata kawsachiy!",
    "wizard.alert_signal": "Qhawanapaq señal rikurin",
    "wizard.disclaimer":
      "Kay willakuyqa manam hampiqpa rimayninpunichu. Aswanqa utqaylla qhawanapaqmi.",
    "wizard.understand": "Allinmi, hamut'ani",

    // Status Alerts
    "status.normal": "Allin wiñaypi",
    "status.follow_up": "Qhawayta munan",
    "status.urgent": "Utqaylla hampinaman riy",

    // Chatbot NLU
    "chat.title": "Yanapiri Mikhuy (Mikhunapaq Yanapaq)",
    "chat.welcome":
      "Allillanchu! Yanapiri Mikhuy kani. Tapuway yawar jallch'anapaq (sangrecita, bazo), wawapa mikhuyninmanta icha unquykunamanta.",
    "chat.placeholder": "Mikhuykunamanta icha qhali kaymanta tapukuy...",
    "chat.send": "Apachiy",
    "chat.triage_alert": "Hatun Unquy Rikurisqa:",
    "chat.triage_desc":
      "Wawacha unqusqatam rikurichkan. Utqaylla Hampi Wasiman pusay.",

    // Login
    "login.title": "Yanapiri Wawa",
    "login.user": "Suti",
    "login.password": "Pakasqa Simi",
    "login.submit": "Yaykuy",
    "login.demo_btn": "Qhawaypaq Demo nisqaman yaykuy",
  },

  ay: {
    // General
    "app.name": "NutriCRED",
    "app.subtitle": "Wawanakan jilawi uñjañataki yanapa",
    "app.caregiver": "Wawa Uñjir Ayllu",
    "app.online": "Llikanpiwa (Online)",
    "app.offline": "Jan llikani (Offline)",
    "app.sync": "chikachawi",
    "app.logout": "Mistsuña",
    "app.settings": "Mayjt'awinaka",
    "app.audio_read": "Aru ist'aña",
    "app.audio_stop": "Aru sayt'ayaña",

    // Tabs & Navigation
    "nav.home": "Qallta",
    "nav.history": "Qillqatanaka",
    "nav.nutrition": "Manq'awinaka",
    "nav.family": "Wila Masi",
    "nav.professional": "Qulliri",
    "nav.agent": "Ayllu Yanapiri",
    "nav.admin": "Irpiri",

    // Settings
    "settings.title": "Llikan Mayjt'awinakapa",
    "settings.language": "Aru akllawi",
    "settings.language_desc": "Juman aymar aru akllt'asim",
    "settings.theme": "Samillanaka (Colores)",
    "settings.theme_desc": "Uñjañataki k'achacht'awinaka akllt'asim",
    "settings.theme_red_gold": "Wila Quri (Marca Samilla)",
    "settings.theme_night_gold": "Aruma Samay (Ch'iyara Nayra)",
    "settings.theme_low_vision": "Jisk'a Uñjaña (Jach'a Qhana)",
    "settings.theme_colorblind": "Daltonismo (Larama Samilla)",
    "settings.nlu_title": "Yatiñani Yanapiri (NLU)",
    "settings.nlu_desc": "Aymar aruta sum amuyt'i",
    "settings.tts_title": "Aru Ist'añataki (TTS)",
    "settings.tts_desc": "Wawan tupunakap arumpi yatiyañataki",
    "settings.close": "Imt'aña ukat jist'antaña",

    // Family View
    "family.greeting": "Kamisaraki, {name} ",
    "family.current_status": "Jichha uñjawi:",
    "family.quick_actions": "Kunjam luraw munta?",
    "family.weight": "Wawajaru jathiyaña",
    "family.height": "Sayt'upa tupuña",
    "family.muac": "Amparapa tupuña",
    "family.growth_evolution": "Jathi Jilawipa",
    "family.who_reference": "OMS Tupunaka",
    "family.next_cred": "Jutir CRED Uñjawi",
    "family.cred_desc": "15 llumpaqa phaxsi · Anchonga Qullañ Uta",
    "family.history_title": "Jilawipata Qillqanaka",
    "family.guidelines_title": "Suma Manq'añ Yatiyawinaka",
    "family.guidelines_subtitle": "MINSA ukat OMS yatichawinaka.",
    "family.synced": "Chikachatawa",
    "family.pending_sync": "Llikar suyt'aski",

    // Wizard
    "wizard.step": "Tupuña {step} akata {total}",
    "wizard.tip": "Yatichawi:",
    "wizard.measured_val": "Tupusma uka jakhu",
    "wizard.next": "Jutiriru →",
    "wizard.confirm": "Tupuña iyaw saña",
    "wizard.success_title": "¡Tupuña sum qillqataxiwa!",
    "wizard.normal_growth": "Suma Jilawi",
    "wizard.normal_growth_desc":
      "Wawaxa OMS suma jilawi kankiw. Ukham ch'amachaskakiñani!",
    "wizard.alert_signal": "Uñjañataki unanchatawa",
    "wizard.disclaimer":
      "Aka yatiyawi janiw qulliripan aruparjamakiti. Janiw jach'a usunaka utjañapataki uñt'atawa.",
    "wizard.understand": "Amuyt'twa",

    // Status Alerts
    "status.normal": "Suma jilawi",
    "status.follow_up": "Uñjañ munaski",
    "status.urgent": "Jank'ak qullañ utar saraña",

    // Chatbot NLU
    "chat.title": "Yanapiri Mikhuy (Manq'añataki Yanapiri)",
    "chat.welcome":
      "Kamisaki! Yanapiri Mikhuy satäthwa. Wilanchañataki (sangrecita, bazo), wawanak manq'añapatak jiskt'itasma.",
    "chat.placeholder": "Manq'awinakats usunakats jiskt'asim...",
    "chat.send": "Apayaña",
    "chat.triage_alert": "Jach'a Usunaka Uñstatawa:",
    "chat.triage_desc":
      "Wawaxa usutat uñjasiwa. Jank'aki Qullañ Utaru irpañawa.",

    // Login
    "login.title": "Yanapiri Wawa",
    "login.user": "Suma suti",
    "login.password": "Imat aru",
    "login.submit": "Mantaña",
    "login.demo_btn": "Demo uñjañataki mantaña",
  },

  en: {
    // General
    "app.name": "NutriCRED",
    "app.subtitle": "Child Growth Monitoring and Care Prioritization",
    "app.caregiver": "Family Caregiver",
    "app.online": "Online",
    "app.offline": "Offline Mode",
    "app.sync": "sync",
    "app.logout": "Log Out",
    "app.settings": "Settings",
    "app.audio_read": "Listen aloud",
    "app.audio_stop": "Stop audio",

    // Tabs & Navigation
    "nav.home": "Home",
    "nav.history": "History",
    "nav.nutrition": "Nutrition",
    "nav.family": "Family",
    "nav.professional": "Health Professional",
    "nav.agent": "Community Agent",
    "nav.admin": "Admin",

    // Settings
    "settings.title": "System Settings",
    "settings.language": "App Language",
    "settings.language_desc":
      "Choose your primary language or native Andean tongue",
    "settings.theme": "Color Theme",
    "settings.theme_desc":
      "Select visual palette adapted to your working environment",
    "settings.theme_red_gold": "Red & Gold (Brand Theme)",
    "settings.theme_night_gold": "Night Mode (Eye Rest)",
    "settings.theme_low_vision": "Low Vision (High Contrast)",
    "settings.theme_colorblind": "Color Blindness (Blue & Orange)",
    "settings.nlu_title": "Intelligent Assistant (NLU)",
    "settings.nlu_desc":
      "Natural Language Understanding for multilingual nutrition triage",
    "settings.tts_title": "Audio Support (Text to Speech)",
    "settings.tts_desc":
      "Provides spoken audio step-by-step guidance for rural field workers",
    "settings.close": "Save and Close",

    // Family View
    "family.greeting": "Hello, {name} ",
    "family.current_status": "Current status:",
    "family.quick_actions": "What do you want to register today?",
    "family.weight": "Weigh my baby",
    "family.height": "Measure Height",
    "family.muac": "Measure Arm",
    "family.growth_evolution": "Weight Growth Curve",
    "family.who_reference": "WHO Ref.",
    "family.next_cred": "Next CRED Checkup",
    "family.cred_desc": "August 15th · Anchonga Health Center",
    "family.history_title": "Growth Diary",
    "family.guidelines_title": "Nutrition Guidance",
    "family.guidelines_subtitle": "Protocols validated by MOH (MINSA) and WHO.",
    "family.synced": "Synced",
    "family.pending_sync": "Pending offline",

    // Wizard
    "wizard.step": "Step {step} of {total}",
    "wizard.tip": "Helpful Tip:",
    "wizard.measured_val": "Measured value",
    "wizard.next": "Next Step →",
    "wizard.confirm": "Confirm Measurement",
    "wizard.success_title": "Measurement Registered!",
    "wizard.normal_growth": "Healthy Growth",
    "wizard.normal_growth_desc":
      "The child's growth is within the standard WHO references. Keep it up!",
    "wizard.alert_signal": "Follow-up signal detected",
    "wizard.disclaimer":
      "This alert is not a medical diagnosis. It is an algorithmic prioritization tool.",
    "wizard.understand": "Understood",

    // Status Alerts
    "status.normal": "Standard tracking",
    "status.follow_up": "Requires follow-up",
    "status.urgent": "Priority clinical evaluation",

    // Chatbot NLU
    "chat.title": "Yanapiri Mikhuy (Nutrition Assistant)",
    "chat.welcome":
      "Hello! I am Yanapiri Mikhuy. Ask me about iron-rich foods, baby feeding stages or alarm symptoms.",
    "chat.placeholder": "Type your nutrition or child health question...",
    "chat.send": "Send",
    "chat.triage_alert": "Clinical Triage Alert:",
    "chat.triage_desc":
      "Alarm signs detected. We recommend visiting your nearest Community Health Center immediately.",

    // Login
    "login.title": "Yanapiri Wawa",
    "login.user": "Username",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.demo_btn": "Enter Interactive Demo Mode",
  },
};
