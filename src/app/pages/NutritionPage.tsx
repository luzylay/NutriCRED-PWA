import { useState } from "react";
import { BookOpen, Droplet, ChefHat, Activity, Library, Zap, ShieldPlus } from "lucide-react";
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
    title: "Guiso de Tarwi con Higadito de Pollo",
    age: "12 a 24 meses",
    iron: "Muy Alto",
    description: "El tarwi tiene más calcio que la leche y el hígado es vital para el desarrollo cerebral y prevención de anemia.",
    ingredients: ["1 higadito de pollo", "2 cucharadas de tarwi desamargado", "Zapallo macre", "Zanahoria"],
    time: "25 min"
  }
];

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<"recetas" | "despensa">("recetas");
  const [selectedAge, setSelectedAge] = useState<string>("Todas");

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
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Droplet className="size-4 text-red-600" />
                </div>
                <h3 className="font-bold text-foreground">Metabolismo del Hierro</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                El cuerpo humano absorbe el <strong>Hierro Hemo</strong> (sangrecita, hígado, bazo) de forma rápida y directa (hasta un 30%). Por el contrario, el <strong>Hierro No Hemo</strong> (lentejas, espinacas) se absorbe muy poco (apenas 2% a 10%). ¡Por eso las carnes oscuras son el mejor aliado contra la anemia infantil!
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Zap className="size-4 text-amber-600" />
                </div>
                <h3 className="font-bold text-foreground">Vitamina C: El Gran Potenciador</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                ¿Sabías que un chorrito de limón o acompañar la comida con jugo de naranja aumenta la absorción del hierro vegetal hasta en un 300%? La <strong>Vitamina C</strong> actúa como una "llave" que ayuda a que el hierro entre al cuerpo.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShieldPlus className="size-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-foreground">Zinc y Vitamina A</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Presentes en semillas (como el Tarwi) y vegetales naranjas (Zanahoria, Zapallo Macre). Mientras el Zinc construye tejidos y fomenta el crecimiento en talla, la Vitamina A blinda el sistema inmunológico contra infecciones.
              </p>
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
    </div>
  );
}
