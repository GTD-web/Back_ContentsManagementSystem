import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { LumirStoryBusinessModule } from '@business/lumir-story-business/lumir-story-business.module';
import { LumirStoryController } from './lumir-story.controller';

/**
 * 루미르스토리 관리자 인터페이스 모듈
 * 루미르스토리 관리 엔드포인트를 제공합니다.
 */
@Module({
  imports: [AuthContextModule, LumirStoryBusinessModule],
  controllers: [LumirStoryController],
})
export class AdminLumirStoryModule {}
