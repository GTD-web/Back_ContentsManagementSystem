import { Module } from '@nestjs/common';
import { BrochureController } from './brochure.controller';
import { BrochureBusinessModule } from '@business/brochure';

@Module({
  imports: [BrochureBusinessModule],
  controllers: [BrochureController],
})
export class BrochureInterfaceModule {}
