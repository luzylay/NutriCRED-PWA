import { useState } from "react";
import {
  Baby,
  Settings,
  User,
  Lock,
  ArrowRight,
  Info,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/LanguageContext";
import { SettingsModal } from "../components/shared/SettingsModal";
import { Navigate, useNavigate } from "react-router";
import { ROLE_TO_ROUTE } from "../lib/constants";

export default function LoginPage() {
  const { login, enterDemo, isLoggedIn, user } = useAuth();
  const { t, languageInfo } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  if (isLoggedIn && user) {
    return <Navigate to={ROLE_TO_ROUTE[user.role] ?? "/familia"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(username, password);
    if (!ok) {
      setError("Usuario o contraseña incorrectos.");
    }
    setLoading(false);
  };

  const autoFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="min-h-screen bg-gradient-flow flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-1/2 w-96 h-96 bg-secondary/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Top right language settings quick toggle */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border/50 px-4 py-2 rounded-full shadow-lg text-xs font-bold text-foreground hover:bg-card hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
              {languageInfo.abbrev}
            </div>
            <span>{languageInfo.name}</span>
            <Settings className="size-3.5 text-muted-foreground ml-1" />
          </button>
        </div>

        <div className="w-full max-w-sm glass-panel rounded-[2rem] p-6 md:p-8 space-y-8 shadow-2xl relative z-10 border border-white/20">
          {/* Hero Logo Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary blur-xl opacity-30 rounded-full"></div>
              <div className="size-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-xl relative z-10 border border-white/10">
                <Baby className="size-11 text-white" strokeWidth={2.5} />
                <div className="absolute -bottom-2 -right-2 size-8 bg-accent rounded-full border-[3px] border-card flex items-center justify-center shadow-lg">
                  <HeartPulse className="size-4 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground font-nunito tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {t("login.title")}
              </h1>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">
                {t("app.subtitle")}
              </p>
            </div>


          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("login.user")}
                  className="w-full bg-input-background/50 backdrop-blur-sm border border-border/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-input-background text-foreground transition-all placeholder:text-muted-foreground/70"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.password")}
                  className="w-full bg-input-background/50 backdrop-blur-sm border border-border/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-input-background text-foreground transition-all placeholder:text-muted-foreground/70"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <Info className="size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-primary-foreground font-black py-4 rounded-2xl text-sm shadow-lg shadow-primary/25 cursor-pointer flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <span>{loading ? "Iniciando sesión..." : t("login.submit")}</span>
              {!loading && <ArrowRight className="size-4" />}
            </button>
          </form>

          {/* Quick Links */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate("/registro")}
              className="w-full bg-card hover:bg-muted/50 text-foreground font-bold py-3.5 rounded-2xl text-xs active:scale-[0.98] transition-all cursor-pointer border border-border shadow-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="size-4 text-primary" />
              ¿Nuevo apoderado? Regístrate gratis
            </button>

            <button
              id="enter-demo"
              onClick={enterDemo}
              className="w-full bg-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              {t("login.demo_btn")}
            </button>
          </div>

          {/* Smart Test Credentials Accordion */}
          <div className="mt-6 border-t border-border/40 pt-4">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="flex items-center justify-center gap-1.5 w-full text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="size-3" />
              <span>Ver accesos de prueba</span>
            </button>

            {showCredentials && (
              <div className="mt-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <button
                  onClick={() => autoFill("maria", "maria123")}
                  className="bg-card hover:bg-primary/10 border border-border p-2 rounded-xl text-left transition-colors group"
                >
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">
                    Madre
                  </p>
                  <p className="text-xs font-black text-foreground group-hover:text-primary">
                    maria
                  </p>
                </button>
                <button
                  onClick={() => autoFill("carlos", "carlos123")}
                  className="bg-card hover:bg-primary/10 border border-border p-2 rounded-xl text-left transition-colors group"
                >
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">
                    Enfermero
                  </p>
                  <p className="text-xs font-black text-foreground group-hover:text-primary">
                    carlos
                  </p>
                </button>
                <button
                  onClick={() => autoFill("luisa", "luisa123")}
                  className="bg-card hover:bg-primary/10 border border-border p-2 rounded-xl text-left transition-colors group"
                >
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">
                    Promotora
                  </p>
                  <p className="text-xs font-black text-foreground group-hover:text-primary">
                    luisa
                  </p>
                </button>
                <button
                  onClick={() => autoFill("admin", "admin123")}
                  className="bg-card hover:bg-primary/10 border border-border p-2 rounded-xl text-left transition-colors group"
                >
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-0.5">
                    Gestor
                  </p>
                  <p className="text-xs font-black text-foreground group-hover:text-primary">
                    admin
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
