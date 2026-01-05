import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVideoGalleryCommand } from '../../commands/delete-video-gallery.command';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';

@CommandHandler(DeleteVideoGalleryCommand)
export class DeleteVideoGalleryHandler
  implements ICommandHandler<DeleteVideoGalleryCommand>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(command: DeleteVideoGalleryCommand): Promise<ApiResponse<void>> {
    return this.videoService.비디오_갤러리를_삭제_한다(command.videoId);
  }
}
