import { Module } from '@nestjs/common';
import { BrochureController } from './brochure.controller';

@Module({
  controllers: [BrochureController],
})
export class BrochureInterfaceModule {}
