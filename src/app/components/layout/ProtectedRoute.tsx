import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../lib/types";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Roles allowed to access this route. Empty array = any logged-in user. */
  allowedRoles?: UserRole[];
}

/**
 * Renders children only if the user is authenticated and has an allowed role.
 * In demo mode all routes are accessible.
 * If not authenticated, redirects to login.
 * If authenticated but wrong role, redirects to the user's own route.
 */
export function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { isLoggedIn, user, isDemoMode } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Demo mode bypasses role checks
  if (isDemoMode) return <>{children}</>;

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to the correct route for this user's role
    const roleRoutes: Record<UserRole, string> = {
      CAREGIVER: "/familia",
      PROFESSIONAL: "/dashboard",
      ADMIN: "/admin",
    };
    return <Navigate to={roleRoutes[user.role] ?? "/"} replace />;
  }

  return <>{children}</>;
}
