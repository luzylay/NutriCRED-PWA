import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores (ej. Sentry)
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div className="max-w-md w-full bg-card/60 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="size-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-500/20">
              <AlertOctagon className="size-10 text-red-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-foreground font-nunito tracking-tight">
                El sistema detectó un tropiezo
              </h2>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                Tus datos de salud están protegidos y guardados, pero encontramos un pequeño error al cargar esta pantalla.
              </p>
            </div>

            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-left">
              <p className="text-[10px] font-mono text-red-400/80 uppercase tracking-widest mb-1">
                Detalle Técnico (Para Soporte)
              </p>
              <p className="text-xs font-mono text-red-500/90 truncate">
                {this.state.error?.message ?? "Error Desconocido"}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full btn-gradient bg-gradient-to-r from-primary to-accent py-3.5 rounded-xl font-bold text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="size-4" /> Recargar Yanapiriwawa
              </button>
              
              <button
                onClick={() => {
                  window.localStorage.clear();
                  window.sessionStorage.clear();
                  window.location.href = "/";
                }}
                className="w-full bg-background border border-border hover:bg-muted py-3.5 rounded-xl font-bold text-foreground transition-all flex items-center justify-center gap-2"
              >
                <Home className="size-4" /> Cerrar sesión y volver al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
