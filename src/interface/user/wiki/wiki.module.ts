import { Module } from '@nestjs/common';
import { UserWikiController } from './wiki.controller';
import { WikiBusinessModule } from '@business/wiki-business/wiki-business.module';

@Module({
  imports: [WikiBusinessModule],
  controllers: [UserWikiController],
})
export class UserWikiModule {}
