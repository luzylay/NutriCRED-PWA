import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';

export interface CreateMeasurementDto {
  child_id: string;
  weight: number;
  height: number;
  muac?: number;
  registered_by?: string;
}

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(@Body() body: CreateMeasurementDto) {
    return this.measurementsService.create(body);
  }

  @Get('child/:childId')
  findByChild(@Param('childId') childId: string) {
    return this.measurementsService.findByChild(childId);
  }
}
