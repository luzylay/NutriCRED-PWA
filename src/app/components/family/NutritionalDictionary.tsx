import { useState, lazy, Suspense } from "react";
import { BookOpen, Search, Droplet, Sun, Dumbbell, ShieldCheck, Sparkles, X, Info, Flame, ChevronRight, CheckCircle2 } from "lucide-react";

type VitaminType = "Hierro" | "Vitamina C" | "Proteína" | "Calcio";

export interface FoodItem {
  id: string;
  name: string;
  category: "Origen Animal" | "Vegetal" | "Cereal/Grano" | "Fruta";
  mainVitamin: VitaminType;
  description: string;
  imageUrl: string;
  ironMg: number;
  vitCMg: number;
  proteinG: number;
  calciumMg: number;
  caloriesKcal: number;
  portionBaby: string;
  bioavailability: string;
  bestCombo: string;
}

const baseUrl = import.meta.env.BASE_URL;

// Catálogo completo de superalimentos regionales con composición nutricional exacta por 100g
const FOOD_CATALOG: FoodItem[] = [
  // --- HIERRO ---
  {
    id: "f1",
    name: "Sangrecita de Pollo",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Muy económica y la mejor fuente de hierro para curar la anemia. Ideal en todo el Perú (Costa, Sierra y Selva).",
    imageUrl: baseUrl + "foods/f1.png",
    ironMg: 29.5,
    vitCMg: 0,
    proteinG: 16.0,
    calciumMg: 15,
    caloriesKcal: 78,
    portionBaby: "2 cucharadas soperas cocidas y desmenuzadas (30g)",
    bioavailability: "25% (Hierro HEM pase directo)",
    bestCombo: "Gotas de limón, jugo de mandarina o camu camu."
  },
  {
    id: "f2",
    name: "Hígado de Res / Pollo",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "De pollo o res, es barato y se encuentra en cualquier mercado. Perfecto para papillas desde los 6 meses.",
    imageUrl: baseUrl + "foods/f2.png",
    ironMg: 19.2,
    vitCMg: 27,
    proteinG: 21.3,
    calciumMg: 11,
    caloriesKcal: 135,
    portionBaby: "1 a 2 cucharadas prensadas en papilla (25g)",
    bioavailability: "20% (Hierro HEM animal)",
    bestCombo: "Puré de papa amarilla o camote dulce."
  },
  {
    id: "f3",
    name: "Bazo de Res",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Un secreto muy económico de los mercados peruanos. Riquísimo en hierro; se puede raspar para papillas.",
    imageUrl: baseUrl + "foods/f3.png",
    ironMg: 28.7,
    vitCMg: 15,
    proteinG: 18.2,
    calciumMg: 12,
    caloriesKcal: 98,
    portionBaby: "2 cucharadas raspadas sancocha das (30g)",
    bioavailability: "25% (Hierro HEM animal)",
    bestCombo: "Sopa o papilla de zapallo con limón."
  },
  {
    id: "f4",
    name: "Charqui o Chalona",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Carne seca tradicional de nuestra Sierra. Gran fuente de hierro, ideal para sopas espesas.",
    imageUrl: baseUrl + "foods/f4.png",
    ironMg: 12.0,
    vitCMg: 0,
    proteinG: 57.5,
    calciumMg: 24,
    caloriesKcal: 290,
    portionBaby: "1 cucharada deshilachada muy fina en caldo (15g)",
    bioavailability: "18% (Hierro HEM seco)",
    bestCombo: "Sopas andinas con guisantes y limón."
  },
  {
    id: "f5",
    name: "Lentejas y Frijoles",
    category: "Cereal/Grano",
    mainVitamin: "Hierro",
    description: "El hierro vegetal más humilde y rendidor. Acompañar SIEMPRE con limonada para que el cuerpo absorba el hierro.",
    imageUrl: baseUrl + "foods/f5.png",
    ironMg: 7.6,
    vitCMg: 4.5,
    proteinG: 9.0,
    calciumMg: 35,
    caloriesKcal: 116,
    portionBaby: "3 a 4 cucharadas de puré de menestras (40g)",
    bioavailability: "5% (Hierro No HEM - Requiere Vitamina C)",
    bestCombo: "Limonada fresca o ensalada con limón."
  },

  // --- VITAMINA C ---
  {
    id: "c1",
    name: "Limón",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Económico y presente en todos los hogares. Unas gotitas en las menestras duplican la absorción del hierro.",
    imageUrl: baseUrl + "foods/c1.png",
    ironMg: 0.6,
    vitCMg: 53.0,
    proteinG: 1.1,
    calciumMg: 26,
    caloriesKcal: 29,
    portionBaby: "Unas cuantas gotas en la papilla o refresco (5ml)",
    bioavailability: "Potenciador x5 de absorción de hierro",
    bestCombo: "Gotas directas sobre sangrecita o menestras."
  },
  {
    id: "c2",
    name: "Camu Camu",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "El orgullo de nuestra Selva. Tiene 40 veces más vitamina C que el limón. Excelente para refrescos.",
    imageUrl: baseUrl + "foods/c2.png",
    ironMg: 0.5,
    vitCMg: 2780.0,
    proteinG: 0.4,
    calciumMg: 15.7,
    caloriesKcal: 24,
    portionBaby: "1/2 vaso de refresco tibio o papilla (50ml)",
    bioavailability: "Potenciador Supremo de absorción",
    bestCombo: "Refresco natural que acompañe papillas de hígado."
  },
  {
    id: "c3",
    name: "Aguaymanto",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta silvestre de la Sierra, muy accesible en temporada. Refuerza las defensas del bebé.",
    imageUrl: baseUrl + "foods/c3.png",
    ironMg: 1.2,
    vitCMg: 43.0,
    proteinG: 1.9,
    calciumMg: 9,
    caloriesKcal: 53,
    portionBaby: "2 a 3 frutitas picadas o trituradas (25g)",
    bioavailability: "Potenciador natural + Antioxidantes",
    bestCombo: "Postre tras papilla de sangrecita."
  },
  {
    id: "c4",
    name: "Tumbo",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta andina muy económica. Ideal para refrescos cítricos que acompañen los platos ricos en hierro.",
    imageUrl: baseUrl + "foods/c4.png",
    ironMg: 0.4,
    vitCMg: 92.0,
    proteinG: 0.8,
    calciumMg: 14,
    caloriesKcal: 35,
    portionBaby: "1/2 vaso de refresco colado (50ml)",
    bioavailability: "Potenciador x4 de absorción de hierro",
    bestCombo: "Acompañar comidas ricas en menestras."
  },
  {
    id: "c5",
    name: "Naranja o Mandarina",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Frutas de estación muy baratas en Costa y Selva. Ideales de postre tras un plato de sangrecita.",
    imageUrl: baseUrl + "foods/c5.png",
    ironMg: 0.2,
    vitCMg: 53.2,
    proteinG: 0.9,
    calciumMg: 40,
    caloriesKcal: 47,
    portionBaby: "2 a 3 gajos sin pepa o en jugo natural (40g)",
    bioavailability: "Potenciador directo de absorción",
    bestCombo: "Postre inmediato tras comer sangrecita."
  },

  // --- PROTEÍNA ---
  {
    id: "p1",
    name: "Huevo entero",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "La proteína más barata y completa del mundo. Ideal para el desarrollo cerebral (colina) y muscular del bebé.",
    imageUrl: baseUrl + "foods/p1.png",
    ironMg: 2.7,
    vitCMg: 0,
    proteinG: 12.6,
    calciumMg: 50,
    caloriesKcal: 155,
    portionBaby: "1 huevo sancochado aplastado (50g)",
    bioavailability: "Proteína de valor biológico 100%",
    bestCombo: "Prensa de yema en purés desde los 6 meses."
  },
  {
    id: "p2",
    name: "Pescado (Bonito o Jurel)",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "En la Costa son los pescados oscuros más económicos y ricos en Omega 3 para la inteligencia del niño.",
    imageUrl: baseUrl + "foods/p2.png",
    ironMg: 2.5,
    vitCMg: 0,
    proteinG: 23.4,
    calciumMg: 38,
    caloriesKcal: 138,
    portionBaby: "2 a 3 cucharadas desmenuzadas sin espinas (35g)",
    bioavailability: "Proteína magra + Omega 3 DHA",
    bestCombo: "Puré de papa con gotas de limón."
  },
  {
    id: "p3",
    name: "Tarwi o Chocho",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "El supergrano de la Sierra. Tiene más proteína que la carne y es sumamente económico.",
    imageUrl: baseUrl + "foods/p3.png",
    ironMg: 7.5,
    vitCMg: 2.0,
    proteinG: 44.3,
    calciumMg: 110,
    caloriesKcal: 410,
    portionBaby: "2 cucharadas de harina o puré de tarwi (25g)",
    bioavailability: "Proteína vegetal de alta densidad",
    bestCombo: "Mezclado con zapallo y gotas de limón."
  },
  {
    id: "p4",
    name: "Quinua Perla / Roja",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "Grano andino sagrado. Excelente reemplazo del arroz para darle mucha más fuerza y nutrición a las papillas.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    ironMg: 4.6,
    vitCMg: 0,
    proteinG: 14.1,
    calciumMg: 47,
    caloriesKcal: 368,
    portionBaby: "3 a 4 cucharadas de quinua graneada suavecita (40g)",
    bioavailability: "Aminoácidos esenciales completos",
    bestCombo: "Guisos espesos con verduras y sangrecita."
  },
  {
    id: "p5",
    name: "Paiche o Doncella",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "Pescados tradicionales de nuestra Selva peruana, excelentes fuentes de proteína de alta calidad.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600",
    ironMg: 1.8,
    vitCMg: 0,
    proteinG: 20.0,
    calciumMg: 25,
    caloriesKcal: 105,
    portionBaby: "2 a 3 cucharadas desmenuzadas (35g)",
    bioavailability: "Proteína blanca de fácil digestión",
    bestCombo: "Papilla de plátano verde o yuca sancochada."
  },

  // --- CALCIO ---
  {
    id: "ca1",
    name: "Queso Fresco",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "Muy tradicional en nuestra Sierra. El calcio forma los huesitos del bebé para que gane buena talla.",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=600",
    ironMg: 0.4,
    vitCMg: 0,
    proteinG: 18.0,
    calciumMg: 650.0,
    caloriesKcal: 260,
    portionBaby: "1 tajadita pequeña rallada (20g)",
    bioavailability: "Calcio lácteo de alta fijación ósea",
    bestCombo: "Rallado sobre papilla de quinua o choclo."
  },
  {
    id: "ca2",
    name: "Anchoveta",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "El pescado más abundante y humilde de la Costa. Al comerse con espinas pequeñas, da muchísimo calcio.",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600",
    ironMg: 3.2,
    vitCMg: 0,
    proteinG: 19.1,
    calciumMg: 840.0,
    caloriesKcal: 140,
    portionBaby: "2 anchovetas pequeñas molidas sin espinas duras (30g)",
    bioavailability: "Calcio marino + Hierro",
    bestCombo: "Puré de camote amarillo o yuca."
  },
  {
    id: "ca3",
    name: "Maca Andina",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Raíz andina económica. Además de dar mucha energía, contiene altos niveles de calcio natural.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    ironMg: 14.8,
    vitCMg: 285.0,
    proteinG: 14.0,
    calciumMg: 250.0,
    caloriesKcal: 325,
    portionBaby: "1/2 cucharadita de harina de maca en la mazamorra (5g)",
    bioavailability: "Energético + Calcio vegetal",
    bestCombo: "Mazamorra de avena o quinua."
  },
  {
    id: "ca4",
    name: "Hojas Verde Oscuro (Acelga)",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Las hojas de nabo, rábano o acelga son baratas y muy ricas en calcio vegetal para las familias más humildes.",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600",
    ironMg: 2.1,
    vitCMg: 30.0,
    proteinG: 1.8,
    calciumMg: 150.0,
    caloriesKcal: 19,
    portionBaby: "2 a 3 hojitas sancochadas y picadas fino (20g)",
    bioavailability: "Calcio vegetal + Fibra",
    bestCombo: "Sopas espesas con papa o quinua."
  },
  {
    id: "ca5",
    name: "Leche Evaporada o Materna",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "La leche materna es gratis y es el mejor calcio. Si ya no lacta, la leche de vaca complementa su dieta.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600",
    ironMg: 0.1,
    vitCMg: 1.0,
    proteinG: 7.0,
    calciumMg: 260.0,
    caloriesKcal: 134,
    portionBaby: "Lactancia materna libre demanda o 1/2 taza (100ml)",
    bioavailability: "Absorción de calcio óptima",
    bestCombo: "Servir 2 horas alejada de alimentos con hierro."
  }
];

export function NutritionalDictionary() {
  const [filter, setFilter] = useState<VitaminType | "Todos">("Todos");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = filter === "Todos" 
    ? FOOD_CATALOG 
    : FOOD_CATALOG.filter(f => f.mainVitamin === filter);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Search & Filter Header - Optimizado para pantallas pequeñas (320px - 360px) */}
      <div className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-[2rem] p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-base sm:text-lg leading-tight font-nunito">Superalimentos Peruanos</h3>
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Composición Nutricional &amp; Guía de Porciones
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5 hide-scrollbar touch-pan-x -mx-1 px-1">
          {[
            { id: "Todos", label: "Todos", icon: Sparkles },
            { id: "Hierro", label: "Hierro", icon: Droplet },
            { id: "Vitamina C", label: "Vitamina C", icon: Sun },
            { id: "Proteína", label: "Proteína", icon: Dumbbell },
            { id: "Calcio", label: "Calcio", icon: ShieldCheck },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id as VitaminType | "Todos")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs shrink-0 cursor-pointer touch-manipulation flex items-center gap-1.5 ${
                filter === id
                  ? "bg-primary text-primary-foreground scale-105 shadow-md"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              <Icon className={`size-3.5 ${filter === id ? "text-primary-foreground" : "text-primary/70"}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Grid - Totalmente Responsive en PC y Celulares pequeños (320px+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            onClick={() => setSelectedFood(food)}
            className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-[1.8rem] p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] border-border/60"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                  {food.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {food.mainVitamin}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                {food.imageUrl && (
                  <div className="size-16 sm:size-20 rounded-2xl bg-muted/40 overflow-hidden shrink-0 border border-border/50 shadow-inner">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-foreground text-sm sm:text-base font-nunito group-hover:text-primary transition-colors flex items-center justify-between">
                    <span className="truncate">{food.name}</span>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                    {food.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Tag */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono font-bold text-primary">
              <span>
                {food.mainVitamin}:{" "}
                {food.mainVitamin === "Hierro"
                  ? `${food.ironMg}mg`
                  : food.mainVitamin === "Vitamina C"
                  ? `${food.vitCMg}mg`
                  : food.mainVitamin === "Proteína"
                  ? `${food.proteinG}g`
                  : `${food.calciumMg}mg`}
              </span>
              <span className="text-muted-foreground font-sans text-[10px] group-hover:text-primary transition-colors">
                Ver Ficha Completa &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>


      {/* 📋 MODAL DETALLADO DE FICHA DE COMPOSICIÓN NUTRICIONAL (POR 100G) */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-[2.5rem] max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                    Ficha de Composición por 100g
                  </span>
                  <h3 className="font-black text-foreground text-lg leading-tight font-nunito">
                    {selectedFood.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedFood(null)}
                className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Nutritional Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-extrabold text-xs">
                  <Droplet className="size-3.5" /> Hierro Total
                </div>
                <p className="text-xl font-black text-foreground font-nunito mt-1">
                  {selectedFood.ironMg} <span className="text-xs font-mono font-normal">mg</span>
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                  <Sun className="size-3.5" /> Vitamina C
                </div>
                <p className="text-xl font-black text-foreground font-nunito mt-1">
                  {selectedFood.vitCMg} <span className="text-xs font-mono font-normal">mg</span>
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  <Dumbbell className="size-3.5" /> Proteínas
                </div>
                <p className="text-xl font-black text-foreground font-nunito mt-1">
                  {selectedFood.proteinG} <span className="text-xs font-mono font-normal">g</span>
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                  <ShieldCheck className="size-3.5" /> Calcio
                </div>
                <p className="text-xl font-black text-foreground font-nunito mt-1">
                  {selectedFood.calciumMg} <span className="text-xs font-mono font-normal">mg</span>
                </p>
              </div>
            </div>

            {/* Energy & Bioavailability */}
            <div className="bg-muted/40 border border-border rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-muted-foreground flex items-center gap-1">
                  <Flame className="size-3.5 text-orange-500" /> Valor Energético:
                </span>
                <span className="font-mono font-black text-foreground">{selectedFood.caloriesKcal} kcal / 100g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3.5 text-amber-500" /> Tasa de Absorción:
                </span>
                <span className="font-mono font-black text-primary">{selectedFood.bioavailability}</span>
              </div>
            </div>

            {/* Portion Advice for Baby */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3.5 space-y-1 text-xs">
              <span className="font-extrabold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Porción recomendada para tu bebé:
              </span>
              <p className="text-foreground/90 leading-relaxed font-medium">
                {selectedFood.portionBaby}
              </p>
            </div>

            {/* Ideal Combination Tip */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 space-y-1 text-xs">
              <span className="font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Info className="size-4" /> Combinación perfecta en la mesa:
              </span>
              <p className="text-foreground/90 leading-relaxed font-medium">
                {selectedFood.bestCombo}
              </p>
            </div>

            <button
              onClick={() => setSelectedFood(null)}
              className="w-full btn-gradient py-3.5 rounded-2xl font-black text-xs text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Entendido, volver al catálogo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default NutritionalDictionary;
