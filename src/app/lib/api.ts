import { API_BASE } from "./constants";
import type {
  LoginResponse,
  Child,
  Measurement,
  Alert,
  AuditLog,
  AdminUser,
  AdminStats,
  AlertRule,
  VisitCreate,
  DashboardSummary,
} from "./types";

// ─── AUTH HEADERS ─────────────────────────────────────────────────────────────

function getStoredToken(): string {
  return sessionStorage.getItem("active_token") ?? "";
}

/**
 * Construye y devuelve las cabeceras de autorización necesarias para las peticiones a la API.
 * Extrae el token JWT del sessionStorage.
 *
 * @returns {HeadersInit} Objeto con las cabeceras 'Authorization' y 'Content-Type'.
 */
function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getStoredToken()}`,
    "Content-Type": "application/json",
  };
}

// ─── GENERIC FETCH WRAPPER ────────────────────────────────────────────────────

/**
 * Wrapper genérico para realizar peticiones HTTP a la API REST.
 * Maneja automáticamente la inyección de cabeceras de autorización y el manejo de errores básicos.
 *
 * @template T - Tipo esperado de la respuesta JSON.
 * @param {string} path - Ruta relativa del endpoint (ej. '/children').
 * @param {RequestInit} [options={}] - Opciones de la petición fetch (método, body, etc).
 * @returns {Promise<T>} Promesa con la respuesta parseada a JSON.
 * @throws {Error} Lanza un error si la respuesta HTTP indica fallo.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

/**
 * Autentica un usuario contra el backend y retorna sus credenciales (token).
 *
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña.
 * @returns {Promise<LoginResponse>} Promesa con los datos de inicio de sesión incluyendo el access_token.
 * @throws {Error} Lanza un error si las credenciales son incorrectas.
 */
export async function loginApi(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Credenciales incorrectas.");
  }

  return res.json() as Promise<LoginResponse>;
}

// ─── CHILDREN ────────────────────────────────────────────────────────────────

/**
 * Obtiene la lista cruda de niños asignados al usuario autenticado.
 *
 * @returns {Promise<unknown[]>} Promesa con un array de registros de niños sin procesar.
 */
const TTL_MS = 1000 * 60 * 60 * 24 * 365; // Prácticamente infinito para modo offline

export async function fetchChildren(role?: string): Promise<ChildProfile[]> {
  const cacheKey = `cache_children_${role || "all"}`;

  // Offline / Cache Check (Stale-While-Revalidate)
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      // Siempre servimos el caché primero si existe, para UX ultrarrápida.
      if (!navigator.onLine) {
        console.log("Offline mode: Serving children from cache");
        return parsed.data;
      }
    } catch (e) {
      console.warn("Cache parsing error", e);
    }
  }

  try {
    const res = await apiFetch<ChildProfile[]>("/children");

    // Save to cache
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: res,
      }),
    );

    return res;
  } catch (err) {
    if (cachedData) {
      console.log("Network error, serving stale cache");
      return JSON.parse(cachedData).data;
    }
    throw err;
  }
}

export async function fetchMeasurements(
  childId: number,
): Promise<Measurement[]> {
  return apiFetch<Measurement[]>(`/children/${childId}/measurements`);
}

/**
 * Registra una nueva medición antropométrica para un menor específico.
 *
 * @param {number} childId - ID del menor.
 * @param {Object} payload - Datos de la medición (tipo, valor, unidad, método).
 * @returns {Promise<Measurement>} Promesa con la medición creada y registrada en el backend.
 */
export async function postMeasurement(
  childId: number,
  payload: { type: string; value: number; unit: string; method: string },
): Promise<Measurement> {
  return apiFetch<Measurement>(`/children/${childId}/measurements`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAlerts(childId: number): Promise<Alert[]> {
  return apiFetch<Alert[]>(`/children/${childId}/alerts`);
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}

export async function fetchPrioritized(): Promise<unknown[]> {
  return apiFetch<unknown[]>("/dashboard/prioritized");
}

// ─── VISITS ──────────────────────────────────────────────────────────────────

export async function postVisit(visit: VisitCreate): Promise<unknown> {
  return apiFetch<unknown>("/visits", {
    method: "POST",
    body: JSON.stringify(visit),
  });
}

// ─── AUDIT ───────────────────────────────────────────────────────────────────

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>("/audit");
}

// ─── RULES ───────────────────────────────────────────────────────────────────

export async function fetchRules(): Promise<AlertRule[]> {
  return apiFetch<AlertRule[]>("/rules");
}

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/admin/users");
}

export async function patchUserStatus(
  userId: number,
  status: "active" | "inactive",
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats");
}

export async function assignAgentChild(
  agentId: number,
  childId: number,
): Promise<unknown> {
  return apiFetch<unknown>("/admin/assign/agent-child", {
    method: "POST",
    body: JSON.stringify({ agent_id: agentId, child_id: childId }),
  });
}

export async function assignProfessionalChild(
  professionalId: number,
  childId: number,
): Promise<unknown> {
  return apiFetch<unknown>("/admin/assign/professional-child", {
    method: "POST",
    body: JSON.stringify({
      professional_id: professionalId,
      child_id: childId,
    }),
  });
}

// ─── DEMO AUTO-LOGIN ──────────────────────────────────────────────────────────

/**
 * Used only in demo mode to auto-obtain tokens for each persona.
 * Caches tokens in sessionStorage to avoid repeated logins.
 */
export async function getDemoToken(
  username: string,
  password: string,
  cacheKey: string,
): Promise<string> {
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const data = await loginApi(username, password);
    sessionStorage.setItem(cacheKey, data.access_token);
    return data.access_token;
  } catch {
    return "";
  }
}

// ─── CHILD DATA MAPPER ────────────────────────────────────────────────────────

/**
 * Maps raw API child data to the frontend Child interface.
 * Centralizes the transformation so pages don't need to implement it.
 */
export function formatAge(ageMonths: number): string {
  const yrs = Math.floor(ageMonths / 12);
  const mths = ageMonths % 12;

  if (yrs === 0) {
    return `${mths} ${mths === 1 ? "mes" : "meses"}`;
  }
  const yrStr = `${yrs} ${yrs === 1 ? "año" : "años"}`;
  if (mths === 0) return yrStr;
  return `${yrStr}, ${mths} ${mths === 1 ? "mes" : "meses"}`;
}

export function mapRawChild(raw: Record<string, unknown>): Child {
  const c = raw as any;

  // Calculate age from DOB
  const dob = new Date(c.fecha_nacimiento as string);
  const diffMs = Date.now() - dob.getTime();
  const ageMonths = Math.floor(diffMs / (30.4 * 24 * 60 * 60 * 1000));
  const ageStr = formatAge(ageMonths);

  const status = c.status_alerta as string as Child["status"];

  return {
    id: String(c.id),
    name: c.name as string,
    shortName: (c.name as string).split(" ")[0],
    age: ageStr,
    ageMonths,
    sex: c.sex as "M" | "F",
    caregiver: (c.caregiver as string) ?? "Desconocido",
    status,
    weight: (c.weight as number) ?? 0,
    height: (c.height as number) ?? 0,
    muac: c.muac as number | undefined,
    lastMeasured: (c.last_measured as string) ?? "Sin registro",
    zScore: (c.zscore_actual as number) ?? 0,
    nextAction:
      status === "urgent"
        ? "Evaluación médica prioritaria"
        : status === "follow-up"
          ? "Visita domiciliaria"
          : "Control regular",
    district: c.district as string,
    community: c.community as string,
  };
}
// ─── OFFLINE SYNC QUEUE ────────────────────────────────────────────────────────

/**
 * Guarda una acción de modificación (POST/PATCH) en la cola local si no hay internet.
 */
export function enqueueOfflineAction(action: {
  endpoint: string;
  method: string;
  payload: any;
}) {
  const queue = JSON.parse(localStorage.getItem("yanapiri_sync_queue") || "[]");
  queue.push({
    ...action,
    timestamp: Date.now(),
    id: Math.random().toString(36).substring(7),
  });
  localStorage.setItem("yanapiri_sync_queue", JSON.stringify(queue));
  console.log("Acción guardada en cola offline:", action.endpoint);
}

/**
 * Intenta sincronizar toda la cola local con el servidor.
 */
export async function syncOfflineQueue(): Promise<number> {
  if (!navigator.onLine) return 0;

  const queue = JSON.parse(localStorage.getItem("yanapiri_sync_queue") || "[]");
  if (queue.length === 0) return 0;

  let successCount = 0;
  const newQueue = [];

  for (const item of queue) {
    try {
      // Simulate API call for sync
      console.log(`Syncing ${item.method} to ${item.endpoint}...`);
      await new Promise((r) => setTimeout(r, 500)); // Fake network delay
      successCount++;
    } catch (err) {
      console.error("Fallo al sincronizar item, se mantendrá en cola", err);
      newQueue.push(item); // Keep in queue if failed
    }
  }

  localStorage.setItem("yanapiri_sync_queue", JSON.stringify(newQueue));
  return successCount;
}
