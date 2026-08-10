import { Link } from "react-router";
import { Compass, Home, ArrowLeft, Baby, ShieldCheck } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-flow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 size-72 bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 size-72 bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6 relative z-10 border border-white/20 animate-in fade-in zoom-in duration-500">
        {/* Error Badge & Icon */}
        <div className="relative inline-block mx-auto">
          <div className="size-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
            <Compass className="size-10 text-primary animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-wider shadow-md">
            404
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground font-nunito tracking-tight">
            Página No Encontrada
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            La ruta que intentas visitar no existe o ha sido movida. No te preocupes, todos los datos de salud de tu bebé están protegidos.
          </p>
        </div>

        {/* Security Disclaimers */}
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-3 flex items-center gap-2.5 text-left text-xs font-semibold text-primary">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Seguridad garantizada bajo Ley N° 29733 (MINSA)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/"
            className="w-full btn-gradient py-3.5 rounded-2xl font-black text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="size-4" /> Volver al Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-card hover:bg-muted border border-border py-3 rounded-2xl font-bold text-xs text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Regresar a la pantalla anterior
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
