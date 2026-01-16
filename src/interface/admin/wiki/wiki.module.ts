import { Module } from '@nestjs/common';
import { WikiBusinessModule } from '@business/wiki-business/wiki-business.module';
import { WikiContextModule } from '@context/wiki-context/wiki-context.module';
import { WikiController } from './wiki.controller';

@Module({
  imports: [WikiBusinessModule, WikiContextModule],
  controllers: [WikiController],
})
export class WikiModule {}
