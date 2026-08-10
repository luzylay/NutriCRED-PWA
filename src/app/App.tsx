import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { DemoSwitcher } from "./components/layout/DemoSwitcher";
import { useAuth } from "./contexts/AuthContext";

// ─── LAZY PAGE IMPORTS ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const FamilyPage = lazy(() => import("./pages/FamilyPage"));
const ProfessionalPage = lazy(() => import("./pages/ProfessionalPage"));
const AgentPage = lazy(() => import("./pages/AgentPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NutritionPage = lazy(() => import("./pages/NutritionPage"));
const VaccinesPage = lazy(() => import("./pages/VaccinesPage"));
const WhatsAppDemoPage = lazy(() => import("./pages/WhatsAppDemoPage"));
const WellnessPage = lazy(() => import("./pages/WellnessPage"));
const PublicImpactPage = lazy(
  () => import("./pages/PublicImpactPage").then((m) => ({ default: m.PublicImpactPage }))
);

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

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell() {
  const { isLoggedIn, user } = useAuth();

  return (
    <DataProvider isLoggedIn={isLoggedIn} user={user}>
      {/* DemoSwitcher is only rendered when isDemoMode=true (handled internally) */}
      <DemoSwitcher />

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
                allowedRoles={["CAREGIVER", "PROFESSIONAL", "COMMUNITY_AGENT"]}
              >
                <NutritionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vacunas"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL", "COMMUNITY_AGENT"]}
              >
                <VaccinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whatsapp-demo"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL", "COMMUNITY_AGENT"]}
              >
                <WhatsAppDemoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bienestar"
            element={
              <ProtectedRoute
                allowedRoles={["CAREGIVER", "PROFESSIONAL", "COMMUNITY_AGENT"]}
              >
                <WellnessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/actor"
            element={
              <ProtectedRoute allowedRoles={["COMMUNITY_AGENT"]}>
                <AgentPage />
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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </DataProvider>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
