/**
 * Motor de visión del Semáforo del Plato — 100% CPU, open source, sin dependencias externas.
 *
 * Técnicas (estándar W3C Canvas API):
 *  1. Segmentación HSV por píxel
 *  2. Componentes conectados (BFS) para confirmar regiones de alimento
 *  3. Suavizado temporal entre frames
 */

import type { DeviceTier, FoodDetection, PlateFoodId, PlateScanResult } from "./types";
import { FOOD_CATALOG } from "./types";

// ─── Tipos internos ───────────────────────────────────────────────────────────

type ColorClass = "darkRed" | "yellowOrange" | "white" | "brown";

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface ColorBuckets {
  darkRed: number;
  yellowOrange: number;
  white: number;
  brown: number;
  total: number;
  avgBrightness: number;
}

interface RegionStats {
  class: ColorClass;
  cellCount: number;
  largestBlob: number;
}

// ─── Conversión RGB → HSV ─────────────────────────────────────────────────────

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;

  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return { h, s, v };
}

function classifyPixel(r: number, g: number, b: number): ColorClass | null {
  const { h, s, v } = rgbToHsv(r, g, b);

  // Sangrecita / hígado: rojo oscuro o marrón-rojizo
  if (v >= 8 && v <= 52 && s >= 22) {
    if (h <= 22 || h >= 338) return "darkRed";
    if (h > 22 && h <= 38 && v <= 42) return "darkRed";
  }

  // Limón / naranja
  if (v >= 32 && s >= 28 && h >= 18 && h <= 72) return "yellowOrange";

  // Leche / lácteos: blanco o crema (alta luminosidad, baja saturación)
  if (v >= 62 && s <= 28) return "white";

  // Té / café: marrón
  if (v >= 8 && v <= 58 && s >= 18 && s <= 88 && h >= 8 && h <= 48) return "brown";

  return null;
}

const PREFERRED_ID: Record<ColorClass, PlateFoodId> = {
  darkRed: "sangrecita",
  yellowOrange: "limon",
  white: "leche",
  brown: "cafe",
};

// ─── Paso 1: histograma de color ──────────────────────────────────────────────

function analyzeColors(imageData: ImageData, step: number): ColorBuckets {
  const buckets: ColorBuckets = {
    darkRed: 0,
    yellowOrange: 0,
    white: 0,
    brown: 0,
    total: 0,
    avgBrightness: 0,
  };

  const { data, width, height } = imageData;
  let brightnessSum = 0;
  let count = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 128) continue;

      brightnessSum += (r + g + b) / 3;
      count++;
      buckets.total++;

      const cat = classifyPixel(r, g, b);
      if (cat) buckets[cat]++;
    }
  }

  buckets.avgBrightness = count > 0 ? brightnessSum / count : 0;
  return buckets;
}

// ─── Paso 2: componentes conectados (BFS en grilla) ─────────────────────────

function buildClassGrid(imageData: ImageData, cellSize: number): (ColorClass | null)[][] {
  const { data, width, height } = imageData;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid: (ColorClass | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null),
  );

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      let votes: Record<ColorClass, number> = {
        darkRed: 0,
        yellowOrange: 0,
        white: 0,
        brown: 0,
      };
      const x0 = gx * cellSize;
      const y0 = gy * cellSize;

      for (let dy = 0; dy < cellSize && y0 + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && x0 + dx < width; dx++) {
          const i = ((y0 + dy) * width + (x0 + dx)) * 4;
          const cat = classifyPixel(data[i], data[i + 1], data[i + 2]);
          if (cat) votes[cat]++;
        }
      }

      const best = (Object.entries(votes) as [ColorClass, number][]).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["darkRed", 0] as [ColorClass, number],
      );
      // Celda clasificada si al menos 30% de sus píxeles coinciden
      const cellPixels = Math.min(cellSize * cellSize, (width - x0) * (height - y0));
      if (best[1] / cellPixels >= 0.3) {
        grid[gy][gx] = best[0];
      }
    }
  }

  return grid;
}

function analyzeRegions(grid: (ColorClass | null)[][]): RegionStats[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stats: Map<ColorClass, { cellCount: number; largestBlob: number }> = new Map();

  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cls = grid[y][x];
      if (!cls || visited[y][x]) continue;

      // BFS
      let blobSize = 0;
      const queue: [number, number][] = [[y, x]];
      visited[y][x] = true;

      while (queue.length > 0) {
        const [cy, cx] = queue.shift()!;
        blobSize++;
        for (const [dy, dx] of dirs) {
          const ny = cy + dy;
          const nx = cx + dx;
          if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
          if (visited[ny][nx] || grid[ny][nx] !== cls) continue;
          visited[ny][nx] = true;
          queue.push([ny, nx]);
        }
      }

      const prev = stats.get(cls) ?? { cellCount: 0, largestBlob: 0 };
      prev.cellCount += blobSize;
      prev.largestBlob = Math.max(prev.largestBlob, blobSize);
      stats.set(cls, prev);
    }
  }

  return Array.from(stats.entries()).map(([cls, s]) => ({
    class: cls,
    cellCount: s.cellCount,
    largestBlob: s.largestBlob,
  }));
}

// ─── Paso 3: fusionar color + regiones → detecciones ──────────────────────────

function buildDetections(buckets: ColorBuckets, regions: RegionStats[]): FoodDetection[] {
  const results: FoodDetection[] = [];
  const minRatio = 0.02;
  const ratio = (n: number) => (buckets.total > 0 ? n / buckets.total : 0);

  const regionMap = new Map(regions.map((r) => [r.class, r]));

  for (const cls of ["darkRed", "yellowOrange", "white", "brown"] as ColorClass[]) {
    const pixelRatio = ratio(buckets[cls]);
    const region = regionMap.get(cls);

    // Requiere presencia de color Y al menos un blob de 2+ celdas
    const hasColor = pixelRatio >= minRatio;
    const hasRegion = region && region.largestBlob >= 2;
    if (!hasColor && !hasRegion) continue;

    const colorScore = Math.min(100, pixelRatio * 100 * 3.5);
    const regionScore = region
      ? Math.min(100, (region.largestBlob / 8) * 40 + (region.cellCount / 20) * 30)
      : 0;

    const confidence = Math.round(hasRegion ? colorScore * 0.55 + regionScore * 0.45 : colorScore * 0.7);
    if (confidence < 15) continue;

    const id = PREFERRED_ID[cls];
    const meta = FOOD_CATALOG[id];
    results.push({
      id,
      label: meta.label,
      category: meta.category,
      confidence: Math.min(100, confidence),
      source: hasRegion ? "region" : "color",
    });
  }

  return deduplicateCategory(results);
}

function deduplicateCategory(results: FoodDetection[]): FoodDetection[] {
  const byCategory = new Map<string, FoodDetection>();
  for (const d of results) {
    const prev = byCategory.get(d.category);
    if (!prev || d.confidence > prev.confidence) byCategory.set(d.category, d);
  }
  return Array.from(byCategory.values()).sort((a, b) => b.confidence - a.confidence);
}

// ─── Suavizado temporal ──────────────────────────────────────────────────────

const HISTORY_LEN = 6;
const detectionHistory = new Map<PlateFoodId, number[]>();

function smoothDetections(raw: FoodDetection[]): FoodDetection[] {
  for (const d of raw) {
    const hist = detectionHistory.get(d.id) ?? [];
    hist.push(d.confidence);
    if (hist.length > HISTORY_LEN) hist.shift();
    detectionHistory.set(d.id, hist);
  }

  const currentIds = new Set(raw.map((d) => d.id));
  for (const id of detectionHistory.keys()) {
    if (!currentIds.has(id)) {
      const hist = detectionHistory.get(id)!;
      hist.push(0);
      if (hist.length > HISTORY_LEN) hist.shift();
      if (hist.every((v) => v === 0)) detectionHistory.delete(id);
    }
  }

  const smoothed: FoodDetection[] = [];
  for (const [id, hist] of detectionHistory) {
    const avg = hist.reduce((a, b) => a + b, 0) / hist.length;
    const hits = hist.filter((v) => v > 18).length;
    if (hits < 2 || avg < 16) continue;

    const meta = FOOD_CATALOG[id];
    const latest = raw.find((d) => d.id === id);
    smoothed.push({
      id,
      label: meta.label,
      category: meta.category,
      confidence: Math.round(avg),
      source: latest?.source ?? "color",
    });
  }

  return smoothed.sort((a, b) => b.confidence - a.confidence);
}

// ─── API pública ─────────────────────────────────────────────────────────────

let lastFrameTime = 0;
let frameCount = 0;
let currentFps = 0;

export function resetVisionState(): void {
  detectionHistory.clear();
  lastFrameTime = 0;
  frameCount = 0;
  currentFps = 0;
}

export function analyzeFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tier: DeviceTier,
): PlateScanResult {
  const now = performance.now();
  frameCount++;
  if (now - lastFrameTime >= 1000) {
    currentFps = frameCount;
    frameCount = 0;
    lastFrameTime = now;
  }

  const w = tier.analysisWidth;
  const h = tier.analysisHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const step = tier.tier === "low" ? 3 : 2;

  const buckets = analyzeColors(imageData, step);
  const cellSize = tier.tier === "low" ? 10 : 8;
  const grid = buildClassGrid(imageData, cellSize);
  const regions = analyzeRegions(grid);
  const raw = buildDetections(buckets, regions);
  const detections = smoothDetections(raw);

  return {
    detections,
    frameBrightness: buckets.avgBrightness,
    isLowLight: buckets.avgBrightness < 40,
    engine: "cpu",
    fps: currentFps,
  };
}

export function mergeWithManual(
  auto: FoodDetection[],
  overrides: Partial<Record<PlateFoodId, "on" | "off">>,
): FoodDetection[] {
  const resultMap = new Map<PlateFoodId, FoodDetection>();

  for (const d of auto) {
    if (overrides[d.id] === "off") continue;
    resultMap.set(d.id, d);
  }

  for (const [id, override] of Object.entries(overrides) as [PlateFoodId, "on" | "off"][]) {
    if (override === "on") {
      const meta = FOOD_CATALOG[id];
      resultMap.set(id, {
        id,
        label: meta.label,
        category: meta.category,
        confidence: 100,
        source: "manual",
      });
    }
  }

  return Array.from(resultMap.values());
}

// Exportar para tests
export const _internals = { classifyPixel, rgbToHsv, analyzeColors, analyzeRegions };
