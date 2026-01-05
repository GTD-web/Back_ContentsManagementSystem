import { Module } from '@nestjs/common';
import { LumirStoryController } from './lumir-story.controller';
import { LumirStoryBusinessModule } from '@business/lumir-story';

@Module({
  imports: [LumirStoryBusinessModule],
  controllers: [LumirStoryController],
})
export class LumirStoryModule {}
