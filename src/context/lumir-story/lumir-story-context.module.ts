import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LumirStoryBusinessModule } from '@business/lumir-story';

import { CreateLumirStoryHandler } from './handlers/commands/create-lumir-story.handler';
import { UpdateLumirStoryHandler } from './handlers/commands/update-lumir-story.handler';
import { DeleteLumirStoryHandler } from './handlers/commands/delete-lumir-story.handler';
import { PublishLumirStoryHandler } from './handlers/commands/publish-lumir-story.handler';
import { UnpublishLumirStoryHandler } from './handlers/commands/unpublish-lumir-story.handler';
import { GetAllLumirStoriesHandler } from './handlers/queries/get-all-lumir-stories.handler';
import { GetLumirStoryHandler } from './handlers/queries/get-lumir-story.handler';

const CommandHandlers = [
  CreateLumirStoryHandler,
  UpdateLumirStoryHandler,
  DeleteLumirStoryHandler,
  PublishLumirStoryHandler,
  UnpublishLumirStoryHandler,
];

const QueryHandlers = [GetAllLumirStoriesHandler, GetLumirStoryHandler];

@Module({
  imports: [CqrsModule, LumirStoryBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class LumirStoryContextModule {}
