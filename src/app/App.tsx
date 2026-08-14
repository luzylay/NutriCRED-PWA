import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { A11yProvider } from "./contexts/A11yContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { DemoSwitcher } from "./components/layout/DemoSwitcher";
import { SignLanguagePanel } from "./components/shared/SignLanguagePanel";
import { GlobalChatbotButton } from "./components/shared/GlobalChatbotButton";
import { useAuth } from "./contexts/AuthContext";

// Helper para reintentar importaciones dinámicas desactualizadas tras despliegues
function safeLazy<T extends React.ComponentType<any>>(
  importFn: () => Promise<any>
) {
  return lazy(async () => {
    try {
      const mod = await importFn();
      return mod.default ? mod : { default: mod };
    } catch (err) {
      console.warn("Módulo desactualizado detectado, reintentando...", err);
      try {
        const mod = await importFn();
        return mod.default ? mod : { default: mod };
      } catch {
        window.location.reload();
        return new Promise<any>(() => {});
      }
    }
  });
}

// ─── LAZY PAGE IMPORTS ────────────────────────────────────────────────────────
const LoginPage = safeLazy(() => import("./pages/LoginPage"));
const RegisterPage = safeLazy(() => import("./pages/RegisterPage"));
const FamilyPage = safeLazy(() => import("./pages/FamilyPage"));
const ProfessionalPage = safeLazy(() => import("./pages/ProfessionalPage"));
const AdminPage = safeLazy(() => import("./pages/AdminPage"));
const NutritionPage = safeLazy(() => import("./pages/NutritionPage"));
const VaccinesPage = safeLazy(() => import("./pages/VaccinesPage"));
const WhatsAppDemoPage = safeLazy(() => import("./pages/WhatsAppDemoPage"));
const WellnessPage = safeLazy(() => import("./pages/WellnessPage"));
const PublicImpactPage = safeLazy(
  () => import("./pages/PublicImpactPage").then((m) => m.PublicImpactPage)
);
const NotFoundPage = safeLazy(() => import("./pages/NotFoundPage"));
const ForbiddenPage = safeLazy(() => import("./pages/ForbiddenPage"));



// ─── LOADING FALLBACK ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
          <div className="size-6 rounded-full bg-primary/40" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Cargando...</p>
      </div>
    </div>
  );
}

import { OfflineSystemNotifier } from "./components/shared/OfflineSystemNotifier";

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell() {
  const { isLoggedIn, user } = useAuth();

  // Precarga inteligente en segundo plano durante tiempo de inactividad (0ms latency!)
  useEffect(() => {
    const prefetchRoutes = () => {
      import("./pages/FamilyPage");
      import("./pages/NutritionPage");
      import("./pages/VaccinesPage");
      import("./pages/ProfessionalPage");
      import("./pages/AdminPage");
      import("./pages/PublicImpactPage");
    };

    if ("requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(prefetchRoutes);
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(prefetchRoutes, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <DataProvider isLoggedIn={isLoggedIn} user={user}>
      <DemoSwitcher />
      <SignLanguagePanel />
      <GlobalChatbotButton />
      <OfflineSystemNotifier />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/transparencia" element={<PublicImpactPage />} />
          <Route path="/impacto" element={<PublicImpactPage />} />


          {/* Protected routes */}
          <Route
            path="/familia"
            element={
              <ProtectedRoute allowedRoles={["CAREGIVER"]}>
                <FamilyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["PROFESSIONAL"]}>
                <ProfessionalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutricion"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL"]}
              >
                <NutritionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vacunas"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL"]}
              >
                <VaccinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whatsapp-demo"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL"]}
              >
                <WhatsAppDemoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bienestar"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL"]}
              >
                <WellnessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Error HTTP Routes */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

    </DataProvider>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <A11yProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </LanguageProvider>
      </A11yProvider>
    </ThemeProvider>
  );
}
