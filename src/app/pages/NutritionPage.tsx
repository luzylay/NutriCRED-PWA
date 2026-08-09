import { useState } from "react";
import { BookOpen, Droplet, ChefHat, Activity, Library, Zap, ShieldPlus, Info, X, MessageCircle } from "lucide-react";
import { HeaderActions } from "../components/shared/HeaderActions";

const RECIPES = [
  {
    id: 1,
    title: "Papilla de Sangrecita con Papa Amarilla",
    age: "6 a 8 meses",
    iron: "Alto",
    description: "Ideal para iniciar la alimentación complementaria y combatir la anemia. La sangrecita es el alimento con más hierro.",
    ingredients: ["2 cucharadas de sangrecita de pollo cocida", "1 papa amarilla mediana", "Gotas de aceite de oliva"],
    time: "15 min"
  },
  {
    id: 2,
    title: "Mazamorra de Quinua con Manzana",
    age: "9 a 11 meses",
    iron: "Medio",
    description: "La quinua aporta proteínas completas y la manzana facilita la digestión. Perfecto para la media tarde.",
    ingredients: ["3 cucharadas de quinua lavada", "1/2 manzana delicia", "Canela al gusto (sin azúcar)"],
    time: "20 min"
  },
  {
    id: 3,
    title: "Puré de Lentejas Bebé",
    age: "12 a 24 meses",
    iron: "Medio",
    description: "Fuente excelente de hierro no hemo y fibra. Acompañar siempre con limonada.",
    ingredients: ["Lentejas bien cocidas", "Papa amarilla", "Aceite de oliva", "Gotas de limón"]
  }
];

const SUPERFOODS = [
  {
    id: "sf1",
    name: "Cañihua",
    origin: "Andes Peruanos",
    icon: "🌱",
    naturist: "Considerada por los Incas como 'la semilla sagrada' que da fuerza y calienta el cuerpo en las alturas.",
    scientific: "Contiene hasta un 19% de proteína (superior a la quinua). Rica en Hierro (15mg/100g) y antioxidantes (quercetina).",
    benefit: "Previene la anemia infantil y fortalece el desarrollo muscular."
  },
  {
    id: "sf2",
    name: "Tarwi (Chocho)",
    origin: "Andes Peruanos",
    icon: "🌻",
    naturist: "Usado históricamente para limpiar el cuerpo y fortalecer los huesos por los pueblos originarios.",
    scientific: "Leguminosa con más de 40% de proteína de alto valor y gran cantidad de Calcio (hasta 115mg/100g).",
    benefit: "Fundamental para el crecimiento en talla y fortificación ósea."
  },
  {
    id: "sf3",
    name: "Camu Camu",
    origin: "Amazonía Peruana",
    icon: "🍒",
    naturist: "Fruta selvática usada para curar resfríos, dar vitalidad y proteger contra enfermedades del pulmón.",
    scientific: "Tiene la mayor concentración de Vitamina C del mundo (hasta 3000mg/100g), multiplicando exponencialmente la absorción del hierro vegetal.",
    benefit: "Potenciador del hierro (clave contra la anemia) y refuerzo del sistema inmune."
  },
  {
    id: "sf4",
    name: "Sangrecita",
    origin: "Costa y Sierra",
    icon: "🩸",
    naturist: "Remedio casero tradicional de las abuelas para 'curar el susto' y levantar a niños débiles o pálidos.",
    scientific: "Fuente suprema de Hierro Hemo (el cuerpo humano lo absorbe al 30%, vs 5% de los vegetales). Trata la anemia ferropénica clínicamente.",
    benefit: "El alimento más rápido para sacar a un niño de la desnutrición crónica."
  }
];

const NUTRIENTS_DB = {
  primary: {
    title: "Bioelementos Primarios (Proteínas)",
    color: "bg-blue-500",
    image: "/assets/images/nutrient_protein.png",
    desc: "Son los cimientos principales del cuerpo. Actúan como los ladrillos que construyen los músculos, el cerebro y todos los órganos de tu bebé.",
    deficiency: "Su falta causa desnutrición crónica (stunting), retraso en el crecimiento y debilidad muscular.",
    foods: "Encuéntralos en la Quinua, Cañihua, Tarwi, carnes y huevos."
  },
  secondary: {
    title: "Bioelementos Secundarios (Calcio)",
    color: "bg-amber-500",
    image: "/assets/images/nutrient_calcium.png",
    desc: "Acompañan a los primarios. Son como el cemento que endurece los huesos y permite que los nervios y músculos se comuniquen.",
    deficiency: "Su falta puede causar huesos frágiles, problemas dentales y calambres.",
    foods: "Encuéntralos en la Leche, Tarwi, Quesos y vegetales de hojas muy verdes."
  },
  oligo: {
    title: "Oligoelementos (Hierro y Zinc)",
    color: "bg-red-500",
    image: "/assets/images/nutrient_iron.png",
    desc: "Se necesitan en porciones pequeñas, pero son vitales como escudos mágicos. El hierro transporta el oxígeno al cerebro y el zinc defiende de virus.",
    deficiency: "Su falta causa ANEMIA, cansancio excesivo, palidez y daño irreversible al desarrollo intelectual.",
    foods: "Encuéntralos en abundancia en la Sangrecita, Hígado, Bazo y pescados oscuros."
  }
};

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<"recetas" | "despensa">("recetas");
  const [selectedAge, setSelectedAge] = useState<string>("Todas");
  const [selectedNutrient, setSelectedNutrient] = useState<keyof typeof NUTRIENTS_DB | null>(null);

  const filteredRecipes = selectedAge === "Todas" ? RECIPES : RECIPES.filter(r => r.age === selectedAge);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              Nutrición <br/>
              <span className="text-primary-foreground/90 font-medium">Yanapiriwawa</span>
            </h1>
            <p className="text-white/80 mt-2 text-sm max-w-[250px] leading-relaxed">
              Recetas peruanas ricas en hierro para que tu wawa crezca fuerte y sin anemia.
            </p>
          </div>
          <HeaderActions />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 -mt-8 relative z-20 space-y-6">
        {/* Info Card */}
        <div className="bg-card rounded-[2rem] p-5 shadow-lg border border-border flex gap-4 items-center">
          <div className="size-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <Droplet className="size-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Escudo contra la Anemia</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Recuerda acompañar las comidas ricas en hierro con vitamina C (limonada, naranja) para que el cuerpo lo absorba mejor.
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-4 border-b border-border mb-6">
          <button 
            onClick={() => setActiveTab("recetas")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === "recetas" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2"><ChefHat className="size-4" /> Recetario Local</span>
          </button>
          <button 
            onClick={() => setActiveTab("despensa")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === "despensa" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2"><Library className="size-4" /> La Despensa</span>
          </button>
        </div>

        {activeTab === "recetas" && (
          <>
            {/* Filters */}
            <div>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {["Todas", "6 a 8 meses", "9 a 11 meses", "12 a 24 meses"].map(age => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedAge === age 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-card text-muted-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid gap-4">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-accent/10 text-accent text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      {recipe.age}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <Activity className="size-3" /> Hierro: {recipe.iron}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-2 text-foreground">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{recipe.description}</p>
                  
                  <div className="bg-muted/40 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                      <BookOpen className="size-3.5" /> Ingredientes
                    </h4>
                    <ul className="space-y-1.5">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span className="text-foreground">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "despensa" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-5 mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">
                <Library className="size-5 text-emerald-600 dark:text-emerald-400" /> Catálogo de Súper-Alimentos
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nuestra tierra nos provee. Descubre el balance perfecto entre el conocimiento ancestral y la evidencia científica (OMS / INS) sobre los tesoros nutricionales de Perú y el mundo.
              </p>
            </div>

            {/* Glosario Interactivo (Retención de Usuario) */}
            <div className="bg-muted/30 border border-border p-4 rounded-3xl mb-6">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Info className="size-4 text-blue-500" /> Glosario: Nutrientes Esenciales
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Toca cualquier nutriente para entender profundamente por qué es vital para tu bebé, sin salir de la aplicación.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => setSelectedNutrient("primary")} className="bg-card border border-border p-3 rounded-2xl flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all text-left">
                  <span className="text-xs font-bold text-foreground">1. Primarios (Proteínas)</span>
                  <span className="size-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">→</span>
                </button>
                <button onClick={() => setSelectedNutrient("secondary")} className="bg-card border border-border p-3 rounded-2xl flex items-center justify-between hover:border-amber-300 hover:shadow-md transition-all text-left">
                  <span className="text-xs font-bold text-foreground">2. Secundarios (Calcio)</span>
                  <span className="size-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs">→</span>
                </button>
                <button onClick={() => setSelectedNutrient("oligo")} className="bg-card border border-border p-3 rounded-2xl flex items-center justify-between hover:border-red-300 hover:shadow-md transition-all text-left">
                  <span className="text-xs font-bold text-foreground">3. Oligoelementos (Hierro)</span>
                  <span className="size-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">→</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPERFOODS.map(food => (
                <div key={food.id} className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {/* Header de la tarjeta */}
                  <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={food.name}>{food.icon}</span>
                      <div>
                        <h4 className="font-black text-foreground">{food.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{food.origin}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    {/* Sección Naturista */}
                    <div>
                      <h5 className="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1.5 mb-1">
                        <Droplet className="size-3" /> Conocimiento Tradicional
                      </h5>
                      <p className="text-sm text-foreground/80 italic">"{food.naturist}"</p>
                    </div>

                    {/* Sección Científica */}
                    <div>
                      <h5 className="text-[11px] uppercase font-bold text-blue-600 dark:text-blue-500 flex items-center gap-1.5 mb-1">
                        <ShieldPlus className="size-3" /> Respaldo Científico
                      </h5>
                      <p className="text-sm text-muted-foreground">{food.scientific}</p>
                    </div>

                    {/* Beneficio en niños */}
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="bg-primary/10 rounded-xl p-3 flex items-start gap-2">
                        <Zap className="size-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-foreground">
                          <span className="text-primary">Impacto Infantil:</span> {food.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Referencias y Disclaimer */}
        <div className="mt-8 border-t border-border pt-6 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Fuentes y Respaldo Legal</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Las recetas sugeridas están basadas en los lineamientos públicos del <strong>Instituto Nacional de Salud (INS)</strong> y el <strong>Ministerio de Salud del Perú (MINSA)</strong>. <br/><br/>
            <em>Descargo de responsabilidad:</em> Esta información es de carácter educativo y preventivo. No sustituye el diagnóstico, consejo o tratamiento de un pediatra o nutricionista certificado.
          </p>
        </div>
      </div>

      {/* BANNER CHATBOT (Retención In-App) */}
      <div className="fixed bottom-20 right-4 md:right-8 z-40 animate-bounce">
        <button 
          onClick={() => alert("Abriendo Chatbot de Yanapiri...")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg flex items-center justify-center gap-2 group transition-all"
        >
          <MessageCircle className="size-6" />
          <span className="hidden group-hover:inline font-bold text-sm pr-2">¿Dudas? Pregúntale a Yanapiri</span>
        </button>
      </div>

      {/* MODAL DEL GLOSARIO (Retención In-App) */}
      {selectedNutrient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`${NUTRIENTS_DB[selectedNutrient].color} p-6 text-white relative`}>
              <button 
                onClick={() => setSelectedNutrient(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors"
              >
                <X className="size-4" />
              </button>
              <h3 className="text-xl font-black">{NUTRIENTS_DB[selectedNutrient].title}</h3>
            </div>
            
            <div className="bg-muted/10 flex justify-center p-4 border-b border-border">
              <img 
                src={NUTRIENTS_DB[selectedNutrient].image} 
                alt={NUTRIENTS_DB[selectedNutrient].title} 
                className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs uppercase font-bold text-muted-foreground mb-1">¿Qué son?</h4>
                <p className="text-sm text-foreground leading-relaxed">{NUTRIENTS_DB[selectedNutrient].desc}</p>
              </div>
              
              <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl">
                <h4 className="text-xs uppercase font-bold text-red-600 dark:text-red-400 mb-1">⚠️ ¿Qué pasa si le falta?</h4>
                <p className="text-sm text-foreground leading-relaxed">{NUTRIENTS_DB[selectedNutrient].deficiency}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-green-600 dark:text-green-500 mb-1">¿Dónde los encuentro?</h4>
                <p className="text-sm text-foreground leading-relaxed font-medium">{NUTRIENTS_DB[selectedNutrient].foods}</p>
              </div>
              
              <button onClick={() => setSelectedNutrient(null)} className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-3 rounded-full transition-colors mt-2 text-sm">
                Entendido, volver a la despensa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
