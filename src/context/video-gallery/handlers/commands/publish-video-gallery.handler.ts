import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishVideoGalleryCommand } from '../../commands/publish-video-gallery.command';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@CommandHandler(PublishVideoGalleryCommand)
export class PublishVideoGalleryHandler
  implements ICommandHandler<PublishVideoGalleryCommand>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    command: PublishVideoGalleryCommand,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    return this.videoService.비디오_갤러리를_공개_한다(command.videoId);
  }
}
