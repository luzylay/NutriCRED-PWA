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

export class YanapiriLocalDB extends Dexie {
  children!: Table<Child, string>;
  measurements!: Table<Measurement, number>;
  visits!: Table<LocalVisit, number>;
  syncQueue!: Table<LocalSyncAction, number>;

  constructor() {
    super("YanapiriWawaDB");

    // Esquema de tablas de IndexedDB para almacenamiento local profundo sin límites
    this.version(1).stores({
      children: "id, name, status, ageMonths, caregiver",
      measurements: "++id, child_id, type, measurement_date, sync_status",
      visits: "++id, child_id, created_at, sync_status",
      syncQueue: "++id, endpoint, method, timestamp",
    });
  }
}

export const localDB = new YanapiriLocalDB();
