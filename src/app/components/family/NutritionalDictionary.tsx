import { useState } from "react";
import { BookOpen, Search, Droplet, Sun, Dumbbell, ShieldCheck } from "lucide-react";

type VitaminType = "Hierro" | "Vitamina C" | "Proteína" | "Calcio";

interface FoodItem {
  id: string;
  name: string;
  category: "Origen Animal" | "Vegetal" | "Cereal/Grano" | "Fruta";
  mainVitamin: VitaminType;
  description: string;
  imageUrl: string;
}

// Catálogo de superalimentos con enlaces directos a Wikimedia Commons
const FOOD_CATALOG: FoodItem[] = [
  {
    id: "f1",
    name: "Sangrecita",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "El superalimento número uno para combatir la anemia infantil. Tiene altísimas concentraciones de hierro hem (el que mejor absorbe el cuerpo).",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Morcilla_de_Burgos.jpg/640px-Morcilla_de_Burgos.jpg"
  },
  {
    id: "f2",
    name: "Hígado de Pollo",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Muy rico en hierro y vitamina A. Ideal para preparar en papillas desde los 6 meses para prevenir la anemia.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chicken_livers_raw.jpg/640px-Chicken_livers_raw.jpg"
  },
  {
    id: "f3",
    name: "Lentejas",
    category: "Cereal/Grano",
    mainVitamin: "Hierro",
    description: "Buena fuente de hierro vegetal. Para que el bebé absorba su hierro, siempre acompáñalo con jugo de naranja o limón.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Red_lentils.jpg/640px-Red_lentils.jpg"
  },
  {
    id: "f4",
    name: "Naranja",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "La vitamina C ayuda a que el cuerpo absorba el hierro vegetal (como el de las lentejas y espinacas). Dale de postre o refresco natural.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/640px-Orange-Fruit-Pieces.jpg"
  },
  {
    id: "f5",
    name: "Quinua",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "Un grano andino milenario, excelente fuente de proteínas para el desarrollo de los músculos y cerebro del bebé.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Quinoa_closeup.jpg/640px-Quinoa_closeup.jpg"
  },
  {
    id: "f6",
    name: "Brócoli",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Además de vitaminas y fibra, contiene calcio para huesos fuertes. Excelente para que el bebé lo agarre con sus manitos (Baby-led weaning).",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/640px-Broccoli_and_cross_section_edit.jpg"
  }
];

export function NutritionalDictionary() {
  const [filter, setFilter] = useState<VitaminType | "Todos">("Todos");

  const filteredFoods = filter === "Todos" 
    ? FOOD_CATALOG 
    : FOOD_CATALOG.filter(f => f.mainVitamin === filter);

  const getVitaminIcon = (vit: VitaminType) => {
    switch (vit) {
      case "Hierro": return <Droplet className="size-4 text-red-500" />;
      case "Vitamina C": return <Sun className="size-4 text-amber-500" />;
      case "Proteína": return <Dumbbell className="size-4 text-emerald-500" />;
      case "Calcio": return <ShieldCheck className="size-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search & Filter Header */}
      <div className="bg-card/70 backdrop-blur-xl border border-white/20 rounded-[2rem] p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-lg leading-tight font-nunito">Superalimentos</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Diccionario Nutricional</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {["Todos", "Hierro", "Vitamina C", "Proteína", "Calcio"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                filter === f 
                  ? "bg-primary text-primary-foreground scale-105" 
                  : "bg-white/50 dark:bg-black/20 border border-white/20 text-muted-foreground hover:bg-white/80 dark:hover:bg-black/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFoods.map((food) => (
          <div key={food.id} className="bg-card/70 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all group">
            
            <div className="flex gap-3">
              {/* Image Container with Fallback logic */}
              <div className="size-20 shrink-0 rounded-xl bg-muted overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <Search className="size-8" />
                </div>
                <img 
                  src={food.imageUrl} 
                  alt={food.name}
                  className="absolute inset-0 w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Escudo anticaídas: Si la imagen externa falla o la bloquean, la ocultamos y queda el ícono gris de fondo.
                    e.currentTarget.style.display = 'none';
                  }}
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">{food.category}</p>
                <h4 className="font-black text-foreground text-base leading-tight font-nunito">{food.name}</h4>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/60 dark:bg-black/40 border border-white/30 rounded-lg mt-1.5">
                  {getVitaminIcon(food.mainVitamin)}
                  <span className="text-[11px] font-bold text-foreground leading-none">{food.mainVitamin}</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-medium text-foreground/80 leading-relaxed bg-white/30 dark:bg-black/10 p-2.5 rounded-xl border border-white/20">
              {food.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
