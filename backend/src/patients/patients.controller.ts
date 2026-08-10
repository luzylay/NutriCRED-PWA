import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

export interface CreateChildDto {
  name: string;
  sex: string;
  date_of_birth: string;
  district: string;
  community: string;
  caregiver_id?: string;
  agent_id?: string;
}

@Controller('children')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateChildDto) {
    return this.patientsService.create(body);
  }
}
