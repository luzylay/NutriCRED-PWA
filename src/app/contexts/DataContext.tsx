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
  postMeasurement,
  mapRawChild,
  formatAge,
} from "../lib/api";

import { updateAppBadge } from "../lib/pwa-capabilities";
import { getWHORef } from "../lib/who-refs";
import type {
  Child,
  Measurement,
  OfflineMeasurement,
  AuditLog,
  GrowthPoint,
  MeasureType,
  AuthUser,
  DailyTrackingRecord,
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

export interface SyncProgressState {
  current: number;
  total: number;
  isSyncing: boolean;
}

export interface ToastNotice {
  id: string;
  text: string;
  type: "info" | "success" | "warning";
}

interface DataContextValue {
  children: Child[];
  measurements: Measurement[];
  auditLogs: AuditLog[];
  dailyTracking: DailyTrackingRecord[];
  addDailyTracking: (record: DailyTrackingRecord) => void;
  isLoading: boolean;
  isOnline: boolean;
  offlineQueue: OfflineMeasurement[];
  syncProgress: SyncProgressState;
  isDataSaver: boolean;
  setDataSaver: (val: boolean) => void;
  toastNotice: ToastNotice | null;
  showToast: (text: string, type?: "info" | "success" | "warning") => void;
  isOfflineGuideOpen: boolean;
  setIsOfflineGuideOpen: (open: boolean) => void;
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
  const [dailyTracking, setDailyTracking] = useState<DailyTrackingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMeasurement[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("yanapiri_offline_queue") ?? "[]");
    } catch {
      return [];
    }
  });

  const [isDataSaver, setDataSaverState] = useState<boolean>(() => {
    try {
      return localStorage.getItem("yanapiri_data_saver") === "true";
    } catch {
      return false;
    }
  });

  const [syncProgress, setSyncProgress] = useState<SyncProgressState>({
    current: 0,
    total: 0,
    isSyncing: false,
  });

  const [toastNotice, setToastNotice] = useState<ToastNotice | null>(null);
  const [isOfflineGuideOpen, setIsOfflineGuideOpen] = useState(false);

  const setDataSaver = useCallback((val: boolean) => {
    setDataSaverState(val);
    try {
      localStorage.setItem("yanapiri_data_saver", val ? "true" : "false");
    } catch {}
  }, []);

  const showToast = useCallback((text: string, type: "info" | "success" | "warning" = "info") => {
    const id = Date.now().toString();
    setToastNotice({ id, text, type });
    setTimeout(() => {
      setToastNotice((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  }, []);

  // Network event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("🌐 Conexión restablecida. Auto-sincronizando...", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("📡 Modo Offline activo. Cambios guardados en local.", "warning");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  // Actualizar App Badging API en el icono del celular ($0 Costo)
  useEffect(() => {
    const urgentCount = children.filter((c) => c.status === "urgent").length;
    const badgeTotal = urgentCount + offlineQueue.length;
    updateAppBadge(badgeTotal);
  }, [children, offlineQueue]);

  const refreshData = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);

    const applyRbacFilter = (list: Child[]) => {
      if (!user) return list;
      if (user.role === "CAREGIVER") {
        return list.filter(
          (c) =>
            (c as any).caregiverDni === user.username ||
            (c as any).caregiverName === user.username ||
            (user.username === "maria" && (c.id === "2" || c.id === "5" || c.id === "3")) ||
            user.username === "demo"
        );
      }
      return list;
    };

    try {
      const rawData = await fetchChildren();
      let mapped = (rawData as Record<string, unknown>[]).map(mapRawChild);
      
      mapped = applyRbacFilter(mapped);
      
      const sortOrder = { urgent: 0, "follow-up": 1, normal: 2 };
      mapped.sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
      setChildren(mapped);

      const firstChild = mapped.find((c) => c.status !== "normal") ?? mapped[0];
      if (firstChild) {
        const mData = await fetchMeasurements(parseInt(firstChild.id));
        const localOffline = offlineQueue.filter(
          (item) => item.childId === parseInt(firstChild.id),
        );
        setMeasurements([...mData, ...localOffline]);
      }

      try {
        const logs = await fetchAuditLogs();
        setAuditLogs(logs);
      } catch {
        // Silently ignore
      }
    } catch {
      console.warn("Backend offline — using fallback data.");

      let localChildren: Child[] = [];
      let localMeasurements: Measurement[] = [];

      try {
        interface NewFamilyData {
          id: string;
          childName: string;
          childAgeMonths: number;
          childSex: "M" | "F";
          caregiverName: string;
          caregiverDni?: string;
          childStatus: "normal" | "follow-up" | "urgent";
          childWeight: number;
          childHeight: number;
          childZScore?: number;
          registrationDate?: string;
        }

        const newFamilies = JSON.parse(
          localStorage.getItem("yanapiri_new_families") ?? "[]",
        );

        newFamilies.forEach((f: NewFamilyData) => {
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
            zScore: f.childZScore ?? -1.0,
            lastMeasured: "hoy",
            nextAction:
              f.childStatus === "urgent" ? "Atención requerida" : "Monitoreo",
            district: "Registrado",
            community: "Reciente",
          } as any);

          localMeasurements.push({
            child_id: f.id as any,
            type: "weight",
            value: f.childWeight,
            unit: "kg",
            measurement_date: f.registrationDate || new Date().toISOString(),
            sync_status: "pending",
          });
        });
      } catch (e) {
        console.error("Error reading new families", e);
      }

      let combinedChildren = [...localChildren, ...FALLBACK_CHILDREN];
      combinedChildren = applyRbacFilter(combinedChildren);

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

  // Auto-refresh mechanism (Polling with Data Saver support)
  useEffect(() => {
    if (!isLoggedIn || isDataSaver) return;

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        refreshData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, isDataSaver, refreshData]);

  const addMeasurementOffline = useCallback((m: OfflineMeasurement) => {
    setOfflineQueue((prev) => {
      const updated = [...prev, m];
      localStorage.setItem("yanapiri_offline_queue", JSON.stringify(updated));
      return updated;
    });
    setMeasurements((prev) => [...prev, m]);
    showToast("💾 Medición guardada localmente en la memoria del dispositivo.", "info");
  }, [showToast]);

  const syncOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;

    const total = offlineQueue.length;
    setSyncProgress({ current: 0, total, isSyncing: true });

    const remaining: OfflineMeasurement[] = [];
    let doneCount = 0;

    for (const item of offlineQueue) {
      try {
        await postMeasurement(item.childId, {
          type: item.type,
          value: item.value,
          unit: item.unit,
          method: item.method,
        });
        doneCount++;
        setSyncProgress({ current: doneCount, total, isSyncing: true });
        await new Promise((r) => setTimeout(r, 400));
      } catch {
        remaining.push(item);
      }
    }

    setOfflineQueue(remaining);
    localStorage.setItem("yanapiri_offline_queue", JSON.stringify(remaining));
    setSyncProgress({ current: total, total, isSyncing: false });
    
    showToast(`✅ Sincronizados ${doneCount} de ${total} registros pendientes.`, "success");
    await refreshData();
  }, [offlineQueue, refreshData, showToast]);

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

      showToast("👶 Menor registrado exitosamente en memoria local.", "success");
      await refreshData();
    },
    [user, refreshData, showToast],
  );

  const addDailyTracking = useCallback((record: DailyTrackingRecord) => {
    const newRecord = { ...record, id: Date.now() };
    setDailyTracking(prev => [newRecord, ...prev]);
    
    if (record.has_alarms) {
      setChildren(prev => prev.map(c => 
        c.id === record.child_id.toString() 
        ? { ...c, status: "urgent", nextAction: "Referencia inmediata al E.S." } 
        : c
      ));
    }
    showToast("💊 Registro de suplemento guardado.", "success");
  }, [showToast]);

  return (
    <DataContext.Provider
      value={{
        children,
        measurements,
        auditLogs,
        dailyTracking,
        addDailyTracking,
        isLoading,
        isOnline,
        offlineQueue,
        syncProgress,
        isDataSaver,
        setDataSaver,
        toastNotice,
        showToast,
        isOfflineGuideOpen,
        setIsOfflineGuideOpen,
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

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
}
