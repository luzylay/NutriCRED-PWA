import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { PublicImpactModule } from './public-impact/public-impact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PatientsModule,
    MeasurementsModule,
    PublicImpactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
