import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectronicDisclosure } from '@domain/core/electronic-disclosure/electronic-disclosure.entity';
import { ElectronicNoticeService } from './electronic-notice.service';

/**
 * 전자공시 비즈니스 모듈
 *
 * @description
 * - 전자공시 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ElectronicDisclosure])],
  providers: [ElectronicNoticeService],
  exports: [ElectronicNoticeService],
})
export class ElectronicNoticeBusinessModule {}
