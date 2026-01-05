import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVideoGalleryCommand } from '../../commands/update-video-gallery.command';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@CommandHandler(UpdateVideoGalleryCommand)
export class UpdateVideoGalleryHandler
  implements ICommandHandler<UpdateVideoGalleryCommand>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    command: UpdateVideoGalleryCommand,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    return this.videoService.비디오_갤러리를_수정_한다(command.videoId, {
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
    } as any);
  }
}
