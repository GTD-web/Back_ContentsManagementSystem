import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WikiContextModule } from '@context/wiki-context';
import { StorageModule } from '@libs/storage/storage.module';
import { WikiBusinessService } from './wiki-business.service';
import { WikiPermissionLog } from '@domain/sub/wiki-file-system/wiki-permission-log.entity';

@Module({
  imports: [
    WikiContextModule,
    StorageModule,
    TypeOrmModule.forFeature([WikiPermissionLog]),
  ],
  providers: [WikiBusinessService],
  exports: [WikiBusinessService],
})
export class WikiBusinessModule {}
