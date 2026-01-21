import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { SeedDataController } from './seed-data.controller';
import { SeedDataContextModule } from '@context/seed-data-context';

/**
 * 시드 데이터 모듈
 * 시드 데이터 관리 엔드포인트를 제공합니다.
 */
@Module({
  imports: [AuthContextModule, SeedDataContextModule],
  controllers: [SeedDataController],
})
export class SeedDataModule {}
