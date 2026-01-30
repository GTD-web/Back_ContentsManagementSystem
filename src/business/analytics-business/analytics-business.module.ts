import { Module } from '@nestjs/common';
import { PageViewModule } from '@domain/sub/analytics/page-view.module';
import { AnalyticsBusinessService } from './analytics-business.service';

@Module({
  imports: [PageViewModule],
  providers: [AnalyticsBusinessService],
  exports: [AnalyticsBusinessService],
})
export class AnalyticsBusinessModule {}
