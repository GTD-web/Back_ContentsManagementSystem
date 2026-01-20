import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WikiBusinessModule } from '@business/wiki-business/wiki-business.module';
import { WikiContextModule } from '@context/wiki-context/wiki-context.module';
import { WikiController } from './wiki.controller';
import { WikiPermissionLog } from '@domain/sub/wiki-file-system/wiki-permission-log.entity';
import { DismissedPermissionLog } from '@domain/common/dismissed-permission-log/dismissed-permission-log.entity';

@Module({
  imports: [
    WikiBusinessModule,
    WikiContextModule,
    TypeOrmModule.forFeature([WikiPermissionLog, DismissedPermissionLog]),
  ],
  controllers: [WikiController],
})
export class WikiModule {}
