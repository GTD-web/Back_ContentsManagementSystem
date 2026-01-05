import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from '@domain/sub/wiki/wiki.entity';
import { WikiService } from './wiki.service';

/**
 * 위키 비즈니스 모듈
 *
 * @description
 * - 위키 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Wiki])],
  providers: [WikiService],
  exports: [WikiService],
})
export class WikiBusinessModule {}
