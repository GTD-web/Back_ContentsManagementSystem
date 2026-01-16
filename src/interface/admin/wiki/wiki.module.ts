import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WikiBusinessModule } from '@business/wiki-business/wiki-business.module';
import { WikiContextModule } from '@context/wiki-context/wiki-context.module';
import { WikiController } from './wiki.controller';
import { WikiPermissionLog } from '@domain/sub/wiki-file-system/wiki-permission-log.entity';

@Module({
  imports: [
    WikiBusinessModule,
    WikiContextModule,
    TypeOrmModule.forFeature([WikiPermissionLog]),
  ],
  controllers: [WikiController],
})
export class WikiModule {}
