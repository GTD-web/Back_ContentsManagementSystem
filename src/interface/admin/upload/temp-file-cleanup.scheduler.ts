import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { S3Service } from '@libs/storage/s3.service';

/**
 * Temp 파일 정리 스케줄러
 *
 * Presigned URL을 통해 S3 temp/ 폴더에 업로드되었지만
 * 실제 제출(위키/공지사항/설문 등)되지 않은 파일을 자동으로 삭제합니다.
 *
 * - 매시간 실행
 * - 24시간 이상 경과한 temp 파일 삭제
 */
@Injectable()
export class TempFileCleanupScheduler {
  private readonly logger = new Logger(TempFileCleanupScheduler.name);

  constructor(private readonly s3Service: S3Service) {}

  /**
   * 매시간 오래된 temp 파일을 정리한다
   * (매시 정각에 실행)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async 오래된_temp_파일을_정리한다(): Promise<void> {
    this.logger.log('오래된 temp 파일 정리 시작');

    try {
      const deletedCount = await this.s3Service.deleteOldTempFiles(24);
      this.logger.log(
        `오래된 temp 파일 정리 완료 - ${deletedCount}개 삭제`,
      );
    } catch (error) {
      this.logger.error('오래된 temp 파일 정리 실패', error);
    }
  }
}
