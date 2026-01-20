import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DismissedPermissionLog } from './dismissed-permission-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DismissedPermissionLog])],
  exports: [TypeOrmModule],
})
export class DismissedPermissionLogModule {}
