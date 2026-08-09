import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  fetchChildren,
  fetchMeasurements,
  fetchAuditLogs,
  mapRawChild,
  formatAge,
} from "../lib/api";
import { getWHORef } from "../lib/who-refs";
import type {
  Child,
  Measurement,
  OfflineMeasurement,
  AuditLog,
  GrowthPoint,
  MeasureType,
  AuthUser,
} from "../lib/types";

// ─── FALLBACK DATA ────────────────────────────────────────────────────────────

const FALLBACK_CHILDREN: Child[] = [
  {
    id: "3",
    name: "Juan Quispe Mamani",
    shortName: "Juan",
    age: "2 años, 3 meses",
    ageMonths: 27,
    sex: "M",
    caregiver: "María Quispe",
    caregiverDni: "maria",
    status: "follow-up",
    weight: 11.2,
    height: 85.5,
    zScore: -1.8,
    lastMeasured: "hoy",
    nextAction: "Visita domiciliaria",
    district: "Huancavelica",
    community: "Anchonga",
  },
  {
    id: "1",
    name: "Pedro Inca Tuesta",
    shortName: "Pedro",
    age: "3 años, 1 mes",
    ageMonths: 37,
    sex: "M",
    caregiver: "Rosa Tuesta",
    caregiverDni: "rosa",
    status: "urgent",
    weight: 11.8,
    height: 88.1,
    zScore: -2.8,
    lastMeasured: "hace 5 días",
    nextAction: "Evaluación médica prioritaria",
    district: "Huancavelica",
    community: "Ccasapata",
  },
  {
    id: "2",
    name: "Rosa Huanca Pérez",
    shortName: "Rosa",
    age: "1 año, 4 meses",
    ageMonths: 16,
    sex: "F",
    caregiver: "Catalina Pérez",
    caregiverDni: "maria",
    status: "urgent",
    weight: 7.8,
    height: 72.1,
    zScore: -2.5,
    lastMeasured: "hace 3 días",
    nextAction: "Evaluación médica prioritaria",
    district: "Huancavelica",
    community: "Lircay",
  },
  {
    id: "4",
    name: "Diego Ccori Vargas",
    shortName: "Diego",
    age: "2 años, 9 meses",
    ageMonths: 33,
    sex: "M",
    caregiver: "Luis Vargas",
    caregiverDni: "luis",
    status: "follow-up",
    weight: 12.1,
    height: 91.3,
    zScore: -1.4,
    lastMeasured: "hace 1 semana",
    nextAction: "Visita de consejería",
    district: "Huancavelica",
    community: "Ccasapata",
  },
  {
    id: "5",
    name: "Lucía Flores Rojas",
    shortName: "Lucía",
    age: "1 año, 8 meses",
    ageMonths: 20,
    sex: "F",
    caregiver: "Elena Rojas",
    caregiverDni: "maria",
    status: "normal",
    weight: 10.4,
    height: 78.2,
    zScore: -0.4,
    lastMeasured: "hace 2 semanas",
    nextAction: "Control regular",
    district: "Huancavelica",
    community: "Lircay",
  },
  {
    id: "6",
    name: "Ana Mamani Cruz",
    shortName: "Ana",
    age: "11 meses",
    ageMonths: 11,
    sex: "F",
    caregiver: "Julia Cruz",
    caregiverDni: "julia",
    status: "normal",
    weight: 8.6,
    height: 70.5,
    zScore: 0.2,
    lastMeasured: "hace 1 semana",
    nextAction: "Control regular",
    district: "Huancavelica",
    community: "Anchonga",
  },
];

const FALLBACK_MEASUREMENTS: Measurement[] = [
  {
    child_id: 3,
    type: "weight",
    value: 10.2,
    unit: "kg",
    measurement_date: new Date(
      Date.now() - 9 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sync_status: "synced",
  },
  {
    child_id: 3,
    type: "weight",
    value: 10.5,
    unit: "kg",
    measurement_date: new Date(
      Date.now() - 7 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sync_status: "synced",
  },
  {
    child_id: 3,
    type: "weight",
    value: 10.7,
    unit: "kg",
    measurement_date: new Date(
      Date.now() - 5 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sync_status: "synced",
  },
  {
    child_id: 3,
    type: "weight",
    value: 11.0,
    unit: "kg",
    measurement_date: new Date(
      Date.now() - 3 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sync_status: "synced",
  },
  {
    child_id: 3,
    type: "weight",
    value: 11.2,
    unit: "kg",
    measurement_date: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sync_status: "synced",
  },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface DataContextValue {
  children: Child[];
  measurements: Measurement[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  isOnline: boolean;
  offlineQueue: OfflineMeasurement[];
  refreshData: () => Promise<void>;
  syncOfflineQueue: () => Promise<void>;
  addMeasurementOffline: (m: OfflineMeasurement) => void;
  buildGrowthChart: (
    child: Child,
    allMeasurements: Measurement[],
  ) => GrowthPoint[];
  registerNewChild: (data: {
    childName: string;
    childAgeMonths: number;
    childSex: "M" | "F";
    childWeight: number;
    childHeight: number;
  }) => Promise<void>;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function DataProvider({
  children: reactChildren,
  isLoggedIn,
  user,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
  user: AuthUser | null;
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMeasurement[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("yanapiri_offline_queue") ?? "[]");
    } catch {
      return [];
    }
  });

  // Network event listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const refreshData = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);

    try {
      const rawData = await fetchChildren();
      const mapped = (rawData as Record<string, unknown>[]).map(mapRawChild);
      const sortOrder = { urgent: 0, "follow-up": 1, normal: 2 };
      mapped.sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
      setChildren(mapped);

      // Load measurements for the first child (CAREGIVER context)
      const firstChild = mapped.find((c) => c.status !== "normal") ?? mapped[0];
      if (firstChild) {
        const mData = await fetchMeasurements(parseInt(firstChild.id));
        const localOffline = offlineQueue.filter(
          (item) => item.childId === parseInt(firstChild.id),
        );
        setMeasurements([...mData, ...localOffline]);
      }

      // Load audit logs
      try {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      } catch {
        // Not all roles can access audit logs; silently ignore
      }
    } catch {
      // Backend offline — use fallback data
      console.warn("Backend offline — using fallback data.");

      let localChildren: Child[] = [];
      let localMeasurements: Measurement[] = [];

      try {
        const newFamilies = JSON.parse(
          localStorage.getItem("yanapiri_new_families") ?? "[]",
        );
        newFamilies.forEach((f: any) => {
          localChildren.push({
            id: f.id,
            name: f.childName,
            shortName: f.childName.split(" ")[0],
            age: formatAge(f.childAgeMonths),
            ageMonths: f.childAgeMonths,
            sex: f.childSex,
            caregiver: f.caregiverName,
            caregiverDni: f.caregiverDni,
            status: f.childStatus,
            weight: f.childWeight,
            height: f.childHeight,
            zScore: f.childZScore,
            lastMeasured: "hoy",
            nextAction:
              f.childStatus === "urgent" ? "Atención requerida" : "Monitoreo",
            district: "Registrado",
            community: "Reciente",
          } as any);

          localMeasurements.push({
            child_id: f.id as any, // Using string id for mock
            type: "weight",
            value: f.childWeight,
            unit: "kg",
            measurement_date: f.registrationDate,
            sync_status: "pending",
          });
        });
      } catch (e) {
        console.error("Error reading new families", e);
      }

      let combinedChildren = [...localChildren, ...FALLBACK_CHILDREN];

      // EXPERT LEVEL RBAC FILTERING (DATA ISOLATION)
      if (user) {
        if (user.role === "CAREGIVER") {
          // Caregivers only see their own children
          // For demo purposes, "maria" sees child 2 and 5. Registered users see their own.
          combinedChildren = combinedChildren.filter(
            (c) =>
              (c as any).caregiverDni === user.username ||
              (user.username === "maria" && (c.id === "2" || c.id === "5")) ||
              user.username === "demo",
          );
        } else if (user.role === "COMMUNITY_AGENT") {
          // Community agents only see children in their assigned community
          // For demo, "luisa" is assigned to "Anchonga"
          const assignedCommunity =
            user.username === "luisa" ? "Anchonga" : "Ccasapata";
          combinedChildren = combinedChildren.filter(
            (c) => c.community === assignedCommunity,
          );
        }
        // PROFESSIONAL and ADMIN see everything in their jurisdiction (all mock data)
      }

      setChildren(combinedChildren);
      setMeasurements([
        ...localMeasurements,
        ...FALLBACK_MEASUREMENTS,
        ...offlineQueue,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, offlineQueue, user]);

  useEffect(() => {
    if (isLoggedIn) refreshData();
  }, [isLoggedIn, refreshData]);

  // Auto-refresh mechanism (Polling)
  // Good practice: Only poll when the tab is visible and the device is online
  // to avoid draining battery and unnecessary network requests.
  useEffect(() => {
    if (!isLoggedIn) return;

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        refreshData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [isLoggedIn, refreshData]);

  const addMeasurementOffline = useCallback((m: OfflineMeasurement) => {
    setOfflineQueue((prev) => {
      const updated = [...prev, m];
      localStorage.setItem("yanapiri_offline_queue", JSON.stringify(updated));
      return updated;
    });
    setMeasurements((prev) => [...prev, m]);
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    const { postMeasurement } = await import("../lib/api");

    const remaining: OfflineMeasurement[] = [];
    for (const item of offlineQueue) {
      try {
        await postMeasurement(item.childId, {
          type: item.type,
          value: item.value,
          unit: item.unit,
          method: item.method,
        });
      } catch {
        remaining.push(item);
      }
    }

    setOfflineQueue(remaining);
    localStorage.setItem("yanapiri_offline_queue", JSON.stringify(remaining));
    await refreshData();
  }, [offlineQueue, refreshData]);

  const buildGrowthChart = useCallback(
    (child: Child, allMeasurements: Measurement[]): GrowthPoint[] => {
      const weightMeasures = allMeasurements.filter((m) => m.type === "weight");
      return weightMeasures.slice(-6).map((m) => {
        const date = new Date(m.measurement_date);
        const label = date.toLocaleDateString("es-PE", {
          month: "short",
          day: "numeric",
        });
        const [median, sd] = getWHORef(child.ageMonths, child.sex);
        return {
          label,
          value: m.value,
          p3: median - 1.88 * sd,
          band: 3.76 * sd,
          p50: median,
        };
      });
    },
    [],
  );

  const registerNewChild = useCallback(
    async (data: {
      childName: string;
      childAgeMonths: number;
      childSex: "M" | "F";
      childWeight: number;
      childHeight: number;
    }) => {
      if (!user) return;
      const [median, sd] = getWHORef(data.childAgeMonths, data.childSex);
      const zScore = parseFloat(((data.childWeight - median) / sd).toFixed(2));
      let status: "normal" | "follow-up" | "urgent" = "normal";
      if (zScore < -3) status = "urgent";
      else if (zScore < -2) status = "follow-up";

      const newFamily = {
        id: Date.now().toString(),
        childName: data.childName,
        childAgeMonths: data.childAgeMonths,
        childSex: data.childSex,
        childWeight: data.childWeight,
        childHeight: data.childHeight,
        childZScore: zScore,
        childStatus: status,
        caregiverName: user.username,
        caregiverDni: user.username,
        registrationDate: new Date().toISOString(),
      };

      const newFamilies = JSON.parse(
        localStorage.getItem("yanapiri_new_families") ?? "[]",
      );
      newFamilies.push(newFamily);
      localStorage.setItem(
        "yanapiri_new_families",
        JSON.stringify(newFamilies),
      );

      await refreshData();
    },
    [user, refreshData],
  );

  return (
    <DataContext.Provider
      value={{
        children,
        measurements,
        auditLogs,
        isLoading,
        isOnline,
        offlineQueue,
        refreshData,
        syncOfflineQueue,
        addMeasurementOffline,
        buildGrowthChart,
        registerNewChild,
      }}
    >
      {reactChildren}
    </DataContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
}
