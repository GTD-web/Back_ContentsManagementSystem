import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';
import { LumirStoryService } from './lumir-story.service';

/**
 * 루미르 스토리 비즈니스 모듈
 *
 * @description
 * - 루미르 스토리 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([LumirStory])],
  providers: [LumirStoryService],
  exports: [LumirStoryService],
})
export class LumirStoryBusinessModule {}
