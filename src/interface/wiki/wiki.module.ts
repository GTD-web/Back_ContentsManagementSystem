import { Module } from '@nestjs/common';
import { WikiController } from './wiki.controller';
import { WikiBusinessModule } from '@business/wiki';

@Module({
  imports: [WikiBusinessModule],
  controllers: [WikiController],
})
export class WikiModule {}
