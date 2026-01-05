import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '@domain/core/news/news.entity';
import { NewsService } from './news.service';

/**
 * 뉴스 비즈니스 모듈
 *
 * @description
 * - 뉴스 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsBusinessModule {}
