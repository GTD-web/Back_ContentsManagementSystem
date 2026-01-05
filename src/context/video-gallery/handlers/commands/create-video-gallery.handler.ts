import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoGalleryCommand } from '../../commands/create-video-gallery.command';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@CommandHandler(CreateVideoGalleryCommand)
export class CreateVideoGalleryHandler
  implements ICommandHandler<CreateVideoGalleryCommand>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    command: CreateVideoGalleryCommand,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    return this.videoService.비디오_갤러리를_생성_한다({
      code: command.code,
      title: command.title,
      categoryId: command.categoryId,
      isPublic: command.isPublic,
    } as any);
  }
}
