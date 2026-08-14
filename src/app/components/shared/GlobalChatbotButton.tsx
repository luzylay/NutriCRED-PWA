import { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { NutritionChatbot } from "../family/NutritionChatbot";
import { useAuth } from "../../contexts/AuthContext";

export function GlobalChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  // Guardia de Autenticación Estricto (Diseño Robusto)
  // 1. Si NO está logueado, NUNCA mostrar el chatbot (evita fugas visuales en el Login)
  if (!isLoggedIn || !user) {
    return null;
  }
  
  // 2. Si está logueado, solo mostrarlo para roles autorizados (Familia)
  if (user.role !== "CAREGIVER") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[40] flex items-center justify-center p-3.5 sm:p-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Abrir Asistente Nutricional"
      >
        <MessageSquare className="size-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full animate-ping opacity-75" />
        <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full shadow-sm" />
      </button>

      {/* Renderizamos el chatbot con alto z-index cuando se abre */}
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <NutritionChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
