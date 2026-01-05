import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishVideoGalleryCommand } from '../../commands/unpublish-video-gallery.command';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@CommandHandler(UnpublishVideoGalleryCommand)
export class UnpublishVideoGalleryHandler
  implements ICommandHandler<UnpublishVideoGalleryCommand>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    command: UnpublishVideoGalleryCommand,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    return this.videoService.비디오_갤러리를_비공개_한다(command.videoId);
  }
}
