import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(@Body() body: any) {
    return this.measurementsService.create(body);
  }

  @Get('child/:childId')
  findByChild(@Param('childId') childId: string) {
    return this.measurementsService.findByChild(childId);
  }
}
