import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brochure } from '@domain/core/brochure/brochure.entity';
import { BrochureService } from './brochure.service';

/**
 * 브로슈어 비즈니스 모듈
 *
 * @description
 * - 브로슈어 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Brochure])],
  providers: [BrochureService],
  exports: [BrochureService],
})
export class BrochureBusinessModule {}
