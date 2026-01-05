import { Module } from '@nestjs/common';
import { LumirStoryController } from './lumir-story.controller';

@Module({
  controllers: [LumirStoryController],
  providers: [],
})
export class LumirStoryModule {}
