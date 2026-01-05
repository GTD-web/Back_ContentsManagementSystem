import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VideoGalleryBusinessModule } from '@business/video-gallery';

import { CreateVideoGalleryHandler } from './handlers/commands/create-video-gallery.handler';
import { UpdateVideoGalleryHandler } from './handlers/commands/update-video-gallery.handler';
import { DeleteVideoGalleryHandler } from './handlers/commands/delete-video-gallery.handler';
import { PublishVideoGalleryHandler } from './handlers/commands/publish-video-gallery.handler';
import { UnpublishVideoGalleryHandler } from './handlers/commands/unpublish-video-gallery.handler';
import { GetAllVideoGalleriesHandler } from './handlers/queries/get-all-video-galleries.handler';
import { GetVideoGalleryHandler } from './handlers/queries/get-video-gallery.handler';

const CommandHandlers = [
  CreateVideoGalleryHandler,
  UpdateVideoGalleryHandler,
  DeleteVideoGalleryHandler,
  PublishVideoGalleryHandler,
  UnpublishVideoGalleryHandler,
];

const QueryHandlers = [GetAllVideoGalleriesHandler, GetVideoGalleryHandler];

@Module({
  imports: [CqrsModule, VideoGalleryBusinessModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class VideoGalleryContextModule {}
