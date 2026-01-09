import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncBrochureTranslationsHandler } from './handlers/jobs/sync-brochure-translations.handler';

/**
 * 브로슈어 동기화 스케줄러
 *
 * 1분마다 브로슈어 번역 동기화 작업을 실행합니다.
 */
@Injectable()
export class BrochureSyncScheduler {
  private readonly logger = new Logger(BrochureSyncScheduler.name);

  constructor(
    private readonly syncHandler: SyncBrochureTranslationsHandler,
  ) {}

  /**
   * 1분마다 브로슈어 번역 동기화 실행
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleBrochureTranslationSync() {
    this.logger.debug('브로슈어 번역 동기화 스케줄러 실행');
    await this.syncHandler.execute();
  }
}
