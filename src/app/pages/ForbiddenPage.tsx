import { Link } from "react-router";
import { ShieldAlert, Lock, Home, RefreshCw, UserCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function ForbiddenPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-flow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 size-72 bg-amber-500/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 size-72 bg-red-500/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6 relative z-10 border border-white/20 animate-in fade-in zoom-in duration-500">
        {/* Error Badge & Icon */}
        <div className="relative inline-block mx-auto">
          <div className="size-20 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/30 shadow-inner">
            <ShieldAlert className="size-10 text-amber-500" />
          </div>
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            403
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground font-nunito tracking-tight">
            Acceso Restringido
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Esta pantalla requiere credenciales especiales de <strong className="text-foreground">Profesional CRED, Agente Comunitario o Administrador MINSA</strong>. Tu usuario actual ({user?.role ?? "Invitado"}) no posee permisos suficientes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/familia"
            className="w-full btn-gradient py-3.5 rounded-2xl font-black text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="size-4" /> Ir a Mi Panel Familiar
          </Link>

          <Link
            to="/"
            className="w-full bg-card hover:bg-muted border border-border py-3.5 rounded-2xl font-bold text-xs text-foreground transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="size-4" /> Cambiar de Perfil o Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
