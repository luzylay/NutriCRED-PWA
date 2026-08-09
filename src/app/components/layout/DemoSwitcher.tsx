import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Baby, BarChart2, Users, ShieldCheck, Wifi, WifiOff, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { useTranslation } from "../../contexts/LanguageContext";
import { SettingsModal } from "../shared/SettingsModal";

type DemoView = "family" | "professional" | "agent" | "admin";

interface DemoTab {
  id: DemoView;
  path: string;
  Icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  sub: string;
}

const DEMO_TABS: DemoTab[] = [
  { id: "family", path: "/familia", Icon: Baby, labelKey: "nav.family", sub: "PWA" },
  { id: "professional", path: "/dashboard", Icon: BarChart2, labelKey: "nav.professional", sub: "Dashboard" },
  { id: "agent", path: "/actor", Icon: Users, labelKey: "nav.agent", sub: "Comunitario" },
  { id: "admin", path: "/admin", Icon: ShieldCheck, labelKey: "nav.admin", sub: "Sistema" },
];

export function DemoSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDemoMode } = useAuth();
  const { isOnline } = useData();
  const { t, languageInfo } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!isDemoMode) return null;

  const activeTab =
    DEMO_TABS.find((t) => location.pathname.startsWith(t.path))?.id ??
    "family";

  return (
    <>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Brand */}
              <div className="hidden md:flex items-center gap-2 pr-6 border-r border-border mr-4 py-3">
                <div className="size-6 rounded-lg bg-primary flex items-center justify-center">
                  <Baby className="size-3.5 text-white" />
                </div>
                <span
                  className="text-sm font-extrabold text-foreground"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Yanapiri Wawa
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Demo
                </span>
              </div>

              {/* View tabs */}
              <div className="flex gap-1 py-2.5 overflow-x-auto">
                {DEMO_TABS.map(({ id, path, Icon, labelKey, sub }) => (
                  <button
                    key={id}
                    onClick={() => navigate(path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{t(labelKey)}</span>
                    <span className="hidden sm:inline text-xs font-medium opacity-75">
                      ({sub})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Network status & Settings button */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isOnline
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                }`}
              >
                {isOnline ? (
                  <Wifi className="size-3" />
                ) : (
                  <WifiOff className="size-3 animate-pulse" />
                )}
                <span className="hidden sm:inline">{isOnline ? t("app.online") : t("app.offline")}</span>
              </span>

              {/* Settings button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 bg-muted/80 hover:bg-muted text-foreground px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-border cursor-pointer"
                title={t("app.settings")}
              >
                <span className="text-xs font-black">{languageInfo.abbrev}</span>
                <Settings className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
