import { useState, useRef, useEffect } from "react";
import {
  Menu,
  RefreshCw,
  LogOut,
  Settings,
  X,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";

interface HeaderActionsProps {
  onSettings?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLogout?: () => void;
  hasOfflineData?: boolean;
  isOnline?: boolean;
}

export function HeaderActions({
  onSettings = () => {},
  onRefresh,
  isRefreshing,
  onLogout = () => {},
  hasOfflineData,
  isOnline = true,
}: HeaderActionsProps) {
  const { t, languageInfo } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Desktop View */}
      <div className="hidden sm:flex items-center gap-2.5">
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-bold border border-amber-500/20 min-h-[44px]">
            <WifiOff className="size-3.5 animate-pulse" />
            <span>Sin conexión</span>
          </div>
        )}
        {hasOfflineData && isOnline && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm min-h-[44px]">
            <span>Datos pendientes</span>
          </div>
        )}
        <button
          onClick={onSettings}
          className="bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-border cursor-pointer min-h-[44px] touch-manipulation"
          title={t("app.settings")}
        >
          <Settings className="size-3.5" />
          <span>{languageInfo.name}</span>
        </button>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px] touch-manipulation"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Sincronizar
          </button>
        )}
        <button
          onClick={onLogout}
          className="bg-muted hover:bg-muted/70 text-foreground px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-border cursor-pointer min-h-[44px] touch-manipulation"
        >
          <LogOut className="size-4" />
          Cerrar Sesión
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="sm:hidden flex items-center gap-2">
        {!isOnline && (
          <WifiOff className="size-4 text-amber-500 animate-pulse" />
        )}
        {hasOfflineData && isOnline && (
          <div className="size-2 rounded-full bg-amber-500"></div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-muted hover:bg-muted/80 text-foreground p-2.5 rounded-xl transition-all border border-border cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Abrir Menú de Opciones"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden sm:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col p-2 gap-1.5">
            <button
              onClick={() => {
                onSettings();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-muted/50 text-sm font-bold text-foreground text-left transition-colors min-h-[44px] touch-manipulation"
            >
              <Settings className="size-4 text-muted-foreground shrink-0" />
              <span>Idioma: {languageInfo.name}</span>
            </button>
            {onRefresh && (
              <button
                onClick={() => {
                  onRefresh();
                  setIsOpen(false);
                }}
                disabled={isRefreshing}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-primary/10 text-sm font-bold text-primary text-left transition-colors min-h-[44px] touch-manipulation"
              >
                <RefreshCw
                  className={`size-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Sincronizar Datos</span>
              </button>
            )}
            <div className="h-px bg-border my-1 mx-2" />
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-500 text-left transition-colors min-h-[44px] touch-manipulation"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
