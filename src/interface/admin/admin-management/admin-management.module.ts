import { Module } from '@nestjs/common';
import { AdminManagementController } from './admin-management.controller';
import { AdminModule } from '@domain/common/admin/admin.module';
import { AuthContextModule } from '@context/auth-context';

@Module({
  imports: [AdminModule, AuthContextModule],
  controllers: [AdminManagementController],
})
export class AdminManagementModule {}
