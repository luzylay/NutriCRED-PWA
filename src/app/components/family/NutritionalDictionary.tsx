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

// Catálogo de superalimentos regionales y económicos (Costa, Sierra, Selva)
const FOOD_CATALOG: FoodItem[] = [
  // --- HIERRO ---
  {
    id: "f1",
    name: "Sangrecita de Pollo",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Muy económica y la mejor fuente de hierro para curar la anemia. Ideal en todo el Perú (Costa, Sierra y Selva).",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sangrecita_con_yuca.jpg/640px-Sangrecita_con_yuca.jpg"
  },
  {
    id: "f2",
    name: "Hígado",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "De pollo o res, es barato y se encuentra en cualquier mercado. Perfecto para papillas desde los 6 meses.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Preparing_Chicken_Liver_02.JPG/640px-Preparing_Chicken_Liver_02.JPG"
  },
  {
    id: "f3",
    name: "Bazo de Res",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Un secreto muy económico de los mercados peruanos. Riquísimo en hierro; se puede raspar para papillas.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Moroccan_Beef_Spleen_Stuffed_with_Kefta.jpg/640px-Moroccan_Beef_Spleen_Stuffed_with_Kefta.jpg"
  },
  {
    id: "f4",
    name: "Charqui o Chalona",
    category: "Origen Animal",
    mainVitamin: "Hierro",
    description: "Carne seca tradicional de nuestra Sierra. Gran fuente de hierro, ideal para sopas espesas.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Charqui.jpg/640px-Charqui.jpg"
  },
  {
    id: "f5",
    name: "Lentejas y Frijoles",
    category: "Cereal/Grano",
    mainVitamin: "Hierro",
    description: "El hierro vegetal más humilde y rendidor. Acompañar SIEMPRE con limonada para que el cuerpo absorba el hierro.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dry_beans%2C_lentils_etc.jpg/640px-Dry_beans%2C_lentils_etc.jpg"
  },

  // --- VITAMINA C ---
  {
    id: "c1",
    name: "Limón",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Económico y presente en todos los hogares. Unas gotitas en las menestras duplican la absorción del hierro.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Lemon.jpg/640px-Lemon.jpg"
  },
  {
    id: "c2",
    name: "Camu Camu",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "El orgullo de nuestra Selva. Tiene 40 veces más vitamina C que el limón. Excelente para refrescos.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Camu-camu.JPG/640px-Camu-camu.JPG"
  },
  {
    id: "c3",
    name: "Aguaymanto",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta silvestre de la Sierra, muy accesible en temporada. Refuerza las defensas del bebé.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Physalis_peruviana_calix_open_close-up.jpg/640px-Physalis_peruviana_calix_open_close-up.jpg"
  },
  {
    id: "c4",
    name: "Tumbo",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Fruta andina muy económica. Ideal para refrescos cítricos que acompañen los platos ricos en hierro.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Starr_010423-0060_Passiflora_tarminiana.jpg/640px-Starr_010423-0060_Passiflora_tarminiana.jpg"
  },
  {
    id: "c5",
    name: "Naranja o Mandarina",
    category: "Fruta",
    mainVitamin: "Vitamina C",
    description: "Frutas de estación muy baratas en Costa y Selva. Ideales de postre tras un plato de sangrecita.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/640px-Oranges_-_whole-halved-segment.jpg"
  },

  // --- PROTEÍNA ---
  {
    id: "p1",
    name: "Huevo",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "La proteína más barata y completa del mundo. Ideal para el desarrollo cerebral (colina) y muscular del bebé.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Chicken_Egg_without_Eggshell_5859.jpg/640px-Chicken_Egg_without_Eggshell_5859.jpg"
  },
  {
    id: "p2",
    name: "Pescado (Bonito o Jurel)",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "En la Costa son los pescados oscuros más económicos y ricos en Omega 3 para la inteligencia del niño.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Chilean_purse_seine.jpg/640px-Chilean_purse_seine.jpg"
  },
  {
    id: "p3",
    name: "Tarwi o Chocho",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "El supergrano de la Sierra. Tiene más proteína que la carne y es sumamente económico.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Peruvian_Field_Lupines.jpg/640px-Peruvian_Field_Lupines.jpg"
  },
  {
    id: "p4",
    name: "Quinua",
    category: "Cereal/Grano",
    mainVitamin: "Proteína",
    description: "Grano andino sagrado. Excelente reemplazo del arroz para darle mucha más fuerza y nutrición a las papillas.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg/640px-Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg"
  },
  {
    id: "p5",
    name: "Paiche o Doncella",
    category: "Origen Animal",
    mainVitamin: "Proteína",
    description: "Pescados tradicionales de nuestra Selva peruana, excelentes fuentes de proteína de alta calidad.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Arapaima_gigas_captivity.jpg/640px-Arapaima_gigas_captivity.jpg"
  },

  // --- CALCIO ---
  {
    id: "ca1",
    name: "Queso Fresco",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "Muy tradicional en nuestra Sierra. El calcio forma los huesitos del bebé para que gane buena talla.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Queso_fresco.JPG/640px-Queso_fresco.JPG"
  },
  {
    id: "ca2",
    name: "Anchoveta",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "El pescado más abundante y humilde de la Costa. Al comerse con espinas pequeñas, da muchísimo calcio.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ice_fresh_anchovy.jpg/640px-Ice_fresh_anchovy.jpg"
  },
  {
    id: "ca3",
    name: "Maca",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Raíz andina económica. Además de dar mucha energía, contiene altos niveles de calcio natural.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lepidium_meyenii%2C_Tsaghkadzor%2C_in_culture1.jpg/640px-Lepidium_meyenii%2C_Tsaghkadzor%2C_in_culture1.jpg"
  },
  {
    id: "ca4",
    name: "Hojas Verde Oscuro (Acelga)",
    category: "Vegetal",
    mainVitamin: "Calcio",
    description: "Las hojas de nabo, rábano o acelga son baratas y muy ricas en calcio vegetal para las familias más humildes.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Bl%C3%A4tter_vom_Roten_Mangold_%28Chard%29.jpg/640px-Bl%C3%A4tter_vom_Roten_Mangold_%28Chard%29.jpg"
  },
  {
    id: "ca5",
    name: "Leche Evaporada o Materna",
    category: "Origen Animal",
    mainVitamin: "Calcio",
    description: "La leche materna es gratis y es el mejor calcio. Si ya no lacta, la leche de vaca complementa su dieta.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bowl_milk_glass.jpg/640px-Bowl_milk_glass.jpg"
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
