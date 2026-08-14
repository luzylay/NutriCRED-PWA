/**
 * Validación CPU de fotos de suplemento — sin GPU, sin dependencias externas.
 * Verifica que la imagen enfoque el suplemento y no el rostro del menor (política de privacidad).
 */

export interface PhotoValidationResult {
  isValid: boolean;
  privacyOk: boolean;
  supplementScore: number;
  message: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function getPixel(data: Uint8ClampedArray, width: number, x: number, y: number): RGB {
  const i = (y * width + x) * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
}

/** Detección de tono piel (regla RGB estándar, CPU) */
function isSkinTone(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    diff > 15 &&
    Math.abs(r - g) > 15 &&
    r > g &&
    r > b
  );
}

/** Colores típicos de suplementos: gotas de hierro (ámbar), pastillas (blanco), frascos */
function isSupplementColor(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const brightness = (r + g + b) / 3;

  // Pastilla / cuchara blanca
  if (brightness > 180 && diff < 40) return true;

  // Gotas de hierro ámbar/marrón
  if (r > 120 && g > 60 && b < 80 && r > g && g > b) return true;

  // Frasco naranja/amarillo (vitaminas)
  if (r > 150 && g > 100 && b < 100 && r >= g) return true;

  // Líquido oscuro en gotero
  if (brightness > 30 && brightness < 120 && r > 60 && g < 80) return true;

  return false;
}

function analyzeRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  step: number,
): { skinRatio: number; supplementRatio: number; sampled: number } {
  let skin = 0;
  let supplement = 0;
  let sampled = 0;

  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const { r, g, b } = getPixel(data, width, x, y);
      sampled++;
      if (isSkinTone(r, g, b)) skin++;
      if (isSupplementColor(r, g, b)) supplement++;
    }
  }

  return {
    skinRatio: sampled > 0 ? skin / sampled : 0,
    supplementRatio: sampled > 0 ? supplement / sampled : 0,
    sampled,
  };
}

/**
 * Valida una foto capturada.
 * - privacyOk: poca piel detectada (sin rostro prominente)
 * - supplementScore: presencia de colores/objetos de suplemento
 */
export function validateSupplementPhoto(imageData: ImageData): PhotoValidationResult {
  const { data, width, height } = imageData;
  const step = Math.max(2, Math.floor(Math.min(width, height) / 80));

  // Región central (donde el usuario debe colocar el suplemento)
  const marginX = Math.floor(width * 0.2);
  const marginY = Math.floor(height * 0.2);
  const center = analyzeRegion(data, width, height, marginX, marginY, width - marginX, height - marginY, step);

  // Región completa para detectar rostros en bordes
  const full = analyzeRegion(data, width, height, 0, 0, width, height, step * 2);

  const privacyOk = center.skinRatio < 0.18 && full.skinRatio < 0.25;
  const supplementScore = Math.min(
    100,
    Math.round(center.supplementRatio * 100 * 4 + (privacyOk ? 15 : 0)),
  );

  if (!privacyOk) {
    return {
      isValid: false,
      privacyOk: false,
      supplementScore,
      message:
        "Por privacidad del menor, enfoca solo el frasco, gotero o pastilla. Evita incluir rostros.",
    };
  }

  if (supplementScore < 20) {
    return {
      isValid: false,
      privacyOk: true,
      supplementScore,
      message:
        "No detectamos claramente el suplemento. Acerca el frasco o gotero al recuadro y usa buena luz.",
    };
  }

  return {
    isValid: true,
    privacyOk: true,
    supplementScore,
    message: "Evidencia válida. El suplemento fue detectado correctamente.",
  };
}

/** Comprime un canvas a JPEG base64 (CPU, Canvas API) */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  maxWidth = 640,
  quality = 0.72,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const src = canvas;
    let w = src.width;
    let h = src.height;

    if (w > maxWidth) {
      h = Math.round((h * maxWidth) / w);
      w = maxWidth;
    }

    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas no disponible"));
      return;
    }
    ctx.drawImage(src, 0, 0, w, h);
    out.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Error al leer imagen"));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

export const _internals = { isSkinTone, isSupplementColor, analyzeRegion };
