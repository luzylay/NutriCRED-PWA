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

// Base URL para imágenes locales
const baseUrl = import.meta.env.BASE_URL;

// Catálogo de superalimentos regionales y económicos (Costa, Sierra, Selva)
const FOOD_CATALOG: FoodItem[] = [
  // --- HIERRO ---
  {
    id: "f1",
    name: "Sangrecita de Pollo",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Muy económica y la mejor fuente de hierro para curar la anemia. Ideal en todo el Perú (Costa, Sierra y Selva).",
    imageUrl: baseUrl + "foods/f1.png"
  },
  {
    id: "f2",
    name: "Hígado",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "De pollo o res, es barato y se encuentra en cualquier mercado. Perfecto para papillas desde los 6 meses.",
    imageUrl: baseUrl + "foods/f2.png"
  },
  {
    id: "f3",
    name: "Bazo de Res",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Un secreto muy económico de los mercados peruanos. Riquísimo en hierro; se puede raspar para papillas.",
    imageUrl: baseUrl + "foods/f3.png"
  },
  {
    id: "f4",
    name: "Charqui o Chalona",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Carne seca tradicional de nuestra Sierra. Gran fuente de hierro, ideal para sopas espesas.",
    imageUrl: baseUrl + "foods/f4.png"
  },
  {
    id: "f5",
    name: "Lentejas y Frijoles",
    category: "Cereal/Grano",
    mainVitamin: "Hierro",
    description: "El hierro vegetal más humilde y rendidor. Acompañar SIEMPRE con limonada para que el cuerpo absorba el hierro.",
    imageUrl: baseUrl + "foods/f5.png"
  },

  // --- VITAMINA C ---
  {
    id: "c1",
    name: "Limón",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Económico y presente en todos los hogares. Unas gotitas en las menestras duplican la absorción del hierro.",
    imageUrl: baseUrl + "foods/c1.png"
  },
  {
    id: "c2",
    name: "Camu Camu",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "El orgullo de nuestra Selva. Tiene 40 veces más vitamina C que el limón. Excelente para refrescos.",
    imageUrl: baseUrl + "foods/c2.png"
  },
  {
    id: "c3",
    name: "Aguaymanto",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta silvestre de la Sierra, muy accesible en temporada. Refuerza las defensas del bebé.",
    imageUrl: baseUrl + "foods/c3.png"
  },
  {
    id: "c4",
    name: "Tumbo",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta andina muy económica. Ideal para refrescos cítricos que acompañen los platos ricos en hierro.",
    imageUrl: baseUrl + "foods/c4.png"
  },
  {
    id: "c5",
    name: "Naranja o Mandarina",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Frutas de estación muy baratas en Costa y Selva. Ideales de postre tras un plato de sangrecita.",
    imageUrl: baseUrl + "foods/c5.png"
  },

  // --- PROTEÍNA ---
  {
    id: "p1",
    name: "Huevo",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "La proteína más barata y completa del mundo. Ideal para el desarrollo cerebral (colina) y muscular del bebé.",
    imageUrl: baseUrl + "foods/p1.png"
  },
  {
    id: "p2",
    name: "Pescado (Bonito o Jurel)",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "En la Costa son los pescados oscuros más económicos y ricos en Omega 3 para la inteligencia del niño.",
    imageUrl: baseUrl + "foods/p2.png"
  },
  {
    id: "p3",
    name: "Tarwi o Chocho",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "El supergrano de la Sierra. Tiene más proteína que la carne y es sumamente económico.",
    imageUrl: baseUrl + "foods/p3.png"
  },
  {
    id: "p4",
    name: "Quinua",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "Grano andino sagrado. Excelente reemplazo del arroz para darle mucha más fuerza y nutrición a las papillas.",
    imageUrl: baseUrl + "foods/p4.png"
  },
  {
    id: "p5",
    name: "Paiche o Doncella",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "Pescados tradicionales de nuestra Selva peruana, excelentes fuentes de proteína de alta calidad.",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=400"
  },

  // --- CALCIO ---
  {
    id: "ca1",
    name: "Queso Fresco",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "Muy tradicional en nuestra Sierra. El calcio forma los huesitos del bebé para que gane buena talla.",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=400"
  },
  {
    id: "ca2",
    name: "Anchoveta",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "El pescado más abundante y humilde de la Costa. Al comerse con espinas pequeñas, da muchísimo calcio.",
    imageUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=400"
  },
  {
    id: "ca3",
    name: "Maca",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Raíz andina económica. Además de dar mucha energía, contiene altos niveles de calcio natural.",
    imageUrl: "https://images.unsplash.com/photo-1596646503903-8d076d3330aa?q=80&w=400"
  },
  {
    id: "ca4",
    name: "Hojas Verde Oscuro (Acelga)",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Las hojas de nabo, rábano o acelga son baratas y muy ricas en calcio vegetal para las familias más humildes.",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400"
  },
  {
    id: "ca5",
    name: "Leche Evaporada o Materna",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "La leche materna es gratis y es el mejor calcio. Si ya no lacta, la leche de vaca complementa su dieta.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400"
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
                  className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-110"
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
