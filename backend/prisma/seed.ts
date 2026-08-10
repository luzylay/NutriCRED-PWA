import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
const prisma = new PrismaClient({ adapter });




async function main() {
  console.log('🌱 Sembrando datos en la base de datos...');

  // Limpiar tablas existentes
  await prisma.auditLog.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.child.deleteMany();
  await prisma.communityAgent.deleteMany();
  await prisma.healthProfessional.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);

  // 1. Usuarios
  const adminPassword = await bcrypt.hash('admin123', salt);
  const docPassword = await bcrypt.hash('doc123', salt);
  const agentPassword = await bcrypt.hash('agent123', salt);
  const mamaPassword = await bcrypt.hash('mama123', salt);

  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@yanapiriwawa.org',
      passwordHash: adminPassword,
      name: 'Coordinador General',
      role: 'ADMIN',
    },
  });


  const docUser = await prisma.user.create({
    data: {
      username: 'doctora_maria',
      email: 'maria.flores@minsa.gob.pe',
      passwordHash: docPassword,
      name: 'Dra. María Flores',
      role: 'PROFESSIONAL',
      professional: {
        create: {
          specialty: 'Pediatría / Nutrición',
          establishment: 'Centro de Salud Belén',
          colegiaturaCode: 'CMP-45892',
        },
      },
    },
    include: { professional: true },
  });

  const agentUser = await prisma.user.create({
    data: {
      username: 'agente_rosa',
      email: 'rosa.quispe@comunidad.pe',
      passwordHash: agentPassword,
      name: 'Rosa Quispe',
      role: 'COMMUNITY_AGENT',
      agent: {
        create: {
          district: 'Belén',
          community: 'Sector 3 - San José',
          phone: '+51 987 654 321',
        },
      },
    },
    include: { agent: true },
  });

  const mamaUser = await prisma.user.create({
    data: {
      username: 'mama_juana',
      email: 'juana.mendoza@gmail.com',
      passwordHash: mamaPassword,
      name: 'Juana Mendoza',
      role: 'CAREGIVER',
      caregiver: {
        create: {
          phone: '+51 912 345 678',
          address: 'Av. Participación Mz. B Lt. 12',
          district: 'Belén',
          community: 'Sector 3 - San José',
        },
      },
    },
    include: { caregiver: true },
  });

  console.log('✅ Usuarios creados: Admin, Doctora, Agente, Cuidadora');

  // 2. Niños
  const child1 = await prisma.child.create({
    data: {
      name: 'Liam Gabriel Mendoza',
      sex: 'M',
      dateOfBirth: new Date('2024-05-15'),
      district: 'Belén',
      community: 'Sector 3 - San José',
      zscoreActual: -2.3,
      statusAlerta: 'urgent',
      caregiverId: mamaUser.caregiver?.id,
      agentId: agentUser.agent?.id,
      professionalId: docUser.professional?.id,
    },
  });

  const child2 = await prisma.child.create({
    data: {
      name: 'Mateo Quispe',
      sex: 'M',
      dateOfBirth: new Date('2024-01-10'),
      district: 'Belén',
      community: 'Sector 3 - San José',
      zscoreActual: -1.2,
      statusAlerta: 'follow-up',
      agentId: agentUser.agent?.id,
      professionalId: docUser.professional?.id,
    },
  });

  await prisma.child.create({
    data: {
      name: 'Sofia Huamán',
      sex: 'F',
      dateOfBirth: new Date('2024-08-20'),
      district: 'Belén',
      community: 'Sector 3 - San José',
      zscoreActual: 0.1,
      statusAlerta: 'normal',
      agentId: agentUser.agent?.id,
      professionalId: docUser.professional?.id,
    },
  });


  console.log('✅ Niños creados: Liam, Mateo, Sofía');

  // 3. Mediciones
  await prisma.measurement.createMany({
    data: [
      {
        childId: child1.id,
        date: new Date('2026-06-01'),
        weight: 7.2,
        height: 68.0,
        muac: 11.2,
        zscore: -2.1,
        registeredBy: mamaUser.id,
        alertTriggered: 'follow-up',
      },
      {
        childId: child1.id,
        date: new Date('2026-08-01'),
        weight: 7.1,
        height: 69.5,
        muac: 10.8,
        zscore: -2.3,
        registeredBy: mamaUser.id,
        alertTriggered: 'urgent',
      },
      {
        childId: child2.id,
        date: new Date('2026-07-15'),
        weight: 9.8,
        height: 75.0,
        muac: 12.8,
        zscore: -1.2,
        registeredBy: agentUser.id,
        alertTriggered: 'follow-up',
      },
    ],
  });

  // 4. Alertas
  await prisma.alert.createMany({
    data: [
      {
        childId: child1.id,
        type: 'MUAC_BAJO',
        severity: 'ROJO',
        message: 'Perímetro braquial en zona roja (10.8 cm). Riesgo de desnutrición aguda.',
        status: 'pending',
      },
      {
        childId: child2.id,
        type: 'ZSCORE_CRITICO',
        severity: 'AMARILLO',
        message: 'Tendencia descendente en peso para la edad (Z-Score -1.2). Requiere seguimiento.',
        status: 'pending',
      },
    ],
  });

  // 5. Visitas
  if (agentUser.agent) {
    await prisma.visit.create({
      data: {
        childId: child1.id,
        agentId: agentUser.agent.id,
        date: new Date('2026-08-12'),
        status: 'scheduled',
        notes: 'Visita prioritaria por alerta de desnutrición y MUAC bajo.',
      },
    });
  }

  console.log('🎉 ¡Base de datos sembrada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error sembrando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
