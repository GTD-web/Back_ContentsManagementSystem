import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsBusinessModule } from '@business/analytics-business/analytics-business.module';

@Module({
  imports: [AuthContextModule, AnalyticsBusinessModule],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
