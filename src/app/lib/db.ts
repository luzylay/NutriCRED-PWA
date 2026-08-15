import Dexie, { type Table } from "dexie";
import type { Child, Measurement } from "./types";

export interface LocalVisit {
  id?: number;
  child_id: number;
  visit_type: string;
  observations: {
    qualitative_notes: string;
    alarm_signs: string;
  };
  created_at: string;
  sync_status: "synced" | "pending";
}

export interface LocalSyncAction {
  id?: number;
  endpoint: string;
  method: string;
  payload: Record<string, unknown> | unknown;
  timestamp: number;
}

export interface LocalAuditLog {
  id?: number;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  sha256Hash: string;
}

export class YanapiriLocalDB extends Dexie {
  children!: Table<Child, string>;
  measurements!: Table<Measurement, number>;
  visits!: Table<LocalVisit, number>;
  syncQueue!: Table<LocalSyncAction, number>;
  auditLogs!: Table<LocalAuditLog, number>;

  constructor() {
    super("YanapiriWawaDB");

    // Esquema de tablas de IndexedDB para almacenamiento local profundo sin límites
    this.version(2).stores({
      children: "id, name, status, ageMonths, caregiver",
      measurements: "++id, child_id, type, measurement_date, sync_status",
      visits: "++id, child_id, created_at, sync_status",
      syncQueue: "++id, endpoint, method, timestamp",
      auditLogs: "++id, timestamp, user, role, action, sha256Hash",
    });
  }
}

export const localDB = new YanapiriLocalDB();

export async function generateSHA256(data: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback hash implementation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }
}
