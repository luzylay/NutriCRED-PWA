import { Controller, Get } from '@nestjs/common';
import { PublicImpactService } from './public-impact.service';

@Controller('public')
export class PublicImpactController {
  constructor(private readonly publicImpactService: PublicImpactService) {}

  @Get('stats')
  getPublicStats() {
    return this.publicImpactService.getPublicStats();
  }
}
