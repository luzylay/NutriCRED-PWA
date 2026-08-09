import type { LanguageCode } from "./translations";

export type NLUIntent =
  | "nutrition_6_8_months"
  | "nutrition_9_11_months"
  | "nutrition_12_24_months"
  | "anemia_iron_prevention"
  | "muac_information"
  | "cred_checkup_info"
  | "emergency_alarm_signs"
  | "breastfeeding_guidance"
  | "general_nutrition";

export interface NLUEvaluationResult {
  intent: NLUIntent;
  confidence: number;
  detectedLanguage: LanguageCode;
  isEmergencyTriage: boolean;
  replyText: string;
  suggestedAction?: string;
  sourceRef: string;
}

// ─── MULTILINGUAL INTENT KEYWORDS / PHONETICS ─────────────────────────────────

const INTENT_PATTERNS: Record<NLUIntent, Record<LanguageCode, string[]>> = {
  emergency_alarm_signs: {
    es: [
      "fiebre",
      "calentura",
      "diarrea",
      "vomita",
      "no come nada",
      "letargo",
      "no reacciona",
      "convulsion",
      "ahogo",
      "sangre",
      "desmayo",
      "grave",
      "emergencia",
      "muy enfermo",
    ],
    qu: [
      "rupariy",
      "q'icha",
      "kutipakuy",
      "mana mikhunchu",
      "mana kuyunchu",
      "wichari",
      "sinchi unqusqa",
      "llakipayay",
    ],
    ay: [
      "t'unqu",
      "q'icha",
      "kutiy",
      "janiw manq'kiti",
      "wali usu",
      "ch'amap tukusita",
      "usutawa",
    ],
    en: [
      "fever",
      "diarrhea",
      "vomiting",
      "refuses to eat",
      "lethargic",
      "convulsion",
      "choking",
      "blood",
      "severe",
      "emergency",
      "fainting",
    ],
  },
  nutrition_6_8_months: {
    es: [
      "6 a 8 meses",
      "6 meses",
      "7 meses",
      "8 meses",
      "primeras papillas",
      "iniciar comida",
      "semisolido",
      "pure",
    ],
    qu: [
      "6 killa",
      "7 killa",
      "8 killa",
      "suqta killa",
      "ñawpaq mikhuna",
      "api",
      "lluklla",
    ],
    ay: [
      "6 phaxsi",
      "7 phaxsi",
      "8 phaxsi",
      "suxta phaxsi",
      "nayrïr manq'awi",
      "api",
    ],
    en: [
      "6 to 8 months",
      "6 months",
      "7 months",
      "8 months",
      "first purees",
      "complementary feeding starting",
    ],
  },
  nutrition_9_11_months: {
    es: [
      "9 a 11 meses",
      "9 meses",
      "10 meses",
      "11 meses",
      "comida picada",
      "picadito",
      "medio plato",
    ],
    qu: [
      "9 killa",
      "10 killa",
      "11 killa",
      "isqun killa",
      "kuchusqa mikhuy",
      "kuskan plato",
    ],
    ay: [
      "9 phaxsi",
      "10 phaxsi",
      "11 phaxsi",
      "llätunka phaxsi",
      "kuchut manq'a",
      "chika plato",
    ],
    en: [
      "9 to 11 months",
      "9 months",
      "10 months",
      "11 months",
      "finely chopped foods",
      "half plate",
    ],
  },
  nutrition_12_24_months: {
    es: [
      "12 a 24 meses",
      "1 año",
      "2 años",
      "12 meses",
      "comida de la olla",
      "plato completo",
      "segundo",
    ],
    qu: [
      "huk wata",
      "iskay wata",
      "12 killa",
      "ayllupa mikhunan",
      "hunt'a plato",
    ],
    ay: [
      "maya mara",
      "paya mara",
      "12 phaxsi",
      "utanjam manq'a",
      "phuqhat plato",
    ],
    en: [
      "12 to 24 months",
      "1 year",
      "2 years",
      "12 months",
      "family meal",
      "solid food",
    ],
  },
  anemia_iron_prevention: {
    es: [
      "anemia",
      "hierro",
      "sangrecita",
      "bazo",
      "higado",
      "chispitas",
      "gotas de hierro",
      "palido",
      "pálido",
    ],
    qu: [
      "yawar pisiyay",
      "sangrecita",
      "bazo",
      "kuku",
      "yawar jallch'ay",
      "q'illuyay",
    ],
    ay: [
      "wila pisi",
      "sangrecita",
      "bazo",
      "k'ipcha",
      "wila ch'allxtay",
      "q'illu",
    ],
    en: [
      "anemia",
      "iron",
      "chicken blood",
      "spleen",
      "liver",
      "iron drops",
      "pale",
    ],
  },
  muac_information: {
    es: [
      "muac",
      "cinta",
      "perimetro braquial",
      "perímetro braquial",
      "brazo",
      "cinta de colores",
      "rojo amarillo verde",
    ],
    qu: ["marq'a tupu", "muac", "marq'a", "rikra cinta", "puka q'ellu q'omer"],
    ay: [
      "ampar tupu",
      "muac",
      "ampara",
      "cinta saminaka",
      "wila q'illu ch'uxña",
    ],
    en: [
      "muac",
      "mid-upper arm circumference",
      "arm tape",
      "color tape",
      "malnutrition tape",
    ],
  },
  cred_checkup_info: {
    es: [
      "cred",
      "control",
      "cita",
      "vacuna",
      "centro de salud",
      "posta",
      "cuando llevarlo",
    ],
    qu: [
      "cred qhaway",
      "hampi wasi",
      "vacuna",
      "hampina cita",
      "mayk'aq pusana",
    ],
    ay: ["cred uñjawi", "qullañ uta", "vacuna", "kunapach irpaña"],
    en: [
      "cred",
      "checkup",
      "well child visit",
      "vaccine",
      "health center",
      "appointment",
    ],
  },
  breastfeeding_guidance: {
    es: [
      "pecho",
      "lactancia",
      "leche materna",
      "tetita",
      "amamantar",
      "dar de lactar",
      "exclusiva",
    ],
    qu: ["ñuñu", "ñuñuchiy", "mamanpa lichin", "chunka suqtayuq killa"],
    ay: ["ñuñu", "ñuñuyaña", "taykan lichipa"],
    en: ["breastfeeding", "breast milk", "nursing", "exclusive breastfeeding"],
  },
  general_nutrition: {
    es: [
      "comer",
      "nutricion",
      "alimento",
      "peso",
      "verdura",
      "fruta",
      "huevo",
      "agua",
    ],
    qu: ["mikhuy", "mikhuna", "llullu", "runtu", "yaku", "ch'aki mikhuy"],
    ay: ["manq'a", "manq'awi", "k'awnap", "uma"],
    en: [
      "food",
      "nutrition",
      "eat",
      "weight",
      "vegetables",
      "fruits",
      "egg",
      "water",
    ],
  },
};

// ─── RESPONSES KNOWLEDGE BASE ────────────────────────────────────────────────

const KNOWLEDGE_RESPONSES: Record<
  NLUIntent,
  Record<LanguageCode, { text: string; source: string; action?: string }>
> = {
  emergency_alarm_signs: {
    es: {
      text: "ATENCIÓN: Los síntomas mencionados (como fiebre, diarrea persistente o inapetencia crítica) son señales de alerta clínica. Por favor, acude DE INMEDIATO al Centro de Salud más cercano para evaluación médica presencial.",
      source: "Norma Técnica MINSA CRED (NTS 137) / AIEPI Comunitario",
      action: "Acudir a Emergencia / Centro de Salud",
    },
    qu: {
      text: "UTQAYLLA HAMPI WASIMAN RIY: Wawapa unquynin (rupariy, q'icha, mana mikhuy) manam allinchu. Utqaylla Hampi Wasiman apay hampi kamayuq qhawanapaq.",
      source: "MINSA Perú AIEPI Runasimipi / OMS",
      action: "Utqaylla Hampi Wasiman Pusana",
    },
    ay: {
      text: "JANK'AKI QULLAÑ UTARU IRPAÑAW: Aka unquñanaka (t'unqu, q'icha, jan manq'awi) jach'a usuriwa. Jank'aki Qullañ Utaru apapxam qullirixa uñjañapataki.",
      source: "MINSA Perú AIEPI Aymar aruta / OMS",
      action: "Qullañ Utaru Jank'aki Saraña",
    },
    en: {
      text: "EMERGENCY CLINICAL ALERT: Symptoms like fever, persistent diarrhea, or refusal to eat are clinical danger signs. Please take the child IMMEDIATELY to the nearest Health Center.",
      source: "WHO IMCI Guidelines / MINSA NTS 137",
      action: "Seek Immediate Medical Attention",
    },
  },
  nutrition_6_8_months: {
    es: {
      text: "A los 6 a 8 meses: Se inicia la alimentación complementaria con 2 a 3 cucharadas llenas (purés o papillas espesas) 2 veces al día. Prioriza sangrecita de pollo, bazo o hígado machacado para prevenir la anemia.",
      source: "Guías Alimentarias MINSA / OMS",
    },
    qu: {
      text: "6-manta 8 killayoq wawakuna: Api hinaspa lluklla mikhuynintam 2-manta 3 wisllachata qallarinan p'unchawpi 2 kutita. Sangrecita, bazo hinaspa kuku k'utuykuypuni yawarnin kallpachasqa kananpaq.",
      source: "MINSA Allin Mikhuy Yachachiykuna",
    },
    ay: {
      text: "6-ta 8 phaxsini wawanaka: 2-ta 3 wisllachanakapi api manq'aña qalltapxañapa urun 2 kuti. Sangrecita, bazo ukat k'ipcha ch'allxtapxam wila ch'amanchañataki.",
      source: "MINSA Suma Manq'añ Yatichawinaka",
    },
    en: {
      text: "For 6 to 8 months: Start complementary feeding with 2 to 3 tablespoons of thick porridge/puree 2 times a day. Prioritize iron-rich chicken blood (sangrecita), spleen, or pureed liver.",
      source: "WHO Infant and Young Child Feeding (IYCF)",
    },
  },
  nutrition_9_11_months: {
    es: {
      text: "A los 9 a 11 meses: Alimentos picados finamente (medio plato mediano) 3 veces al día. Agrega yema de huevo cocida, pescados oscuros y menestras sin cáscara.",
      source: "Guías Alimentarias MINSA",
    },
    qu: {
      text: "9-manta 11 killayoq wawakuna: Kuchusqa mikhuynintam (kuskan platota) 3 kutita sapa p'unchaw mikhunan. Runtu q'ellunta, chawata hinaspa llullu hawasta yapaykuy.",
      source: "MINSA CRED Yachachiykuna",
    },
    ay: {
      text: "9-ta 11 phaxsini wawanaka: Kuchut manq'anakampi (chika platopi) 3 kuti urunakan manq'aña. K'awnap q'illupa ukat chawlla yapapxasmawa.",
      source: "MINSA CRED Yatichawinaka",
    },
    en: {
      text: "For 9 to 11 months: Finely chopped foods (half a medium plate) 3 times a day. Add cooked egg yolk, dark fish, and peeled legumes.",
      source: "WHO Infant Nutrition Standards",
    },
  },
  nutrition_12_24_months: {
    es: {
      text: "De 12 a 24 meses: El niño se incorpora a la comida familiar (platos de segundo completos) 4 a 5 veces al día (3 comidas principales y 2 entrecomidas saludables con frutas).",
      source: "Guías Alimentarias MINSA para Menores de 2 Años",
    },
    qu: {
      text: "12-manta 24 killayoq: Ayllupa mikhunantam hunt'a platota 4-manta 5 kutita mikhunan (3 hatun mikhuykuna hinaspa 2 ruru mikhuyninchik).",
      source: "MINSA Perú Yachachiykuna",
    },
    ay: {
      text: "12-ta 24 phaxsini wawa: Utan manq'at phuqhat platopi 4-ta 5 kuti uruna manq'aña (3 jach'a manq'awi ukat achunaka).",
      source: "MINSA Perú Yatichawinaka",
    },
    en: {
      text: "For 12 to 24 months: Full solid family meals 4 to 5 times a day (3 main balanced meals plus 2 healthy fruit snacks).",
      source: "WHO Nutrition Guidelines",
    },
  },
  anemia_iron_prevention: {
    es: {
      text: "Prevención de anemia: Los alimentos de origen animal ricos en hierro (sangrecita, bazo de pollo, hígado) son vitales diariamente. Cumple con la suplementación preventiva con gotas de hierro desde los 4 a 6 meses según indicación de tu centro de salud.",
      source: "Plan Nacional de Reducción y Control de la Anemia (MINSA)",
    },
    qu: {
      text: "Yawar pisiyay jark'anapaq: Sangrecita, bazo hinaspa kuku sapa p'unchaw mikhuyninpi kanan. 4-manta 6 killayuqmantapacha sut'uy hierro hampi chaskisqaykita quypuni.",
      source: "MINSA Anemia Jark'anapaq Kamachikuy",
    },
    ay: {
      text: "Wila pisi jark'añataki: Sangrecita, bazo ukat k'ipchanakax urut jamuqawa. Qullañ utan churasma uka sut'uña hierro wawatakix churasipkakim.",
      source: "MINSA Anemia Jark'awinaka",
    },
    en: {
      text: "Anemia Prevention: Animal-source iron-rich foods (chicken blood, spleen, liver) must be given daily. Ensure daily iron drops supplementation prescribed at your CRED visit.",
      source: "Peru Ministry of Health / WHO Anemia Guidelines",
    },
  },
  muac_information: {
    es: {
      text: "Cinta MUAC (Perímetro Braquial): Mide el contorno del brazo izquierdo en niños de 6 a 59 meses. Verde (>12.5 cm) = Crecimiento normal. Amarillo (11.5 a 12.5 cm) = Riesgo moderado. Rojo (<11.5 cm) = Desnutrición aguda severa con derivación prioritaria.",
      source: "Protocolo MUAC / OMS & UNICEF 2013",
    },
    qu: {
      text: "MUAC Marq'a Tupu: 6-manta 59 killayoq wawapa ichuq marq'antam tupan. Q'omer (>12.5 cm) = Allin. Q'ellu (11.5 - 12.5 cm) = Qhawanapaq. Puka (<11.5 cm) = Sinchi pisiyay, utqaylla hampinaman.",
      source: "OMS & UNICEF MUAC Yachachiy",
    },
    ay: {
      text: "MUAC Ampar Tupu: 6-ta 59 phaxsini wawan amparaparuw tupi. Ch'uxña (>12.5 cm) = Suma. Q'illu (11.5 - 12.5 cm) = Uñjaña. Wila (<11.5 cm) = Usutawa, jank'aki qulliriñaru.",
      source: "OMS & UNICEF MUAC Yatichawi",
    },
    en: {
      text: "MUAC Tape (Mid-Upper Arm Circumference): Measures arm girth for 6–59 months. Green (>12.5 cm) = Normal. Yellow (11.5–12.5 cm) = Moderate risk. Red (<11.5 cm) = Severe acute malnutrition requiring urgent care.",
      source: "WHO/UNICEF MUAC Protocol",
    },
  },
  cred_checkup_info: {
    es: {
      text: "Control CRED (Crecimiento y Desarrollo): Es la evaluación integral mensual que realiza la enfermera en el Centro de Salud para medir peso, talla, descarte de anemia, tamizaje y vacunas del calendario nacional.",
      source: "Norma Técnica de Salud CRED NTS 137-MINSA",
    },
    qu: {
      text: "CRED Qhaway: Hampi Wasipi enfermerapa wawacha llasayninta, sayayninta, yawarninta hinaspa vacunankunata sapa killa qhawayninmi.",
      source: "MINSA CRED Kamachikuy",
    },
    ay: {
      text: "CRED Uñjawi: Qullañ utan enfermerax wawan jathipa, sayt'upa, wilapa ukat vacunankunap phaxsinakaru sum uñji.",
      source: "MINSA CRED Kamachikuwinaka",
    },
    en: {
      text: "CRED Checkup: Regular well-child development assessment at the Health Center covering weight, height, anemia screening, and national vaccination schedules.",
      source: "MINSA CRED Standard / WHO",
    },
  },
  breastfeeding_guidance: {
    es: {
      text: "Lactancia Materna: Exclusiva hasta los 6 meses (no necesita agua ni té). A partir de los 6 meses se complementa con comidas espesas y se mantiene hasta los 2 años o más.",
      source: "OMS / MINSA Recomendaciones de Lactancia",
    },
    qu: {
      text: "Ñuñuchiy: 6 killakama mamapa lichillanmi (mana yakuta quspa). 6 killamantam mikhuywan kuska 2 watakama ñuñuchina.",
      source: "MINSA Ñuñuchiy Yachachiy",
    },
    ay: {
      text: "Taykan Ñuñupa: 6 phaxsikama taykan ñuñupakiw (janiw uma churataxiti). 6 phaxsitx manq'ampi chik 2 marakama churapxañawa.",
      source: "MINSA Ñuñuyañ Yatichawinaka",
    },
    en: {
      text: "Exclusive Breastfeeding is the gold standard until 6 months. Continue alongside nutritious complementary food up to 2 years or beyond.",
      source: "WHO Breastfeeding Guidelines",
    },
  },
  general_nutrition: {
    es: {
      text: "Para un crecimiento saludable: Ofrece platos variados y espesos con alimentos de origen animal diarios (hígado, huevo, sangrecita), verduras y frutas de estación, agua hervida y lavado de manos.",
      source: "Guías Alimentarias del Perú - MINSA",
    },
    qu: {
      text: "Sumaq Wiñaypaq: Rakhu mikhuyninchikta ruray kukuwan, runtuwan, sangrecitawan, llullu yuyukunawan, ch'uya yakuwan hinaspa maki mayllakuywan.",
      source: "MINSA Allin Kawsay Yachachiy",
    },
    ay: {
      text: "Suma Jilawitaki: Suma manq'anaka k'ipchampi, k'awnampi, sangrecitampi, ch'uxña achunakampi ukat ampar jariqt'asiñampi churañawa.",
      source: "MINSA Suma Qamañ Yatichawinaka",
    },
    en: {
      text: "For optimal child growth: Offer diverse thick meals with daily animal sources (liver, eggs, sangrecita), seasonal fruits/vegetables, boiled water and handwashing.",
      source: "MINSA / WHO Infant Nutrition Guidelines",
    },
  },
};

// ─── NLU EVALUATOR ────────────────────────────────────────────────────────────

export function evaluateNLUQuery(
  rawInput: string,
  preferredLanguage: LanguageCode = "es",
): NLUEvaluationResult {
  const normalized = rawInput.toLowerCase().trim();
  const languagesToScan: LanguageCode[] = [
    preferredLanguage,
    "es",
    "qu",
    "ay",
    "en",
  ];

  // 1. Check emergency alarm signs first (Priority Triage)
  for (const lang of languagesToScan) {
    const patterns = INTENT_PATTERNS.emergency_alarm_signs[lang];
    if (patterns.some((kw) => normalized.includes(kw))) {
      const resp = KNOWLEDGE_RESPONSES.emergency_alarm_signs[preferredLanguage];
      return {
        intent: "emergency_alarm_signs",
        confidence: 0.96,
        detectedLanguage: lang,
        isEmergencyTriage: true,
        replyText: resp.text,
        suggestedAction: resp.action,
        sourceRef: resp.source,
      };
    }
  }

  // 2. Score other intents
  let bestIntent: NLUIntent = "general_nutrition";
  let maxMatches = 0;
  let detectedLang: LanguageCode = preferredLanguage;

  const intents: NLUIntent[] = [
    "nutrition_6_8_months",
    "nutrition_9_11_months",
    "nutrition_12_24_months",
    "anemia_iron_prevention",
    "muac_information",
    "cred_checkup_info",
    "breastfeeding_guidance",
    "general_nutrition",
  ];

  for (const intent of intents) {
    for (const lang of languagesToScan) {
      const patterns = INTENT_PATTERNS[intent][lang] || [];
      let matches = 0;
      for (const pattern of patterns) {
        if (normalized.includes(pattern)) {
          matches += pattern.length > 5 ? 2 : 1;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestIntent = intent;
        detectedLang = lang;
      }
    }
  }

  const confidence =
    maxMatches > 0 ? Math.min(0.95, 0.6 + maxMatches * 0.1) : 0.5;
  const replyObj =
    KNOWLEDGE_RESPONSES[bestIntent][preferredLanguage] ||
    KNOWLEDGE_RESPONSES[bestIntent].es;

  return {
    intent: bestIntent,
    confidence,
    detectedLanguage: detectedLang,
    isEmergencyTriage: false,
    replyText: replyObj.text,
    suggestedAction: replyObj.action,
    sourceRef: replyObj.source,
  };
}
