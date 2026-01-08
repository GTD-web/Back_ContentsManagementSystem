import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';
import { NewsService } from './news.service';

/**
 * 뉴스 모듈
 * 언론 보도 및 뉴스 관리 기능을 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
