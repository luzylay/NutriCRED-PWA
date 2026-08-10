import { Module } from '@nestjs/common';
import { PublicImpactController } from './public-impact.controller';
import { PublicImpactService } from './public-impact.service';

@Module({
  controllers: [PublicImpactController],
  providers: [PublicImpactService],
  exports: [PublicImpactService],
})
export class PublicImpactModule {}
