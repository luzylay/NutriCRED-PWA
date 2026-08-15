import { useState, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { NutritionChatbot } from "../family/NutritionChatbot";
import { useAuth } from "../../contexts/AuthContext";

export function GlobalChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  
  // Position state (null = default bottom-6 right-6)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const hasMovedRef = useRef(false);

  // Guard: Only show when logged in as CAREGIVER
  if (!isLoggedIn || !user || user.role !== "CAREGIVER") {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
    };
    
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }
    
    // Constrain position within window viewport
    const newX = Math.max(12, Math.min(window.innerWidth - 64, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(12, Math.min(window.innerHeight - 64, dragStartRef.current.initialY + deltaY));
    
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(true);
  };

  const style: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, bottom: "auto", right: "auto" }
    : {};

  return (
    <>
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        style={style}
        className={`fixed ${!position ? "bottom-6 right-6" : ""} z-[40] flex items-center justify-center p-3.5 sm:p-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/40 transition-shadow touch-none select-none cursor-grab active:cursor-grabbing group`}
        aria-label="Abrir Asistente Nutricional (Movible)"
        title="Arrastra para mover el botón flotante del asistente"
      >
        <MessageSquare className="size-6 group-hover:scale-110 transition-transform pointer-events-none" />
        <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full animate-ping opacity-75 pointer-events-none" />
        <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full shadow-sm pointer-events-none" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <NutritionChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
