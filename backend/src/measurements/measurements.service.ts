import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MeasurementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    child_id: string;
    weight: number;
    height: number;
    muac?: number;
    registered_by?: string;
  }) {
    const child = await this.prisma.child.findUnique({
      where: { id: data.child_id },
    });

    if (!child) {
      throw new NotFoundException(
        `Niño con ID ${data.child_id} no encontrado.`,
      );
    }

    // Cálculo aproximado de Z-Score (Peso/Talla simplificado para demo)
    // En una implementación completa usa las tablas OMS según edad y sexo
    const expectedWeight = (data.height - 45) * 0.35 + 3.5;
    const zscore = Number(((data.weight - expectedWeight) / 1.2).toFixed(2));

    let alertTriggered = 'normal';
    let severity = 'VERDE';
    let alertMessage = '';

    // ─── 1. EVALUACIÓN PERÍMETRO BRAQUIAL / MUAC (Norma Técnica MINSA NTS N° 137 / WHO SAM Guidelines) ───
    if (data.muac !== undefined && data.muac !== null) {
      if (data.muac < 11.5) {
        // MUAC < 11.5 cm (115 mm): Criterio internacional OMS para Desnutrición Aguda Severa (DAS)
        alertTriggered = 'urgent';
        severity = 'ROJO';
        alertMessage = `Alerta Crítica: MUAC extremadamente bajo (${data.muac} cm). Riesgo alto de desnutrición aguda severa (OMS / MINSA).`;
      } else if (data.muac < 12.5) {
        // 11.5 cm <= MUAC < 12.5 cm: Criterio para Desnutrición Aguda Moderada (DAM)
        alertTriggered = 'follow-up';
        severity = 'AMARILLO';
        alertMessage = `Atención: MUAC en rango de riesgo (${data.muac} cm). Requiere seguimiento nutricional en centro CRED.`;
      }
    }

    // ─── 2. EVALUACIÓN DESVIACIÓN ESTÁNDAR Z-SCORE (WHO Child Growth Standards 2006) ───
    if (zscore < -2.0) {
      // Z < -2.0 DE: Desnutrición Severa / Moderada según curvas antropométricas de la OMS
      alertTriggered = 'urgent';
      severity = 'ROJO';
      alertMessage =
        alertMessage ||
        `Alerta Crítica: Desviación Z-Score de peso/talla crítica (${zscore}).`;
    } else if (zscore < -1.0 && alertTriggered === 'normal') {
      // -2.0 DE <= Z < -1.0 DE: Riesgo nutricional / Bajo Peso
      alertTriggered = 'follow-up';
      severity = 'AMARILLO';
      alertMessage = `Atención: Z-Score bajo (${zscore}). Monitoreo preventivo recomendado.`;
    }

    const measurementData = {
      childId: data.child_id,
      weight: data.weight,
      height: data.height,
      muac: data.muac,
      zscore,
      registeredBy: data.registered_by || 'system',
      alertTriggered,
    };

    // Calculate digital signature for integrity
    const secretKey = process.env.SIGNATURE_SECRET || 'fallback_secret_key_for_demo';
    const payloadToSign = JSON.stringify(measurementData);
    const digitalSignature = crypto.createHmac('sha256', secretKey).update(payloadToSign).digest('hex');

    // Crear la medición
    const measurement = await this.prisma.measurement.create({
      data: {
        ...measurementData,
        digitalSignature,
      },
    });

    // Actualizar estado del niño
    await this.prisma.child.update({
      where: { id: data.child_id },
      data: {
        zscoreActual: zscore,
        statusAlerta: alertTriggered,
      },
    });

    // Si se disparó una alerta, crear el registro de Alerta
    if (alertTriggered !== 'normal') {
      await this.prisma.alert.create({
        data: {
          childId: data.child_id,
          type: data.muac && data.muac < 12.5 ? 'MUAC_BAJO' : 'ZSCORE_CRITICO',
          severity,
          message: alertMessage,
          status: 'pending',
        },
      });
    }

    return {
      message: 'Medición registrada exitosamente',
      measurement,
      zscore,
      alertTriggered,
    };
  }

  async findByChild(childId: string) {
    return this.prisma.measurement.findMany({
      where: { childId },
      orderBy: { date: 'desc' },
    });
  }
}
