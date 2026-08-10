import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const children = await this.prisma.child.findMany({
      include: {
        caregiver: { include: { user: true } },
        agent: { include: { user: true } },
        professional: { include: { user: true } },
        measurements: {
          orderBy: { date: 'desc' },
        },
        alerts: {
          where: { status: 'pending' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return children.map((c) => ({
      id: c.id,
      name: c.name,
      sex: c.sex,
      date_of_birth: c.dateOfBirth.toISOString(),
      district: c.district,
      community: c.community,
      zscore_actual: c.zscoreActual,
      status_alerta: c.statusAlerta,
      caregiver: c.caregiver ? {
        id: c.caregiver.id,
        name: c.caregiver.user?.name || 'Cuidador',
        phone: c.caregiver.phone,
      } : null,
      agent: c.agent ? {
        id: c.agent.id,
        name: c.agent.user?.name || 'Agente Comunitario',
        phone: c.agent.phone,
      } : null,
      measurements: c.measurements.map(m => ({
        id: m.id,
        date: m.date.toISOString(),
        weight: m.weight,
        height: m.height,
        muac: m.muac,
        zscore: m.zscore,
        alert_triggered: m.alertTriggered,
      })),
      alerts: c.alerts,
    }));
  }

  async findOne(id: string) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: {
        caregiver: { include: { user: true } },
        agent: { include: { user: true } },
        professional: { include: { user: true } },
        measurements: {
          orderBy: { date: 'asc' },
        },
        alerts: true,
        visits: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!child) {
      throw new NotFoundException(`Niño con ID ${id} no encontrado.`);
    }

    return {
      id: child.id,
      name: child.name,
      sex: child.sex,
      date_of_birth: child.dateOfBirth.toISOString(),
      district: child.district,
      community: child.community,
      zscore_actual: child.zscoreActual,
      status_alerta: child.statusAlerta,
      caregiver: child.caregiver ? {
        id: child.caregiver.id,
        name: child.caregiver.user?.name,
        phone: child.caregiver.phone,
      } : null,
      agent: child.agent ? {
        id: child.agent.id,
        name: child.agent.user?.name,
        phone: child.agent.phone,
      } : null,
      measurements: child.measurements.map(m => ({
        id: m.id,
        date: m.date.toISOString(),
        weight: m.weight,
        height: m.height,
        muac: m.muac,
        zscore: m.zscore,
        alert_triggered: m.alertTriggered,
      })),
      alerts: child.alerts,
      visits: child.visits,
    };
  }

  async create(data: {
    name: string;
    sex: string;
    date_of_birth: string;
    district: string;
    community: string;
    caregiver_id?: string;
    agent_id?: string;
  }) {
    const child = await this.prisma.child.create({
      data: {
        name: data.name,
        sex: data.sex,
        dateOfBirth: new Date(data.date_of_birth),
        district: data.district,
        community: data.community,
        caregiverId: data.caregiver_id,
        agentId: data.agent_id,
      },
    });

    return child;
  }
}
