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
import { getWHORef, calculateZScore, classifyZScore, classifyMUAC, classifyHemoglobin, classifyEdema } from "../lib/who-refs";
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
import { useMemo } from "react";


// ─── FALLBACK DATA ────────────────────────────────────────────────────────────

const FALLBACK_CHILDREN: Child[] = [
  {
    id: "3",
    dni: "70000003",
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
    muac: 12.8,
    hemoglobin: 11.5,
    edema: false,
    zScore: -1.8,
    lastMeasured: "hoy",
    nextAction: "Visita domiciliaria",
    district: "Huancavelica",
    community: "Anchonga",
    campaign: "Campaña Hierro",
    campaignExpiry: "31/12/2026",
    weightTrend: "stable",
    doctorDiagnosis: "Riesgo de anemia leve. Continuar con suplementación diaria.",
  },
  {
    id: "1",
    dni: "70000001",
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
    muac: 11.2,
    hemoglobin: 8.5,
    edema: false,
    zScore: -2.8,
    lastMeasured: "hace 5 días",
    nextAction: "Evaluación médica prioritaria",
    district: "Huancavelica",
    community: "Ccasapata",
    campaign: "Campaña Multinutriente",
    campaignExpiry: "15/11/2026",
    weightTrend: "down",
    doctorDiagnosis: "Anemia moderada. Requiere dosis reforzada y control en 7 días.",
  },
  {
    id: "2",
    dni: "70000002",
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
    muac: 12.0,
    hemoglobin: 10.2,
    edema: true,
    zScore: -2.5,
    lastMeasured: "hace 3 días",
    nextAction: "Evaluación médica prioritaria",
    district: "Huancavelica",
    community: "Lircay",
    campaign: "Campaña Leche Fortificada",
    campaignExpiry: "30/10/2026",
    weightTrend: "down",
    doctorDiagnosis: "Alerta Kwashiorkor por edema bilateral. Derivación inmediata a pediatría.",
  },
  {
    id: "4",
    dni: "70000004",
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
    muac: 13.0,
    hemoglobin: 10.5,
    edema: false,
    zScore: -1.4,
    lastMeasured: "hace 1 semana",
    nextAction: "Visita de consejería",
    district: "Huancavelica",
    community: "Ccasapata",
    campaign: "Campaña Complementaria",
    campaignExpiry: "28/02/2027",
    weightTrend: "up",
    doctorDiagnosis: "Recuperación lineal adecuada. Mantener dieta andina enriquecida.",
  },
  {
    id: "5",
    dni: "70000005",
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
    muac: 13.5,
    hemoglobin: 12.0,
    edema: false,
    zScore: -0.4,
    lastMeasured: "hace 2 semanas",
    nextAction: "Control regular",
    district: "Huancavelica",
    community: "Lircay",
  },
  {
    id: "6",
    dni: "70000006",
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
    muac: 14.1,
    hemoglobin: 12.5,
    edema: false,
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
  validateMeasurement: (id: number) => void;
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
    childDni?: string;
    childMuac?: number;
    childHemoglobin?: number;
    childEdema?: boolean;
  }) => Promise<void>;
}

function enrichChildrenWithMeasurements(childrenList: Child[], allMeasurements: Measurement[]): Child[] {
  return childrenList.map(child => {
    const childMeasures = allMeasurements.filter(m => String(m.child_id) === String(child.id));
    
    const sortByDate = (a: Measurement, b: Measurement) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime();
    
    const weights = childMeasures.filter(m => m.type === "weight").sort(sortByDate);
    const heights = childMeasures.filter(m => m.type === "height").sort(sortByDate);
    const muacs = childMeasures.filter(m => m.type === "muac").sort(sortByDate);
    const hbs = childMeasures.filter(m => m.type === "hemoglobin").sort(sortByDate);
    const edemas = childMeasures.filter(m => m.type === "edema").sort(sortByDate);
    
    const weight = weights[0] ? weights[0].value : child.weight;
    const height = heights[0] ? heights[0].value : child.height;
    const muac = muacs[0] ? muacs[0].value : child.muac;
    const hemoglobin = hbs[0] ? hbs[0].value : child.hemoglobin;
    const edema = edemas[0] ? (edemas[0].value === 1 || String(edemas[0].value).toLowerCase() === "true" || edemas[0].value === true) : child.edema;
    
    let zScore = child.zScore;
    if (weight > 0) {
      zScore = calculateZScore(weight, child.ageMonths, child.sex);
    }
    
    let status = classifyZScore(zScore);
    let nextAction = "Control regular";
    
    if (status === "urgent") {
      nextAction = "Evaluación médica prioritaria (Desnutrición severa)";
    } else if (status === "follow-up") {
      nextAction = "Visita de consejería nutricional";
    }
    
    if (muac !== undefined && muac > 0) {
      const muacStatus = classifyMUAC(muac);
      if (muacStatus === "urgent") {
        status = "urgent";
        nextAction = "Referencia inmediata por MUAC crítico";
      } else if (muacStatus === "follow-up" && status !== "urgent") {
        status = "follow-up";
        nextAction = "Visita domiciliaria por MUAC en riesgo";
      }
    }
    
    if (hemoglobin !== undefined && hemoglobin > 0) {
      const hbStatus = classifyHemoglobin(hemoglobin);
      if (hbStatus === "urgent") {
        status = "urgent";
        nextAction = "Referencia médica por Anemia Severa";
      } else if (hbStatus === "follow-up" && status !== "urgent") {
        status = "follow-up";
        nextAction = "Tratamiento de anemia y visita de consejería";
      }
    }
    
    if (edema) {
      status = "urgent";
      nextAction = "Referencia inmediata por edema bilateral (Kwashiorkor)";
    }
    
    const allSorted = childMeasures.sort(sortByDate);
    const lastMeasured = allSorted[0] 
      ? new Date(allSorted[0].measurement_date).toLocaleDateString("es-PE", { day: "numeric", month: "short" })
      : child.lastMeasured;
      
    return {
      ...child,
      weight,
      height,
      muac,
      hemoglobin,
      edema,
      zScore,
      status,
      nextAction,
      lastMeasured,
    };
  });
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
          childDni?: string;
          childName: string;
          childAgeMonths: number;
          childSex: "M" | "F";
          caregiverName: string;
          caregiverDni?: string;
          childStatus: "normal" | "follow-up" | "urgent";
          childWeight: number;
          childHeight: number;
          childMuac?: number;
          childHemoglobin?: number;
          childEdema?: boolean;
          childZScore?: number;
          registrationDate?: string;
        }

        const newFamilies = JSON.parse(
          localStorage.getItem("yanapiri_new_families") ?? "[]",
        );

        newFamilies.forEach((f: NewFamilyData) => {
          localChildren.push({
            id: f.id,
            dni: f.childDni || ("7000000" + f.id.slice(-1)),
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
            muac: f.childMuac,
            hemoglobin: f.childHemoglobin,
            edema: f.childEdema,
            zScore: f.childZScore ?? -1.0,
            lastMeasured: "hoy",
            nextAction:
              f.childStatus === "urgent" ? "Atención requerida" : "Monitoreo",
            district: "Registrado",
            community: "Reciente",
          } as any);

          const date = f.registrationDate || new Date().toISOString();

          if (f.childWeight && f.childWeight > 0) {
            localMeasurements.push({
              child_id: f.id as any,
              type: "weight",
              value: f.childWeight,
              unit: "kg",
              measurement_date: date,
              sync_status: "pending",
              operator: "professional",
              validated: true,
            });
          }
          if (f.childHeight && f.childHeight > 0) {
            localMeasurements.push({
              child_id: f.id as any,
              type: "height",
              value: f.childHeight,
              unit: "cm",
              measurement_date: date,
              sync_status: "pending",
              operator: "professional",
              validated: true,
            });
          }
          if (f.childMuac && f.childMuac > 0) {
            localMeasurements.push({
              child_id: f.id as any,
              type: "muac",
              value: f.childMuac,
              unit: "cm",
              measurement_date: date,
              sync_status: "pending",
              operator: "professional",
              validated: true,
            });
          }
          if (f.childHemoglobin && f.childHemoglobin > 0) {
            localMeasurements.push({
              child_id: f.id as any,
              type: "hemoglobin",
              value: f.childHemoglobin,
              unit: "g/dL",
              measurement_date: date,
              sync_status: "pending",
              operator: "professional",
              validated: true,
            });
          }
          if (f.childEdema !== undefined) {
            localMeasurements.push({
              child_id: f.id as any,
              type: "edema",
              value: f.childEdema ? 1 : 0,
              unit: "",
              measurement_date: date,
              sync_status: "pending",
              operator: "professional",
              validated: true,
            });
          }
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
      childDni?: string;
      childMuac?: number;
      childHemoglobin?: number;
      childEdema?: boolean;
    }) => {
      if (!user) return;
      const [median, sd] = getWHORef(data.childAgeMonths, data.childSex);
      const zScore = parseFloat(((data.childWeight - median) / sd).toFixed(2));
      
      let status: "normal" | "follow-up" | "urgent" = "normal";
      if (zScore < -3) status = "urgent";
      else if (zScore < -2) status = "follow-up";

      if (data.childMuac && classifyMUAC(data.childMuac) === "urgent") status = "urgent";
      else if (data.childMuac && classifyMUAC(data.childMuac) === "follow-up" && status !== "urgent") status = "follow-up";
      
      if (data.childHemoglobin && classifyHemoglobin(data.childHemoglobin) === "urgent") status = "urgent";
      else if (data.childHemoglobin && classifyHemoglobin(data.childHemoglobin) === "follow-up" && status !== "urgent") status = "follow-up";
      
      if (data.childEdema) status = "urgent";

      const newFamily = {
        id: Date.now().toString(),
        childDni: data.childDni || ("7000000" + String(Date.now()).slice(-1)),
        childName: data.childName,
        childAgeMonths: data.childAgeMonths,
        childSex: data.childSex,
        childWeight: data.childWeight,
        childHeight: data.childHeight,
        childMuac: data.childMuac,
        childHemoglobin: data.childHemoglobin,
        childEdema: data.childEdema,
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
      showToast("🚨 Reporte de signos de alarma guardado.", "warning");
    } else {
      showToast("💊 Registro de suplemento guardado.", "success");
    }
  }, [showToast]);

  const validateMeasurement = useCallback((id: number) => {
    setMeasurements((prev) =>
      prev.map((m) => (m.id === id ? { ...m, validated: true } : m))
    );
    showToast("✅ Medición validada por personal de salud.", "success");
  }, [showToast]);

  const enrichedChildren = useMemo(() => {
    return enrichChildrenWithMeasurements(children, measurements);
  }, [children, measurements]);

  return (
    <DataContext.Provider
      value={{
        children: enrichedChildren,
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
        validateMeasurement,
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
